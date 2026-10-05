import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { initialSavedState } from '@/domain/state';
import { manualLocation, provinces } from '@/domain/locations';
import { persistence } from '@/services/storage';
import { notificationScheduler } from '@/services/notifications/scheduler';
import { refreshNotificationPlan, serializeNotificationWork } from '@/services/notifications/refresh-plan';
import { NOTIFICATION_REFRESH_TASK, runBackgroundNotificationRefresh, setLiveNotificationSnapshot, syncBackgroundRefresh } from '@/services/notifications/background-refresh';

jest.mock('expo-background-task', () => ({
  BackgroundTaskResult: { Success: 1, Failed: 2 }, BackgroundTaskStatus: { Available: 2, Restricted: 1 },
  getStatusAsync: jest.fn(), registerTaskAsync: jest.fn(), unregisterTaskAsync: jest.fn(),
}));
jest.mock('expo-task-manager', () => ({ isAvailableAsync: jest.fn(), isTaskRegisteredAsync: jest.fn(), isTaskDefined: jest.fn(), defineTask: jest.fn() }));
jest.mock('@/services/storage', () => ({ persistence: { read: jest.fn(), write: jest.fn() } }));
jest.mock('@/services/notifications/scheduler', () => ({ notificationScheduler: { getPermission: jest.fn(), reconcile: jest.fn(), cancelAll: jest.fn() } }));

const state = {
  ...initialSavedState,
  location: manualLocation(provinces.find((p) => p.name === 'İstanbul')!),
  preferences: { ...initialSavedState.preferences, notifications: { ...initialSavedState.preferences.notifications, enabled: true, reminderMinutes: 15 as const } },
};
const snapshot = { location: state.location, adjustments: state.preferences.adjustments, notifications: state.preferences.notifications };
beforeEach(() => {
  jest.useFakeTimers().setSystemTime(new Date('2026-10-05T00:00:00+03:00'));
  Object.defineProperty(Platform, 'OS', { value: 'android', configurable: true });
  Object.defineProperty(Constants, 'appOwnership', { value: null, configurable: true });
  setLiveNotificationSnapshot(null);
  jest.mocked(persistence.read).mockResolvedValue(JSON.stringify(state));
  jest.mocked(notificationScheduler.getPermission).mockResolvedValue('granted');
  jest.mocked(notificationScheduler.cancelAll).mockResolvedValue(undefined);
  jest.mocked(notificationScheduler.reconcile).mockImplementation(async (plan) => ({ scheduledCount: plan.length, scheduledThrough: plan.at(-1)?.at ?? null }));
  jest.mocked(TaskManager.isAvailableAsync).mockResolvedValue(true);
  jest.mocked(TaskManager.isTaskRegisteredAsync).mockResolvedValue(false);
  jest.mocked(BackgroundTask.getStatusAsync).mockResolvedValue(BackgroundTask.BackgroundTaskStatus.Available);
  jest.mocked(BackgroundTask.registerTaskAsync).mockResolvedValue(undefined);
});
afterEach(() => { jest.useRealTimers(); });

test('headless refresh reads saved preferences and advances the horizon without opening the app', async () => {
  expect(await runBackgroundNotificationRefresh()).toBe(BackgroundTask.BackgroundTaskResult.Success);
  const first = jest.mocked(notificationScheduler.reconcile).mock.calls[0]![0];
  expect(first).toHaveLength(150);
  jest.setSystemTime(new Date('2026-10-06T00:00:00+03:00'));
  await runBackgroundNotificationRefresh();
  const second = jest.mocked(notificationScheduler.reconcile).mock.calls[1]![0];
  expect(second).toHaveLength(150);
  expect(second.at(-1)!.localDate).toBe('2026-10-20');
  const oldIds = new Set(first.map((item) => item.id));
  expect(second.filter((item) => !oldIds.has(item.id))).toHaveLength(10);
  expect(notificationScheduler.cancelAll).not.toHaveBeenCalled();
  expect(persistence.write).not.toHaveBeenCalled();
});

test('disabled notifications cancel the queue and unregister the worker', async () => {
  jest.mocked(persistence.read).mockResolvedValue(JSON.stringify({ ...state, preferences: { ...state.preferences, notifications: { ...snapshot.notifications, enabled: false } } }));
  jest.mocked(TaskManager.isTaskRegisteredAsync).mockResolvedValue(true);
  await runBackgroundNotificationRefresh();
  expect(notificationScheduler.cancelAll).toHaveBeenCalledTimes(1);
  expect(notificationScheduler.reconcile).not.toHaveBeenCalled();
  expect(BackgroundTask.unregisterTaskAsync).toHaveBeenCalledWith(NOTIFICATION_REFRESH_TASK);
});

test.each([null, '{broken'])('unreadable saved state preserves already scheduled notifications: %s', async (raw) => {
  jest.mocked(persistence.read).mockResolvedValue(raw);
  expect(await runBackgroundNotificationRefresh()).toBe(BackgroundTask.BackgroundTaskResult.Failed);
  expect(notificationScheduler.cancelAll).not.toHaveBeenCalled();
  expect(notificationScheduler.reconcile).not.toHaveBeenCalled();
});

test('permission revocation cancels the queue without requesting a permission prompt', async () => {
  jest.mocked(notificationScheduler.getPermission).mockResolvedValue('denied');
  expect(await runBackgroundNotificationRefresh()).toBe(BackgroundTask.BackgroundTaskResult.Success);
  expect(notificationScheduler.cancelAll).toHaveBeenCalled();
  expect(notificationScheduler.reconcile).not.toHaveBeenCalled();
});

test('live disabled preference wins over a stale persisted enabled preference', async () => {
  setLiveNotificationSnapshot({ ...snapshot, notifications: { ...snapshot.notifications, enabled: false } });
  await runBackgroundNotificationRefresh();
  expect(persistence.read).not.toHaveBeenCalled();
  expect(notificationScheduler.reconcile).not.toHaveBeenCalled();
});

test.each([
  { ...snapshot, location: null },
  { ...snapshot, notifications: { ...snapshot.notifications, atPrayerTime: false, reminderMinutes: 0 as const } },
])('no location or no delivery type leaves no work to schedule', async (inactive) => {
  setLiveNotificationSnapshot(inactive);
  jest.mocked(TaskManager.isTaskRegisteredAsync).mockResolvedValue(true);
  await runBackgroundNotificationRefresh();
  expect(notificationScheduler.reconcile).not.toHaveBeenCalled();
  expect(BackgroundTask.unregisterTaskAsync).toHaveBeenCalledWith(NOTIFICATION_REFRESH_TASK);
});

test('a long gap rebuilds future dates without replaying missed notifications', async () => {
  jest.setSystemTime(new Date('2026-11-06T12:00:00+03:00'));
  await runBackgroundNotificationRefresh();
  const plan = jest.mocked(notificationScheduler.reconcile).mock.calls[0]![0];
  expect(plan.length).toBeGreaterThan(0);
  expect(plan.every((item) => item.at > Date.now())).toBe(true);
  expect(plan.at(-1)!.localDate).toBe('2026-11-20');
});

test('foreground and background mutation cannot run concurrently and recover after errors', async () => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const foreground = serializeNotificationWork(async () => { await gate; return refreshNotificationPlan(snapshot); });
  const background = runBackgroundNotificationRefresh();
  await Promise.resolve();
  expect(notificationScheduler.reconcile).not.toHaveBeenCalled();
  release();
  await Promise.all([foreground, background]);
  expect(notificationScheduler.reconcile).toHaveBeenCalledTimes(2);
  jest.mocked(notificationScheduler.reconcile).mockRejectedValueOnce(new Error('transient'));
  expect(await runBackgroundNotificationRefresh()).toBe(BackgroundTask.BackgroundTaskResult.Failed);
  expect(await runBackgroundNotificationRefresh()).toBe(BackgroundTask.BackgroundTaskResult.Success);
});

test('daily worker registers once, without resetting its interval on foreground', async () => {
  expect(await syncBackgroundRefresh(true)).toBe('registered');
  expect(BackgroundTask.registerTaskAsync).toHaveBeenCalledWith(NOTIFICATION_REFRESH_TASK, { minimumInterval: 1440 });
  jest.mocked(TaskManager.isTaskRegisteredAsync).mockResolvedValue(true);
  await syncBackgroundRefresh(true);
  expect(BackgroundTask.registerTaskAsync).toHaveBeenCalledTimes(1);
});

test('Expo Go and restricted systems do not report a worker as registered', async () => {
  Object.defineProperty(Constants, 'appOwnership', { value: 'expo', configurable: true });
  expect(await syncBackgroundRefresh(true)).toBe('unavailable');
  Object.defineProperty(Constants, 'appOwnership', { value: null, configurable: true });
  jest.mocked(BackgroundTask.getStatusAsync).mockResolvedValue(BackgroundTask.BackgroundTaskStatus.Restricted);
  expect(await syncBackgroundRefresh(true)).toBe('unavailable');
  expect(BackgroundTask.registerTaskAsync).not.toHaveBeenCalled();
});

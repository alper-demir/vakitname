import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import { decodeSavedState } from '@/domain/state';
import { persistence } from '@/services/storage';
import { NotificationSnapshot, refreshNotificationPlan, serializeNotificationWork } from './refresh-plan';

export const NOTIFICATION_REFRESH_TASK = 'vakit-notification-refresh-v1';
export const REFRESH_INTERVAL_MINUTES = 24 * 60;
export type BackgroundRefreshStatus = 'registered' | 'disabled' | 'unavailable' | 'error';
let liveSnapshot: NotificationSnapshot | null = null;

// A mounted app's preferences can be newer than its asynchronous SQLite write.
export function setLiveNotificationSnapshot(snapshot: NotificationSnapshot | null) {
  liveSnapshot = snapshot;
}

export async function syncBackgroundRefresh(enabled: boolean): Promise<BackgroundRefreshStatus> {
  if (Platform.OS !== 'android' || Constants.appOwnership === 'expo' || !await TaskManager.isAvailableAsync()) return 'unavailable';
  const registered = await TaskManager.isTaskRegisteredAsync(NOTIFICATION_REFRESH_TASK);
  if (!enabled) {
    if (registered) await BackgroundTask.unregisterTaskAsync(NOTIFICATION_REFRESH_TASK);
    return 'disabled';
  }
  if (await BackgroundTask.getStatusAsync() !== BackgroundTask.BackgroundTaskStatus.Available) return 'unavailable';
  // Do not restart the daily timer on every foreground transition.
  if (!registered) await BackgroundTask.registerTaskAsync(NOTIFICATION_REFRESH_TASK, { minimumInterval: REFRESH_INTERVAL_MINUTES });
  return 'registered';
}

export async function runBackgroundNotificationRefresh() {
  return serializeNotificationWork(async () => {
    try {
      let snapshot = liveSnapshot;
      if (!snapshot) {
        const raw = await persistence.read();
        const decoded = decodeSavedState(raw);
        // A failed/corrupt read must not erase previously scheduled notifications.
        if (!raw || decoded.recovered) return BackgroundTask.BackgroundTaskResult.Failed;
        snapshot = { location: decoded.state.location, adjustments: decoded.state.preferences.adjustments, notifications: decoded.state.preferences.notifications };
      }
      const result = await refreshNotificationPlan(snapshot);
      if (!result.enabled) await syncBackgroundRefresh(false);
      // Do not rewrite the whole saved UI state from a headless worker. The UI
      // reads the actual native queue when it next refreshes.
      return BackgroundTask.BackgroundTaskResult.Success;
    } catch {
      return BackgroundTask.BackgroundTaskResult.Failed;
    }
  });
}

// Loaded from the entry point, before Router: no screen needs to mount.
if (Platform.OS === 'android' && Constants.appOwnership !== 'expo' && !TaskManager.isTaskDefined(NOTIFICATION_REFRESH_TASK)) {
  TaskManager.defineTask(NOTIFICATION_REFRESH_TASK, async ({ error }) =>
    error ? BackgroundTask.BackgroundTaskResult.Failed : runBackgroundNotificationRefresh());
}

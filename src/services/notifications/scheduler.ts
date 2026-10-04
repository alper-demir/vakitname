import { PermissionsAndroid, Platform } from 'react-native';
import Constants from 'expo-constants';
import type { NotificationPermissionsStatus } from 'expo-notifications';
import { NotificationPlanItem } from '@/domain/notifications';
import { NotificationPreferences, NotificationSound } from '@/domain/types';

export type NotificationPermission = 'undetermined' | 'granted' | 'denied' | 'provisional' | 'unsupported';
export type ReconcileResult = { scheduledCount: number; scheduledThrough: number | null };
export type SimulationNotification = { title: string; body: string; seconds: number };
export function diffNotificationPlan(existingIds: string[], planIds: string[]) {
  const wanted = new Set(planIds);
  const existing = new Set(existingIds);
  return { stale: existingIds.filter((id) => !wanted.has(id)), missing: planIds.filter((id) => !existing.has(id)) };
}

export function buildNotificationSimulation(preferences: NotificationPreferences, locationName: string): SimulationNotification[] {
  const items: SimulationNotification[] = [];
  if (preferences.reminderMinutes > 0) items.push({
    title: `İmsak vaktine ${preferences.reminderMinutes} dakika`,
    body: `${locationName} · simülasyon`,
    seconds: 3,
  });
  if (preferences.atPrayerTime) items.push({
    title: 'İmsak vakti girdi',
    body: locationName,
    seconds: items.length ? 6 : 3,
  });
  return items;
}

const OWNER = 'vakit';
const SOUND_CHANNEL = 'vakit-prayer-v1';
const SILENT_CHANNEL = 'vakit-silent-v1';
const isExpoGo = Constants.appOwnership === 'expo';
type NotificationsModule = typeof import('expo-notifications');
let modulePromise: Promise<NotificationsModule> | null = null;

async function loadExpoGoLocalNotifications(): Promise<NotificationsModule> {
  const modules = await Promise.all([
    import('expo-notifications/build/scheduleNotificationAsync'),
    import('expo-notifications/build/getAllScheduledNotificationsAsync'),
    import('expo-notifications/build/cancelScheduledNotificationAsync'),
    import('expo-notifications/build/NotificationPermissions'),
    import('expo-notifications/build/setNotificationChannelAsync'),
    import('expo-notifications/build/NotificationsHandler'),
    import('expo-notifications/build/Notifications.types'),
    import('expo-notifications/build/NotificationChannelManager.types'),
    import('expo-notifications/build/NotificationPermissions.types'),
  ]);
  return Object.assign({}, ...modules) as NotificationsModule;
}

async function loadNotifications() {
  modulePromise ??= (isExpoGo ? loadExpoGoLocalNotifications() : import('expo-notifications')).then((module) => {
    module.setNotificationHandler({
      handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
    });
    return module;
  });
  return modulePromise;
}

function permissionFrom(status: NotificationPermissionsStatus, Notifications: NotificationsModule): NotificationPermission {
  if (status.granted) return 'granted';
  if (status.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) return 'provisional';
  if (status.ios?.status === Notifications.IosAuthorizationStatus.EPHEMERAL) return 'provisional';
  return status.status === 'denied' ? 'denied' : 'undetermined';
}

async function ensureChannels(Notifications: NotificationsModule) {
  if (Platform.OS !== 'android' || isExpoGo) return;
  await Notifications.setNotificationChannelAsync(SOUND_CHANNEL, {
    name: 'Vakit bildirimleri', description: 'Namaz vakti ve ön hatırlatma bildirimleri',
    importance: Notifications.AndroidImportance.HIGH, sound: isExpoGo ? 'default' : 'vakit-tone.wav',
    vibrationPattern: [0, 180, 90, 180], enableVibrate: true,
  });
  await Notifications.setNotificationChannelAsync(SILENT_CHANNEL, {
    name: 'Sessiz vakit bildirimleri', description: 'Ses ve titreşim olmadan namaz vakti bildirimleri',
    importance: Notifications.AndroidImportance.DEFAULT, sound: null, enableVibrate: false,
  });
}

export const notificationScheduler = {
  async getPermission(): Promise<NotificationPermission> {
    if (Platform.OS === 'web') return 'unsupported';
    if (Platform.OS === 'android') {
      if (Number(Platform.Version) < 33) return 'granted';
      return (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)) ? 'granted' : 'denied';
    }
    const Notifications = await loadNotifications();
    return permissionFrom(await Notifications.getPermissionsAsync(), Notifications);
  },
  async requestPermission(): Promise<NotificationPermission> {
    if (Platform.OS === 'web') return 'unsupported';
    const Notifications = await loadNotifications();
    await ensureChannels(Notifications);
    if (Platform.OS === 'android') {
      if (Number(Platform.Version) < 33) return 'granted';
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      return result === PermissionsAndroid.RESULTS.GRANTED ? 'granted' : 'denied';
    }
    return permissionFrom(await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowSound: true, allowBadge: false } }), Notifications);
  },
  async reconcile(plan: NotificationPlanItem[], sound: NotificationSound): Promise<ReconcileResult> {
    if (Platform.OS === 'web') return { scheduledCount: 0, scheduledThrough: null };
    const Notifications = await loadNotifications();
    await ensureChannels(Notifications);
    const existing = (await Notifications.getAllScheduledNotificationsAsync()).filter((request) => request.content.data?.owner === OWNER);
    const wanted = new Map(plan.map((item) => [item.id, item]));
    const diff = diffNotificationPlan(existing.map((request) => request.identifier), plan.map((item) => item.id));
    await Promise.all(diff.stale.map((identifier) => Notifications.cancelScheduledNotificationAsync(identifier)));
    for (const identifier of diff.missing) {
      const item = wanted.get(identifier)!;
      const silent = sound === 'silent';
      await Notifications.scheduleNotificationAsync({
        identifier: item.id,
        content: {
          title: item.title, body: item.body, sound: silent ? undefined : sound === 'default' || isExpoGo ? 'default' : 'vakit-tone.wav',
          data: { owner: OWNER, prayerId: item.prayerId, localDate: item.localDate, kind: item.kind },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: item.at,
          channelId: isExpoGo ? undefined : silent ? SILENT_CHANNEL : SOUND_CHANNEL,
        },
      });
    }
    return { scheduledCount: plan.length, scheduledThrough: plan.at(-1)?.at ?? null };
  },
  async cancelAll(): Promise<void> {
    if (Platform.OS === 'web') return;
    const Notifications = await loadNotifications();
    const existing = (await Notifications.getAllScheduledNotificationsAsync()).filter((request) => request.content.data?.owner === OWNER);
    await Promise.all(existing.map((request) => Notifications.cancelScheduledNotificationAsync(request.identifier)));
  },
  async scheduleTest(sound: NotificationSound): Promise<void> {
    if (Platform.OS === 'web') throw new Error('unsupported');
    const Notifications = await loadNotifications();
    await ensureChannels(Notifications);
    const silent = sound === 'silent';
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Vakit bildirimi hazır', body: 'Bu bir test bildirimidir.', sound: silent ? undefined : sound === 'default' || isExpoGo ? 'default' : 'vakit-tone.wav', data: { owner: 'vakit-test' } },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3,
        channelId: isExpoGo ? undefined : silent ? SILENT_CHANNEL : SOUND_CHANNEL,
      },
    });
  },
  async scheduleSimulation(preferences: NotificationPreferences, locationName: string): Promise<number> {
    if (Platform.OS === 'web') throw new Error('unsupported');
    const items = buildNotificationSimulation(preferences, locationName);
    if (!items.length) return 0;
    const Notifications = await loadNotifications();
    await ensureChannels(Notifications);
    const silent = preferences.sound === 'silent';
    await Promise.all(items.map((item, index) => Notifications.scheduleNotificationAsync({
      identifier: `vakit-simulation-${Date.now()}-${index}`,
      content: {
        title: item.title,
        body: item.body,
        sound: silent ? undefined : preferences.sound === 'default' || isExpoGo ? 'default' : 'vakit-tone.wav',
        data: { owner: 'vakit-simulation', kind: index === 0 && preferences.reminderMinutes > 0 ? 'reminder' : 'prayer-time' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: item.seconds,
        channelId: isExpoGo ? undefined : silent ? SILENT_CHANNEL : SOUND_CHANNEL,
      },
    })));
    return items.length;
  },
};

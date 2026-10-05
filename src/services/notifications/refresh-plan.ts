import { addDays, localDateAt } from '@/domain/time';
import { buildNotificationPlan, NOTIFICATION_HORIZON_DAYS } from '@/domain/notifications';
import { Adjustments, NotificationPreferences, VakitLocation } from '@/domain/types';
import { prayerProvider } from '@/services/prayer/adhan-provider';
import { notificationScheduler } from './scheduler';

export type NotificationSnapshot = { location: VakitLocation | null; adjustments: Adjustments; notifications: NotificationPreferences };

export function needsNotificationRefresh(snapshot: NotificationSnapshot) {
  return Boolean(snapshot.location && snapshot.notifications.enabled
    && (snapshot.notifications.atPrayerTime || snapshot.notifications.reminderMinutes > 0)
    && Object.values(snapshot.notifications.prayerEnabled).some(Boolean));
}

// One native mutation at a time, shared by mounted UI and headless task.
let pending: Promise<unknown> = Promise.resolve();
export function serializeNotificationWork<T>(work: () => Promise<T>): Promise<T> {
  const next = pending.catch(() => {}).then(work);
  pending = next;
  return next;
}

export async function refreshNotificationPlan(snapshot: NotificationSnapshot, forceReschedule = false, now = Date.now()) {
  const permission = await notificationScheduler.getPermission();
  const enabled = needsNotificationRefresh(snapshot) && (permission === 'granted' || permission === 'provisional');
  if (!enabled || !snapshot.location) {
    await notificationScheduler.cancelAll();
    return { permission, enabled: false, schedule: { scheduledCount: 0, scheduledThrough: null } };
  }
  const localDate = localDateAt(now, snapshot.location.timeZone);
  const days = Array.from({ length: NOTIFICATION_HORIZON_DAYS }, (_, index) =>
    prayerProvider.getDay(addDays(localDate, index), snapshot.location!, snapshot.adjustments));
  const plan = buildNotificationPlan(days, snapshot.notifications, snapshot.location.name, now);
  if (forceReschedule) await notificationScheduler.cancelAll();
  const schedule = await notificationScheduler.reconcile(plan, snapshot.notifications.sound);
  return { permission, enabled: true, schedule };
}

import { NotificationPreferences, PrayerDay, PrayerId } from './types';
import { formatTime } from './time';

export type NotificationPlanItem = {
  id: string;
  at: number;
  prayerId: PrayerId;
  localDate: string;
  kind: 'prayer-time' | 'reminder';
  title: string;
  body: string;
};

const prayerNames: Record<PrayerId, string> = {
  imsak: 'İmsak', gunes: 'Güneş', ogle: 'Öğle', ikindi: 'İkindi', aksam: 'Akşam', yatsi: 'Yatsı',
};

export const NOTIFICATION_HORIZON_DAYS = 15;
export const MAX_NOTIFICATION_REQUESTS = NOTIFICATION_HORIZON_DAYS * 6 * 2;

export function buildNotificationPlan(days: PrayerDay[], preferences: NotificationPreferences, locationName: string, now: number, limit = MAX_NOTIFICATION_REQUESTS): NotificationPlanItem[] {
  if (!preferences.enabled || limit <= 0) return [];
  const items: NotificationPlanItem[] = [];
  for (const day of days) for (const event of day.events) {
    if (!preferences.prayerEnabled[event.id]) continue;
    const name = prayerNames[event.id];
    if (preferences.reminderMinutes > 0) {
      const at = event.at - preferences.reminderMinutes * 60_000;
      if (at > now) items.push({
        id: `vakit-${event.at}-${event.id}-before-${preferences.reminderMinutes}-${preferences.sound}`,
        at, prayerId: event.id, localDate: event.localDate, kind: 'reminder',
        title: `${name} vaktine ${preferences.reminderMinutes} dakika`,
        body: `${formatTime(event.at, day.timeZone)} · ${locationName}`,
      });
    }
    if (preferences.atPrayerTime && event.at > now) items.push({
      id: `vakit-${event.at}-${event.id}-time-${preferences.sound}`,
      at: event.at, prayerId: event.id, localDate: event.localDate, kind: 'prayer-time',
      title: event.id === 'gunes' ? 'Güneş doğdu' : `${name} vakti girdi`,
      body: locationName,
    });
  }
  return items.sort((a, b) => a.at - b.at).slice(0, limit);
}

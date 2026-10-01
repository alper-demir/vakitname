import { defaultNotificationPreferences, defaultPreferences, NotificationSchedule, prayerIds, Preferences, VakitLocation } from './types';

export type SavedState = { version: 3; onboardingComplete: boolean; location: VakitLocation | null; preferences: Preferences; notificationSchedule: NotificationSchedule };
export const initialSavedState: SavedState = { version: 3, onboardingComplete: false, location: null, preferences: defaultPreferences, notificationSchedule: { scheduledCount: 0, scheduledThrough: null } };
export function decodeSavedState(raw: string | null): { state: SavedState; recovered: boolean } {
  if (!raw) return { state: initialSavedState, recovered: false };
  try {
    const v = JSON.parse(raw);
    const p = v.preferences;
    if (![1, 2, 3].includes(v.version) || !p || !['auto', 'spring', 'summer', 'autumn', 'winter'].includes(p.theme?.season)
      || !['solar', 'system', 'light', 'dark'].includes(p.theme?.appearance) || !['auto', 'on', 'off'].includes(p.theme?.ramadan)
      || !Number.isInteger(p.hijriOffset) || Math.abs(p.hijriOffset) > 2
      || prayerIds.some((id) => !Number.isInteger(p.adjustments?.[id]) || Math.abs(p.adjustments[id]) > 30)) throw new Error('Invalid preferences');
    const notifications = v.version < 3 ? defaultNotificationPreferences : p.notifications;
    if (!notifications || typeof notifications.enabled !== 'boolean' || typeof notifications.atPrayerTime !== 'boolean'
      || ![0, 15, 30, 45].includes(notifications.reminderMinutes) || !['vakit', 'default', 'silent'].includes(notifications.sound)
      || prayerIds.some((id) => typeof notifications.prayerEnabled?.[id] !== 'boolean')) throw new Error('Invalid notification preferences');
    const l = v.location;
    if (l !== null && (!l || typeof l.id !== 'string' || typeof l.name !== 'string' || typeof l.province !== 'string'
      || !Number.isFinite(l.latitude) || !Number.isFinite(l.longitude) || l.latitude < 35 || l.latitude > 43 || l.longitude < 25 || l.longitude > 45
      || l.timeZone !== 'Europe/Istanbul' || !['manual', 'gps'].includes(l.source)
      || !['gps', 'seat', 'representative'].includes(l.coordinateKind) || !Number.isFinite(l.updatedAt))) throw new Error('Invalid location');
    const onboardingComplete = v.version === 1 ? Boolean(l) : v.onboardingComplete;
    if (typeof onboardingComplete !== 'boolean') throw new Error('Invalid onboarding state');
    const schedule = v.version < 3 ? initialSavedState.notificationSchedule : v.notificationSchedule;
    if (!schedule || !Number.isInteger(schedule.scheduledCount) || schedule.scheduledCount < 0
      || (schedule.scheduledThrough !== null && !Number.isFinite(schedule.scheduledThrough))) throw new Error('Invalid notification schedule');
    return { state: { version: 3, onboardingComplete, location: l, preferences: { ...p, notifications }, notificationSchedule: schedule }, recovered: false };
  } catch { return { state: initialSavedState, recovered: true }; }
}

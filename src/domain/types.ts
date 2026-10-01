export const prayerIds = ['imsak', 'gunes', 'ogle', 'ikindi', 'aksam', 'yatsi'] as const;
export type PrayerId = (typeof prayerIds)[number];
export type Adjustments = Record<PrayerId, number>;
export const zeroAdjustments: Adjustments = { imsak: 0, gunes: 0, ogle: 0, ikindi: 0, aksam: 0, yatsi: 0 };
export type VakitLocation = {
  id: string;
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  timeZone: 'Europe/Istanbul';
  source: 'manual' | 'gps';
  coordinateKind: 'seat' | 'representative' | 'gps';
  updatedAt: number;
  accuracy?: number;
};
export type PrayerEvent = { id: PrayerId; at: number; localDate: string };
export type PrayerDay = {
  localDate: string;
  timeZone: string;
  events: PrayerEvent[];
  sunrise: number;
  sunset: number;
  source: { id: string; method: string; version: string };
};
export interface PrayerTimesProvider {
  getDay(localDate: string, location: VakitLocation, adjustments: Adjustments): PrayerDay;
}
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export const solarPhases = ['dawn', 'day', 'sunset', 'night'] as const;
export type SolarPhase = (typeof solarPhases)[number];
export const themeAppearances = ['solar', 'system', 'light', 'dark', ...solarPhases] as const;
export type ThemeAppearance = (typeof themeAppearances)[number];
export type ThemePreferences = {
  season: Season | 'auto';
  appearance: ThemeAppearance;
  ramadan: 'auto' | 'on' | 'off';
};
export type NotificationSound = 'vakit' | 'default' | 'silent';
export type ReminderMinutes = 0 | 15 | 30 | 45;
export type NotificationPreferences = {
  enabled: boolean;
  prayerEnabled: Record<PrayerId, boolean>;
  atPrayerTime: boolean;
  reminderMinutes: ReminderMinutes;
  sound: NotificationSound;
};
export type NotificationSchedule = {
  scheduledCount: number;
  scheduledThrough: number | null;
};
export const defaultNotificationPreferences: NotificationPreferences = {
  enabled: false,
  prayerEnabled: { imsak: true, gunes: false, ogle: true, ikindi: true, aksam: true, yatsi: true },
  atPrayerTime: true,
  reminderMinutes: 0,
  sound: 'vakit',
};
export type Preferences = {
  theme: ThemePreferences;
  adjustments: Adjustments;
  hijriOffset: number;
  notifications: NotificationPreferences;
};
export const defaultPreferences: Preferences = {
  theme: { season: 'auto', appearance: 'solar', ramadan: 'auto' },
  adjustments: zeroAdjustments,
  hijriOffset: 0,
  notifications: defaultNotificationPreferences,
};

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
export type SolarPhase = 'dawn' | 'day' | 'sunset' | 'night';
export type ThemePreferences = {
  season: Season | 'auto';
  appearance: 'solar' | 'system' | 'light' | 'dark';
  ramadan: 'auto' | 'on' | 'off';
};
export type Preferences = {
  theme: ThemePreferences;
  adjustments: Adjustments;
  hijriOffset: number;
};
export const defaultPreferences: Preferences = {
  theme: { season: 'auto', appearance: 'solar', ramadan: 'auto' },
  adjustments: zeroAdjustments,
  hijriOffset: 0,
};

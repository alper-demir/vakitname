import { DateTime } from 'luxon';
import { PrayerDay, Season, solarPhases, SolarPhase, ThemePreferences } from './types';

export type Theme = {
  season: Season; phase: SolarPhase; dark: boolean; ramadan: boolean;
  background: readonly [string, string, string]; surface: string; surfaceStrong: string;
  text: string; muted: string; subtle: string; accent: string; accentText: string;
  highlight: string; line: string; track: string; landscape: string; glow: string;
};
export const seasonNames: Record<Season, string> = { spring: 'İlkbahar', summer: 'Yaz', autumn: 'Sonbahar', winter: 'Kış' };
export const phaseNames: Record<SolarPhase, string> = { dawn: 'Şafak', day: 'Gündüz', sunset: 'Gün batımı', night: 'Gece' };
export function seasonAt(epoch: number, zone: string): Season {
  const month = DateTime.fromMillis(epoch, { zone }).month;
  return month >= 3 && month <= 5 ? 'spring' : month >= 6 && month <= 8 ? 'summer' : month >= 9 && month <= 11 ? 'autumn' : 'winter';
}
export function solarPhaseAt(now: number, day: Pick<PrayerDay, 'sunrise' | 'sunset'>): SolarPhase {
  const minute = 60000;
  if (now >= day.sunrise - 45 * minute && now < day.sunrise + 15 * minute) return 'dawn';
  if (now >= day.sunset - 45 * minute && now < day.sunset + 30 * minute) return 'sunset';
  return now >= day.sunrise + 15 * minute && now < day.sunset - 45 * minute ? 'day' : 'night';
}
const colors: Record<Season, { day: readonly [string, string, string]; accent: string; darkAccent: string; landscape: string }> = {
  spring: { day: ['#F3F9F3', '#ECF5EE', '#E0EDE4'], accent: '#49694E', darkAccent: '#A4D3B2', landscape: '#ADC6B3' },
  summer: { day: ['#ECF6F5', '#F7F5E6', '#F0E4C2'], accent: '#856521', darkAccent: '#E8CB7C', landscape: '#C6B78F' },
  autumn: { day: ['#F8F3E9', '#F5ECDF', '#EADCC8'], accent: '#8B5D36', darkAccent: '#EDBD85', landscape: '#BCA181' },
  winter: { day: ['#EFF6FA', '#EAF0F4', '#DCE7EE'], accent: '#42677B', darkAccent: '#A3D4ED', landscape: '#A2BCCC' },
};
export function resolveTheme({ season, phase, ramadan, preferences, systemDark }: {
  season: Season; phase: SolarPhase; ramadan: boolean; preferences: ThemePreferences; systemDark: boolean;
}): Theme {
  const chosen = preferences.season === 'auto' ? season : preferences.season;
  const manualPhase = solarPhases.includes(preferences.appearance as SolarPhase) ? preferences.appearance as SolarPhase : null;
  const effectivePhase = manualPhase ?? phase;
  const phasePalette = preferences.appearance === 'solar' || manualPhase !== null;
  const festive = preferences.ramadan === 'on' || (preferences.ramadan === 'auto' && ramadan);
  const dark = preferences.appearance === 'dark' || (preferences.appearance === 'system' && systemDark)
    || (phasePalette && (effectivePhase === 'night' || effectivePhase === 'sunset'));
  const palette = colors[chosen];
  const regularBackground: Theme['background'] = dark
    ? effectivePhase === 'sunset' && phasePalette ? ['#352C43', '#61423F', '#2D3038'] : ['#101C2B', '#17283B', '#203449']
    : effectivePhase === 'dawn' && phasePalette ? ['#F7EEF0', '#F2F5ED', palette.day[2]] : palette.day;
  const background: Theme['background'] = festive
    ? dark ? ['#09241F', '#12372E', '#182D36'] : ['#F7F2E3', '#ECF2E8', '#DDE8DD']
    : regularBackground;
  if (festive) return {
    season: chosen, phase: effectivePhase, dark, ramadan: true, background,
    surface: dark ? '#FFF4D80D' : '#FFFDF2C7', surfaceStrong: dark ? '#173B32' : '#FFFDF4',
    text: dark ? '#F6F0DD' : '#20382F', muted: dark ? '#C3CEBE' : '#586E62', subtle: dark ? '#9DAE9F' : '#687B70',
    accent: dark ? '#E8C76F' : '#7A5C16', accentText: dark ? '#173228' : '#FFF9E8',
    highlight: dark ? '#E8C76F18' : '#E7DFC0AA', line: dark ? '#F3D98B20' : '#7A5C1624',
    track: dark ? '#FFFFFF16' : '#315F4D16', landscape: dark ? '#356052' : '#809E8B', glow: dark ? '#F0D583' : '#D8B75E',
  };
  return {
    season: chosen, phase: effectivePhase, dark, ramadan: false, background,
    surface: dark ? '#FFFFFF09' : '#FFFFFFA6', surfaceStrong: dark ? '#223346' : '#FFFFFF',
    text: dark ? '#F1F2EA' : '#263C32', muted: dark ? '#B9C7CF' : '#627568', subtle: dark ? '#95A5B4' : '#6D7F73',
    accent: dark ? palette.darkAccent : palette.accent,
    accentText: dark ? '#142333' : '#FFFFFF', highlight: dark ? '#FFFFFF0D' : '#E7EEDFAA',
    line: dark ? '#FFFFFF14' : '#49694E16', track: dark ? '#FFFFFF14' : '#49694E14',
    landscape: dark ? '#32475B' : palette.landscape, glow: dark ? palette.darkAccent : palette.accent,
  };
}

import { defaultPreferences, prayerIds, Preferences, VakitLocation } from './types';

export type SavedState = { version: 2; onboardingComplete: boolean; location: VakitLocation | null; preferences: Preferences };
export const initialSavedState: SavedState = { version: 2, onboardingComplete: false, location: null, preferences: defaultPreferences };
export function decodeSavedState(raw: string | null): { state: SavedState; recovered: boolean } {
  if (!raw) return { state: initialSavedState, recovered: false };
  try {
    const v = JSON.parse(raw);
    const p = v.preferences;
    if (![1, 2].includes(v.version) || !p || !['auto', 'spring', 'summer', 'autumn', 'winter'].includes(p.theme?.season)
      || !['solar', 'system', 'light', 'dark'].includes(p.theme?.appearance) || !['auto', 'on', 'off'].includes(p.theme?.ramadan)
      || !Number.isInteger(p.hijriOffset) || Math.abs(p.hijriOffset) > 2
      || prayerIds.some((id) => !Number.isInteger(p.adjustments?.[id]) || Math.abs(p.adjustments[id]) > 30)) throw new Error('Invalid preferences');
    const l = v.location;
    if (l !== null && (!l || typeof l.id !== 'string' || typeof l.name !== 'string' || typeof l.province !== 'string'
      || !Number.isFinite(l.latitude) || !Number.isFinite(l.longitude) || l.latitude < 35 || l.latitude > 43 || l.longitude < 25 || l.longitude > 45
      || l.timeZone !== 'Europe/Istanbul' || !['manual', 'gps'].includes(l.source)
      || !['gps', 'seat', 'representative'].includes(l.coordinateKind) || !Number.isFinite(l.updatedAt))) throw new Error('Invalid location');
    const onboardingComplete = v.version === 1 ? Boolean(l) : v.onboardingComplete;
    if (typeof onboardingComplete !== 'boolean') throw new Error('Invalid onboarding state');
    return { state: { version: 2, onboardingComplete, location: l, preferences: p }, recovered: false };
  } catch { return { state: initialSavedState, recovered: true }; }
}

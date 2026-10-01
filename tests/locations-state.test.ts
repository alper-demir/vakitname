import { provinces, districts, gpsLocation, isInTurkey, manualLocation, matchesSearch } from '@/domain/locations';
import { decodeSavedState, initialSavedState } from '@/domain/state';

test('offline catalogue has all provinces and consistent unique district parents', () => {
  expect(provinces).toHaveLength(81);
  expect(new Set(districts.map((d) => d.id)).size).toBe(districts.length);
  expect(districts.every((d) => provinces.some((p) => p.id === d.provinceId))).toBe(true);
});
test.each([['İstanbul', 'istanbul'], ['Iğdır', 'igdir'], ['Şişli', 'sisli'], ['Çankaya', 'cankaya']])('Turkish search %s', (name, query) => expect(matchesSearch(name, query)).toBe(true));
test('border polygon accepts Turkish cities and rejects other countries inside a simple bounding box', () => {
  expect(isInTurkey(41.01, 28.95)).toBe(true);
  expect(isInTurkey(39.92, 32.85)).toBe(true);
  expect(isInTurkey(42.69, 23.32)).toBe(false);
  expect(isInTurkey(35.18, 33.38)).toBe(false);
  expect(isInTurkey(36.2, 37.16)).toBe(false);
});
test('GPS retains actual coordinate, not nearest district centre', () => {
  const location = gpsLocation(41.01, 28.95, 50, 123);
  expect(location).toMatchObject({ latitude: 41.01, longitude: 28.95, source: 'gps', updatedAt: 123 });
});
test('storage validates corrupted and future schemas without crashing', () => {
  expect(decodeSavedState('{broken').recovered).toBe(true);
  expect(decodeSavedState(JSON.stringify({ ...initialSavedState, version: 999 })).recovered).toBe(true);
  const saved = { ...initialSavedState, location: manualLocation(provinces[0]!, undefined, 123) };
  expect(decodeSavedState(JSON.stringify(saved))).toEqual({ state: saved, recovered: false });
});
test('version 1 state migrates without replaying onboarding for an existing location', () => {
  const location = manualLocation(provinces[0]!, undefined, 123);
  const legacy = { version: 1, location, preferences: initialSavedState.preferences };
  expect(decodeSavedState(JSON.stringify(legacy))).toEqual({
    state: { ...initialSavedState, onboardingComplete: true, location },
    recovered: false,
  });
});
test('version 2 state receives safe notification defaults', () => {
  const legacyPreferences = { ...initialSavedState.preferences, notifications: undefined };
  const legacy = { version: 2, onboardingComplete: true, location: null, preferences: legacyPreferences };
  const decoded = decodeSavedState(JSON.stringify(legacy));
  expect(decoded.recovered).toBe(false);
  expect(decoded.state.version).toBe(3);
  expect(decoded.state.preferences.notifications).toMatchObject({ enabled: false, atPrayerTime: true, reminderMinutes: 0, sound: 'vakit' });
  expect(decoded.state.notificationSchedule).toEqual({ scheduledCount: 0, scheduledThrough: null });
});

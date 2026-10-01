import { calendarProvider, ramadanAt } from '@/domain/calendar';
import { addDays, getEvent } from '@/domain/time';
import { defaultPreferences, Season, SolarPhase, VakitLocation, zeroAdjustments } from '@/domain/types';
import { resolveTheme, seasonAt, solarPhaseAt } from '@/domain/theme';
import { AdhanProvider } from '@/services/prayer/adhan-provider';
import { hijriMonths } from '@/data/hijri-months';

const provider = new AdhanProvider();
const location: VakitLocation = { id: 'test', name: 'İstanbul', province: 'İstanbul', latitude: 41.01384, longitude: 28.94966, source: 'manual', coordinateKind: 'seat', timeZone: 'Europe/Istanbul', updatedAt: 0 };
const days = (date: string) => [date, addDays(date, 1)].map((d) => provider.getDay(d, location, zeroAdjustments));

test('Turkey Ramadan 2026 starts on Feb 19 and has 29 days', () => {
  expect(calendarProvider.getDate('2026-02-18', 0).month).toBe(8);
  expect(calendarProvider.getDate('2026-02-19', 0)).toMatchObject({ month: 9, day: 1, source: 'diyanet-months' });
  expect(calendarProvider.getDate('2026-03-19', 0)).toMatchObject({ month: 9, day: 29 });
  expect(calendarProvider.getDate('2026-03-20', 0)).toMatchObject({ month: 10, day: 1 });
});
test('all reference month intervals are 29 or 30 days', () => {
  for (let i = 0; i < hijriMonths.length - 1; i++) expect([29, 30]).toContain((Date.parse(hijriMonths[i + 1]![0]) - Date.parse(hijriMonths[i]![0])) / 86400000);
});
test('offset changes calendar once; out-of-coverage dates disclose fallback', () => {
  expect(calendarProvider.getDate('2026-02-18', 1)).toMatchObject({ month: 9, day: 1 });
  expect(calendarProvider.getDate('2030-01-01', 0).source).toBe('umm-al-qura');
});
test('Ramadan eve begins at sunset and targets the first fasting day', () => {
  const [today, tomorrow] = days('2026-02-18');
  expect(ramadanAt(today!.sunset - 1, today!, tomorrow!, 0).active).toBe(false);
  expect(ramadanAt(today!.sunset + 1, today!, tomorrow!, 0)).toMatchObject({ active: true, target: { id: 'imsak', localDate: '2026-02-19' } });
});
test('last fasting day still targets iftar, then stops after iftar', () => {
  const [today, tomorrow] = days('2026-03-19');
  const iftar = getEvent(today!, 'aksam');
  expect(ramadanAt(iftar.at - 1, today!, tomorrow!, 0).target?.id).toBe('aksam');
  expect(ramadanAt(iftar.at, today!, tomorrow!, 0)).toMatchObject({ active: false, target: null });
});
test.each(['spring', 'summer', 'autumn', 'winter'] as Season[])('%s has a readable theme for each phase', (season) => {
  for (const phase of ['dawn', 'day', 'sunset', 'night'] as SolarPhase[]) {
    const result = resolveTheme({ season, phase, ramadan: false, preferences: defaultPreferences.theme, systemDark: false });
    expect(result.season).toBe(season);
    expect(result.dark).toBe(['sunset', 'night'].includes(phase));
    expect(result.text).not.toBe(result.background[0]);
  }
});
test('explicit light/season choices win and forced Ramadan does not change calendar', () => {
  const result = resolveTheme({ season: 'winter', phase: 'night', ramadan: false, systemDark: true, preferences: { season: 'summer', appearance: 'light', ramadan: 'on' } });
  expect(result).toMatchObject({ dark: false, season: 'summer', ramadan: true });
  expect(calendarProvider.getDate('2026-09-30', 0).month).toBe(4);
});
test('Ramadan atmosphere is automatic by default, visibly distinct and can be disabled', () => {
  expect(defaultPreferences.theme.ramadan).toBe('auto');
  const normal = resolveTheme({ season: 'spring', phase: 'day', ramadan: false, preferences: defaultPreferences.theme, systemDark: false });
  const automatic = resolveTheme({ season: 'spring', phase: 'day', ramadan: true, preferences: defaultPreferences.theme, systemDark: false });
  const disabled = resolveTheme({ season: 'spring', phase: 'day', ramadan: true, preferences: { ...defaultPreferences.theme, ramadan: 'off' }, systemDark: false });
  expect(normal.ramadan).toBe(false);
  expect(automatic.ramadan).toBe(true);
  expect(automatic.background).not.toEqual(normal.background);
  expect(automatic.surface).not.toBe(normal.surface);
  expect(disabled).toMatchObject({ ramadan: false, background: normal.background, accent: normal.accent });
});
test.each([
  ['dawn', false], ['day', false], ['sunset', true], ['night', true],
] as [SolarPhase, boolean][])('manual %s appearance locks the displayed solar phase', (appearance, dark) => {
  const result = resolveTheme({
    season: 'autumn', phase: appearance === 'night' ? 'day' : 'night', ramadan: false, systemDark: false,
    preferences: { ...defaultPreferences.theme, appearance },
  });
  expect(result).toMatchObject({ phase: appearance, dark });
});
test('season and phase boundaries are derived from local dates and sun', () => {
  expect(seasonAt(Date.parse('2026-02-28T22:00:00Z'), 'Europe/Istanbul')).toBe('spring');
  const [today] = days('2026-09-30');
  expect(solarPhaseAt(today!.sunrise - 45 * 60000 - 1, today!)).toBe('night');
  expect(solarPhaseAt(today!.sunrise - 45 * 60000, today!)).toBe('dawn');
  expect(solarPhaseAt(today!.sunrise + 15 * 60000, today!)).toBe('day');
  expect(solarPhaseAt(today!.sunset - 45 * 60000, today!)).toBe('sunset');
  expect(solarPhaseAt(today!.sunset + 30 * 60000, today!)).toBe('night');
});

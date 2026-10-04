import { buildMonthRows, buildRamadanRows, getRamadanRange } from '@/domain/calendar-table';
import { zeroAdjustments } from '@/domain/types';
import { prayerProvider } from '@/services/prayer/adhan-provider';

const location = { id: 'istanbul', name: 'İstanbul', province: 'İstanbul', latitude: 41.01384, longitude: 28.94966, timeZone: 'Europe/Istanbul' as const, source: 'manual' as const, coordinateKind: 'seat' as const, updatedAt: 0 };

test('monthly table creates every civil day with calculated prayer events', () => {
  const rows = buildMonthRows('2026-02', location, zeroAdjustments, '2026-02-19', prayerProvider, 0);
  expect(rows).toHaveLength(28);
  expect(rows[18]).toMatchObject({ localDate: '2026-02-19', isToday: true, hijri: { month: 9, day: 1 } });
  expect(rows[18]!.prayerDay.events).toHaveLength(6);
});

test('Ramadan range follows the factual month boundary and produces its table', () => {
  const range = getRamadanRange('2026-03-01');
  expect(range).toMatchObject({ start: '2026-02-19', endExclusive: '2026-03-20', days: 29, source: 'diyanet-months' });
  const rows = buildRamadanRows(range!, location, zeroAdjustments, '2026-03-01', prayerProvider, 0);
  expect(rows).toHaveLength(29);
  expect(rows.at(-1)?.localDate).toBe('2026-03-19');
  expect(rows.every((row) => row.isFasting)).toBe(true);
});

test('2028 Ramadan stays on packaged Diyanet month boundaries after the 2027 rollover', () => {
  expect(getRamadanRange('2028-02-01')).toMatchObject({
    start: '2028-01-28', endExclusive: '2028-02-26', days: 29, source: 'diyanet-months',
  });
});

test('Ramadan fallback can find a later Umm al-Qura period outside packaged years', () => {
  const range = getRamadanRange('2030-01-01');
  expect(range?.source).toBe('umm-al-qura');
  expect(range?.start.slice(0, 4)).toBe('2030');
  expect(range!.days).toBeGreaterThanOrEqual(29);
  expect(range!.days).toBeLessThanOrEqual(30);
});

test('calendar table applies the user Hicri display offset without changing prayer dates', () => {
  const normal = buildMonthRows('2026-02', location, zeroAdjustments, '2026-02-19', prayerProvider, 0);
  const shifted = buildMonthRows('2026-02', location, zeroAdjustments, '2026-02-19', prayerProvider, 1);
  expect(shifted[18]!.hijri.day).toBe(normal[19]!.hijri.day);
  expect(shifted[18]!.prayerDay.events[0]!.at).toBe(normal[18]!.prayerDay.events[0]!.at);
});

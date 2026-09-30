import { AdhanProvider } from '@/services/prayer/adhan-provider';
import { addDays, countdown, formatTime, getEvent, localDateAt, timelineAt } from '@/domain/time';
import { VakitLocation, zeroAdjustments } from '@/domain/types';

const provider = new AdhanProvider();
const location: VakitLocation = { id: 'test', name: 'İstanbul', province: 'İstanbul', latitude: 41.01384, longitude: 28.94966, source: 'manual', coordinateKind: 'seat', timeZone: 'Europe/Istanbul', updatedAt: 0 };
const day = (date: string) => provider.getDay(date, location, zeroAdjustments);

describe('civil date and prayer timeline', () => {
  test('the selected Turkish civil day is independent of the host timezone', () => {
    const result = day('2026-09-30');
    // Adhan 4.4.6 regression, not a claim of exact Diyanet agreement.
    expect(result.events.map((e) => formatTime(e.at))).toEqual(['05:28', '06:53', '12:59', '16:16', '18:55', '20:14']);
    expect(result.events.every((e) => localDateAt(e.at) === '2026-09-30')).toBe(true);
  });
  test('records the measured difference from the official Istanbul daily table', () => {
    // https://namazvakitleri.diyanet.gov.tr/tr-TR/9541/istanbul-icin-namaz-vakti
    // Retrieved 2026-09-30. Order: imsak, sunrise, noon, afternoon, sunset, night.
    const official = ['05:28', '06:52', '12:59', '16:18', '18:56', '20:15'];
    const minutes = (value: string) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3));
    expect(day('2026-09-30').events.map((event, i) => minutes(formatTime(event.at)) - minutes(official[i]!)))
      .toEqual([0, 1, 0, -2, -1, -1]);
  });
  test('after Yatsı targets tomorrow; after midnight the same target belongs to today', () => {
    const days = ['2026-09-30', '2026-10-01', '2026-10-02'].map(day);
    const target = getEvent(days[1]!, 'imsak');
    expect(timelineAt(days, getEvent(days[0]!, 'yatsi').at + 1).next).toEqual(target);
    const midnight = Date.parse('2026-10-01T00:00:00+03:00');
    expect(timelineAt(days, midnight).next).toEqual(target);
    expect(localDateAt(midnight)).toBe(target.localDate);
  });
  test('the exact event instant moves on, including sunrise as a distinct event', () => {
    const days = ['2026-09-29', '2026-09-30', '2026-10-01'].map(day);
    expect(timelineAt(days, getEvent(days[1]!, 'imsak').at).next.id).toBe('gunes');
    expect(timelineAt(days, getEvent(days[1]!, 'gunes').at).next.id).toBe('ogle');
  });
  test.each([['2026-12-31', '2027-01-01'], ['2028-02-28', '2028-02-29'], ['2028-02-29', '2028-03-01']])('calendar rollover %s', (from, to) => expect(addDays(from, 1)).toBe(to));
  test('countdown recovers after time jumps and never goes negative', () => {
    expect(countdown(100000, 0)).toBe('00:01:40');
    expect(countdown(100000, 90000)).toBe('00:00:10');
    expect(countdown(100000, 100001)).toBe('00:00:00');
  });
  test('user offsets are applied once without changing astronomical light boundaries', () => {
    const base = day('2026-09-30');
    const corrected = provider.getDay('2026-09-30', location, { ...zeroAdjustments, imsak: 3, ogle: -2 });
    expect(getEvent(corrected, 'imsak').at - getEvent(base, 'imsak').at).toBe(180000);
    expect(getEvent(corrected, 'ogle').at - getEvent(base, 'ogle').at).toBe(-120000);
    expect(corrected.sunrise).toBe(base.sunrise);
    expect(corrected.sunset).toBe(base.sunset);
  });
  test('rejects invalid adjustments rather than producing misleading data', () => {
    expect(() => provider.getDay('2026-09-30', location, { ...zeroAdjustments, imsak: 90 })).toThrow();
    expect(() => provider.getDay('2026-09-30', location, { ...zeroAdjustments, imsak: NaN })).toThrow();
  });
  test('changing location changes real times', () => {
    const ankara = provider.getDay('2026-09-30', { ...location, latitude: 39.91987, longitude: 32.85427 }, zeroAdjustments);
    expect(ankara.events).not.toEqual(day('2026-09-30').events);
  });
});

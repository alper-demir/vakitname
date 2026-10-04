import { AdhanProvider } from '@/services/prayer/adhan-provider';
import { formatTime } from '@/domain/time';
import { VakitLocation, zeroAdjustments } from '@/domain/types';

type AccuracyCase = {
  city: string;
  date: string;
  latitude: number;
  longitude: number;
  official: readonly string[];
};

const cases: AccuracyCase[] = [
  { city: 'İstanbul', date: '2026-09-30', latitude: 41.01384, longitude: 28.94966, official: ['05:28', '06:52', '12:59', '16:18', '18:56', '20:15'] },
  { city: 'Ankara', date: '2026-10-22', latitude: 39.91987, longitude: 32.85427, official: ['05:36', '06:59', '12:38', '15:38', '18:07', '19:25'] },
  { city: 'İzmir', date: '2027-06-21', latitude: 38.41273, longitude: 27.13838, official: ['03:50', '05:41', '13:18', '17:12', '20:46', '22:28'] },
  { city: 'Antalya', date: '2027-06-21', latitude: 36.90812, longitude: 30.69556, official: ['03:46', '05:31', '13:04', '16:55', '20:27', '22:04'] },
  { city: 'Erzurum', date: '2026-09-16', latitude: 39.90861, longitude: 41.27694, official: ['04:25', '05:50', '12:15', '15:45', '18:30', '19:50'] },
  { city: 'Sinop', date: '2026-10-03', latitude: 42.02683, longitude: 35.16252, official: ['05:05', '06:31', '12:34', '15:48', '18:26', '19:46'] },
  { city: 'Iğdır', date: '2026-10-04', latitude: 39.92371, longitude: 44.045, official: ['04:33', '05:56', '11:58', '15:13', '17:50', '19:07'] },
];

const minutes = (value: string) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3));

test.each(cases)('$city $date stays within two minutes of the recorded official table', ({ city, date, latitude, longitude, official }) => {
  const location: VakitLocation = {
    id: `accuracy-${city}`,
    name: city,
    province: city,
    latitude,
    longitude,
    source: 'manual',
    coordinateKind: 'seat',
    timeZone: 'Europe/Istanbul',
    updatedAt: 0,
  };
  const calculated = new AdhanProvider().getDay(date, location, zeroAdjustments).events.map((event) => formatTime(event.at, location.timeZone));
  const differences = calculated.map((value, index) => Math.abs(minutes(value) - minutes(official[index]!)));
  expect(Math.max(...differences)).toBeLessThanOrEqual(2);
});

test('prayer calculation continues beyond packaged Hijri years without downloading annual tables', () => {
  const location: VakitLocation = {
    id: 'future-istanbul', name: 'İstanbul', province: 'İstanbul', latitude: 41.01384, longitude: 28.94966,
    source: 'manual', coordinateKind: 'seat', timeZone: 'Europe/Istanbul', updatedAt: 0,
  };
  const result = new AdhanProvider().getDay('2030-01-01', location, zeroAdjustments);
  expect(result.localDate).toBe('2030-01-01');
  expect(result.events).toHaveLength(6);
  expect(result.events.every((event) => Number.isFinite(event.at))).toBe(true);
});

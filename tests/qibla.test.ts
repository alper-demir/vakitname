import { angularDifference, compassLabel, normalizeBearing, qiblaDirection } from '@/domain/qibla';

test('calculates Istanbul Qibla bearing and great-circle distance', () => {
  const result = qiblaDirection({ latitude: 41.0082, longitude: 28.9784 });
  expect(result.bearing).toBeCloseTo(151.6, 0);
  expect(result.distanceKm).toBeCloseTo(2405, -1);
});

test('normalizes bearings and returns the shortest signed turn', () => {
  expect(normalizeBearing(-1)).toBe(359);
  expect(angularDifference(2, 358)).toBe(4);
  expect(angularDifference(358, 2)).toBe(-4);
  expect(compassLabel(151)).toBe('Güneydoğu');
});

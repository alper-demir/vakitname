export const kaaba = { latitude: 21.422487, longitude: 39.826206 } as const;

export type Coordinate = { latitude: number; longitude: number };
export type QiblaDirection = { bearing: number; distanceKm: number };

const radians = (value: number) => value * Math.PI / 180;
const degrees = (value: number) => value * 180 / Math.PI;

export function normalizeBearing(value: number): number {
  if (!Number.isFinite(value)) throw new Error('Geçersiz yön değeri');
  return ((value % 360) + 360) % 360;
}

export function angularDifference(target: number, heading: number): number {
  return ((normalizeBearing(target) - normalizeBearing(heading) + 540) % 360) - 180;
}

export function qiblaDirection(origin: Coordinate): QiblaDirection {
  if (!Number.isFinite(origin.latitude) || !Number.isFinite(origin.longitude)) throw new Error('Geçersiz konum');
  const latitude1 = radians(origin.latitude);
  const latitude2 = radians(kaaba.latitude);
  const deltaLatitude = latitude2 - latitude1;
  const deltaLongitude = radians(kaaba.longitude - origin.longitude);
  const a = Math.sin(deltaLatitude / 2) ** 2 + Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(deltaLongitude / 2) ** 2;
  const distanceKm = 6371.0088 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  if (distanceKm < 0.001) return { bearing: 0, distanceKm: 0 };
  const y = Math.sin(deltaLongitude) * Math.cos(latitude2);
  const x = Math.cos(latitude1) * Math.sin(latitude2) - Math.sin(latitude1) * Math.cos(latitude2) * Math.cos(deltaLongitude);
  return { bearing: normalizeBearing(degrees(Math.atan2(y, x))), distanceKm };
}

export function compassLabel(bearing: number): string {
  const names = ['Kuzey', 'Kuzeydoğu', 'Doğu', 'Güneydoğu', 'Güney', 'Güneybatı', 'Batı', 'Kuzeybatı'];
  return names[Math.round(normalizeBearing(bearing) / 45) % 8]!;
}

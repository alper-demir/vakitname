import data from '@/data/locations.json';
import boundary from '@/data/turkey-boundary.json';
import { VakitLocation } from './types';

export const provinces = data.provinces;
export const districts = data.districts;
export type Province = (typeof provinces)[number];
export type District = (typeof districts)[number];
export function normalizeSearch(value: string): string {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/ı/g, 'i').trim();
}
export function matchesSearch(name: string, query: string): boolean {
  return normalizeSearch(name).includes(normalizeSearch(query));
}
export function manualLocation(province: Province, district?: District, now = Date.now()): VakitLocation {
  const point = district ?? province;
  return { id: point.id, name: district?.name ?? province.name, province: province.name, latitude: point.latitude, longitude: point.longitude,
    timeZone: 'Europe/Istanbul', source: 'manual', coordinateKind: district?.coordinateKind === 'representative' ? 'representative' : 'seat', updatedAt: now };
}
function inRing(x: number, y: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]! as [number, number];
    const [xj, yj] = ring[j]! as [number, number];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
export function isInTurkey(latitude: number, longitude: number): boolean {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false;
  return boundary.some((polygon) => inRing(longitude, latitude, polygon[0]!)
    && !polygon.slice(1).some((hole) => inRing(longitude, latitude, hole)));
}
export function gpsLocation(latitude: number, longitude: number, accuracy: number | undefined, now = Date.now()): VakitLocation {
  if (!isInTurkey(latitude, longitude)) throw new Error('outside-turkey');
  const distance = (p: { latitude: number; longitude: number }) => Math.pow(p.latitude - latitude, 2)
    + Math.pow((p.longitude - longitude) * Math.cos(latitude * Math.PI / 180), 2);
  const nearest = districts.reduce((best, p) => distance(p) < distance(best) ? p : best, districts[0]!);
  const province = provinces.find((p) => p.id === nearest.provinceId)!;
  return { id: 'gps', name: nearest.name, province: province.name, latitude, longitude, accuracy,
    timeZone: 'Europe/Istanbul', source: 'gps', coordinateKind: 'gps', updatedAt: now };
}

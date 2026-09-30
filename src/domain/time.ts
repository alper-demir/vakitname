import { DateTime } from 'luxon';
import { PrayerDay, PrayerEvent } from './types';

export const TURKEY_ZONE = 'Europe/Istanbul';
export function localDateAt(epoch: number, zone = TURKEY_ZONE): string {
  const value = DateTime.fromMillis(epoch, { zone }).toISODate();
  if (!value) throw new Error('Geçersiz tarih');
  return value;
}
export function addDays(date: string, count: number): string {
  const value = DateTime.fromISO(date, { zone: TURKEY_ZONE }).plus({ days: count }).toISODate();
  if (!value) throw new Error('Geçersiz tarih');
  return value;
}
export function formatTime(epoch: number, zone = TURKEY_ZONE): string {
  return DateTime.fromMillis(epoch, { zone }).toFormat('HH:mm');
}
export function formatDate(date: string, long = false): string {
  return DateTime.fromISO(date, { zone: TURKEY_ZONE, locale: 'tr' }).toFormat(long ? 'd MMMM yyyy, cccc' : 'd MMMM cccc');
}
export function countdown(target: number, now: number): string {
  const seconds = Math.max(0, Math.ceil((target - now) / 1000));
  return [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60]
    .map((n) => String(n).padStart(2, '0')).join(':');
}
export function timelineAt(days: PrayerDay[], now: number) {
  const events = days.flatMap((d) => d.events).sort((a, b) => a.at - b.at);
  const next = events.find((e) => e.at > now);
  const previous = events.filter((e) => e.at <= now).at(-1);
  if (!next || !previous) throw new Error('Vakit aralığı bulunamadı');
  return { next, previous, progress: Math.min(1, Math.max(0, (now - previous.at) / (next.at - previous.at))) };
}
export function getEvent(day: PrayerDay, id: PrayerEvent['id']): PrayerEvent {
  const event = day.events.find((e) => e.id === id);
  if (!event) throw new Error('Vakit bulunamadı');
  return event;
}

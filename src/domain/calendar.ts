import { DateTime } from 'luxon';
import { hijriMonths } from '@/data/hijri-months';
import { addDays, getEvent } from './time';
import { PrayerDay } from './types';

export const hijriMonthNames = ['Muharrem', 'Safer', 'Rebiülevvel', 'Rebiülahir', 'Cemaziyelevvel', 'Cemaziyelahir', 'Recep', 'Şaban', 'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce'];
export type HijriDate = { day: number; month: number; year: number; source: 'diyanet-months' | 'umm-al-qura' | 'unavailable'; label: string };
export interface CalendarProvider { getDate(localDate: string, offset: number): HijriDate }
export const calendarProvider: CalendarProvider = {
  getDate(localDate, offset) {
    if (!Number.isInteger(offset) || Math.abs(offset) > 2) throw new Error('Geçersiz Hicri gün düzeltmesi');
    const shifted = addDays(localDate, offset);
    for (let i = 0; i < hijriMonths.length - 1; i++) {
      const [start, year, month] = hijriMonths[i]!;
      if (shifted >= start && shifted < hijriMonths[i + 1]![0]) {
        const day = Math.round(DateTime.fromISO(shifted).diff(DateTime.fromISO(start), 'days').days) + 1;
        return { day, month, year, source: 'diyanet-months', label: `${day} ${hijriMonthNames[month - 1]} ${year}` };
      }
    }
    try {
      const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' });
      if (formatter.resolvedOptions().calendar !== 'islamic-umalqura') throw new Error('Unsupported calendar');
      const parts = formatter.formatToParts(new Date(`${shifted}T12:00:00Z`));
      const read = (type: string) => Number(parts.find((p) => p.type === type)?.value);
      const day = read('day'), month = read('month'), year = read('year');
      if (![day, month, year].every(Number.isFinite)) throw new Error('Invalid calendar');
      return { day, month, year, source: 'umm-al-qura', label: `${day} ${hijriMonthNames[month - 1]} ${year}` };
    } catch {
      return { day: 0, month: 0, year: 0, source: 'unavailable', label: 'Hicri tarih kullanılamıyor' };
    }
  },
};
export function ramadanAt(now: number, today: PrayerDay, tomorrow: PrayerDay, offset: number) {
  const civil = calendarProvider.getDate(today.localDate, offset);
  const nextCivil = calendarProvider.getDate(addDays(today.localDate, 1), offset);
  const afterSunset = now >= today.sunset;
  const active = (afterSunset ? nextCivil : civil).month === 9;
  // Fasting events use prayer times; the decorative month boundary uses sunset.
  const imsak = getEvent(today, 'imsak');
  const iftar = getEvent(today, 'aksam');
  const target = civil.month === 9 && now < imsak.at ? imsak
    : civil.month === 9 && now < iftar.at ? iftar
    : nextCivil.month === 9 ? getEvent(tomorrow, 'imsak') : null;
  return { active, civil, nextCivil, target, fasting: civil.month === 9 && now >= imsak.at && now < iftar.at };
}

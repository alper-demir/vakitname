import { DateTime } from 'luxon';
import { calendarProvider } from './calendar';
import { hijriMonths } from '@/data/hijri-months';
import { addDays } from './time';
import { Adjustments, PrayerDay, PrayerTimesProvider, VakitLocation } from './types';

export type CalendarTableRow = {
  localDate: string;
  prayerDay: PrayerDay;
  hijri: ReturnType<typeof calendarProvider.getDate>;
  isToday: boolean;
  isFasting: boolean;
};

export type RamadanRange = {
  start: string;
  endExclusive: string;
  hijriYear: number;
  days: number;
  source: 'diyanet-months' | 'umm-al-qura';
};

function daysBetween(start: string, endExclusive: string) {
  return Math.round(DateTime.fromISO(endExclusive).diff(DateTime.fromISO(start), 'days').days);
}

function rangeFromStart(start: string, hijriYear: number): RamadanRange {
  const index = hijriMonths.findIndex(([date, year, month]) => date === start && year === hijriYear && month === 9);
  const next = index >= 0 ? hijriMonths[index + 1]?.[0] : undefined;
  if (!next) throw new Error('Ramazan dönemi bulunamadı');
  return { start, endExclusive: next, hijriYear, days: daysBetween(start, next), source: 'diyanet-months' };
}

export function getRamadanRange(referenceDate: string): RamadanRange | null {
  const starts = hijriMonths.filter(([, , month]) => month === 9);
  const active = starts.find(([start]) => {
    const index = hijriMonths.findIndex(([date]) => date === start);
    const next = hijriMonths[index + 1]?.[0];
    return next && start <= referenceDate && referenceDate < next;
  });
  if (active) return rangeFromStart(active[0], active[1]);
  const upcoming = starts.find(([start]) => start > referenceDate);
  if (upcoming) return rangeFromStart(upcoming[0], upcoming[1]);
  for (let offset = -35; offset <= 400; offset++) {
    const candidate = addDays(referenceDate, offset);
    const hijri = calendarProvider.getDate(candidate, 0);
    if (hijri.source === 'umm-al-qura' && hijri.month === 9 && hijri.day === 1) {
      let endExclusive = addDays(candidate, 1);
      for (let day = 1; day <= 30; day++) {
        if (calendarProvider.getDate(endExclusive, 0).month !== 9) break;
        endExclusive = addDays(endExclusive, 1);
      }
      return { start: candidate, endExclusive, hijriYear: hijri.year, days: daysBetween(candidate, endExclusive), source: 'umm-al-qura' };
    }
  }
  return null;
}

export function buildMonthRows(month: string, location: VakitLocation, adjustments: Adjustments, today: string, provider: PrayerTimesProvider, hijriOffset = 0): CalendarTableRow[] {
  const first = DateTime.fromISO(`${month}-01`, { zone: location.timeZone });
  if (!first.isValid || first.toFormat('yyyy-MM') !== month) throw new Error('Geçersiz takvim ayı');
  return Array.from({ length: first.daysInMonth }, (_, index) => {
    const localDate = first.plus({ days: index }).toISODate()!;
    return buildRow(localDate, location, adjustments, today, false, hijriOffset, provider);
  });
}

export function buildRamadanRows(range: RamadanRange, location: VakitLocation, adjustments: Adjustments, today: string, provider: PrayerTimesProvider, hijriOffset = 0): CalendarTableRow[] {
  return Array.from({ length: range.days }, (_, index) => buildRow(addDays(range.start, index), location, adjustments, today, true, hijriOffset, provider));
}

function buildRow(localDate: string, location: VakitLocation, adjustments: Adjustments, today: string, fasting = false, hijriOffset = 0, provider: PrayerTimesProvider): CalendarTableRow {
  return {
    localDate,
    prayerDay: provider.getDay(localDate, location, adjustments),
    hijri: calendarProvider.getDate(localDate, hijriOffset),
    isToday: localDate === today,
    isFasting: fasting || calendarProvider.getDate(localDate, 0).month === 9,
  };
}

import { CalculationMethod, Coordinates, PrayerTimes } from 'adhan';
import { DateTime } from 'luxon';
import { Adjustments, PrayerTimesProvider, VakitLocation, prayerIds } from '@/domain/types';

export class AdhanProvider implements PrayerTimesProvider {
  getDay(localDate: string, location: VakitLocation, adjustments: Adjustments) {
    const civil = DateTime.fromISO(localDate, { zone: location.timeZone });
    if (!civil.isValid || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) throw new Error('Geçersiz konum veya tarih');
    if (prayerIds.some((id) => !Number.isInteger(adjustments[id]) || Math.abs(adjustments[id]) > 30)) throw new Error('Düzeltmeler −30 ile +30 dakika arasında olmalı');
    // Adhan reads the Date's LOCAL year/month/day. This is a civil-date carrier,
    // not an instant converted from Istanbul midnight (which breaks in other zones).
    const carrier = new Date(civil.year, civil.month - 1, civil.day, 12);
    const coordinates = new Coordinates(location.latitude, location.longitude);
    const params = CalculationMethod.Turkey();
    params.adjustments = { fajr: adjustments.imsak, sunrise: adjustments.gunes, dhuhr: adjustments.ogle, asr: adjustments.ikindi, maghrib: adjustments.aksam, isha: adjustments.yatsi };
    const times = new PrayerTimes(coordinates, carrier, params);
    const values = [times.fajr, times.sunrise, times.dhuhr, times.asr, times.maghrib, times.isha];
    const events = prayerIds.map((id, i) => ({ id, at: values[i]!.getTime(), localDate }));
    if (events.some((e, i) => !Number.isFinite(e.at) || (i > 0 && e.at <= events[i - 1]!.at))) throw new Error('Düzeltmeler vakit sırasını bozuyor');
    // Astronomical sun events have no preset/user offsets. Theme is independent
    // of the corrected prayer schedule and Diyanet's sunrise convention.
    const solar = new PrayerTimes(coordinates, carrier, CalculationMethod.Other());
    return {
      localDate, timeZone: location.timeZone, events,
      sunrise: solar.sunrise.getTime(), sunset: solar.maghrib.getTime(),
      source: { id: 'adhan', method: 'Türkiye yöntemi', version: '4.4.6' },
    };
  }
}
export const prayerProvider: PrayerTimesProvider = new AdhanProvider();

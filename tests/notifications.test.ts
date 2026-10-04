import { buildNotificationPlan, MAX_NOTIFICATION_REQUESTS, NOTIFICATION_HORIZON_DAYS } from '@/domain/notifications';
import { addDays } from '@/domain/time';
import { defaultNotificationPreferences, zeroAdjustments } from '@/domain/types';
import { manualLocation, provinces } from '@/domain/locations';
import { prayerProvider } from '@/services/prayer/adhan-provider';

const location = manualLocation(provinces.find((item) => item.name === 'İstanbul')!, undefined, 1);

test('notification plan covers fifteen civil dates and stays chronological', () => {
  const start = '2026-09-30';
  const days = Array.from({ length: NOTIFICATION_HORIZON_DAYS }, (_, index) => prayerProvider.getDay(addDays(start, index), location, zeroAdjustments));
  const now = days[0]!.events[0]!.at - 60 * 60_000;
  const plan = buildNotificationPlan(days, { ...defaultNotificationPreferences, enabled: true, reminderMinutes: 30 }, location.name, now);
  expect(plan).toHaveLength(NOTIFICATION_HORIZON_DAYS * 5 * 2);
  expect(new Set(plan.map((item) => item.localDate)).size).toBe(NOTIFICATION_HORIZON_DAYS);
  expect(plan.every((item, index) => item.at > now && (index === 0 || plan[index - 1]!.at <= item.at))).toBe(true);
  expect(new Set(plan.map((item) => item.id)).size).toBe(plan.length);
  expect(plan.some((item) => item.prayerId === 'gunes')).toBe(false);
  expect(plan[0]).toMatchObject({ prayerId: 'imsak', kind: 'reminder', title: 'İmsak vaktine 30 dakika' });
});

test('the densest notification selection remains inside the explicit safety cap', () => {
  const start = '2026-09-30';
  const days = Array.from({ length: NOTIFICATION_HORIZON_DAYS }, (_, index) => prayerProvider.getDay(addDays(start, index), location, zeroAdjustments));
  const now = days[0]!.events[0]!.at - 60 * 60_000;
  const prayerEnabled = { imsak: true, gunes: true, ogle: true, ikindi: true, aksam: true, yatsi: true };
  const plan = buildNotificationPlan(days, { ...defaultNotificationPreferences, enabled: true, reminderMinutes: 30, prayerEnabled }, location.name, now);
  expect(plan).toHaveLength(MAX_NOTIFICATION_REQUESTS);
});

test('disabling Öğle removes both its reminder and prayer-time requests from the next plan', () => {
  const day = prayerProvider.getDay('2026-09-30', location, zeroAdjustments);
  const now = day.events[0]!.at - 60 * 60_000;
  const prayerEnabled = { ...defaultNotificationPreferences.prayerEnabled, ogle: false };
  const plan = buildNotificationPlan([day], { ...defaultNotificationPreferences, enabled: true, reminderMinutes: 15, prayerEnabled }, location.name, now);
  expect(plan.some((item) => item.prayerId === 'ogle')).toBe(false);
  expect(plan.filter((item) => item.prayerId === 'aksam')).toHaveLength(2);
});

test('disabled notifications produce no plan', () => {
  const day = prayerProvider.getDay('2026-09-30', location, zeroAdjustments);
  expect(buildNotificationPlan([day], defaultNotificationPreferences, location.name, 0)).toEqual([]);
});

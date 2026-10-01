import { buildNotificationPlan } from '@/domain/notifications';
import { addDays } from '@/domain/time';
import { defaultNotificationPreferences, zeroAdjustments } from '@/domain/types';
import { manualLocation, provinces } from '@/domain/locations';
import { prayerProvider } from '@/services/prayer/adhan-provider';

const location = manualLocation(provinces.find((item) => item.name === 'İstanbul')!, undefined, 1);

test('notification plan is chronological, future-only and capped', () => {
  const start = '2026-09-30';
  const days = Array.from({ length: 14 }, (_, index) => prayerProvider.getDay(addDays(start, index), location, zeroAdjustments));
  const now = days[0]!.events[0]!.at - 60 * 60_000;
  const plan = buildNotificationPlan(days, { ...defaultNotificationPreferences, enabled: true, reminderMinutes: 30 }, location.name, now);
  expect(plan).toHaveLength(60);
  expect(plan.every((item, index) => item.at > now && (index === 0 || plan[index - 1]!.at <= item.at))).toBe(true);
  expect(new Set(plan.map((item) => item.id)).size).toBe(plan.length);
  expect(plan.some((item) => item.prayerId === 'gunes')).toBe(false);
  expect(plan[0]).toMatchObject({ prayerId: 'imsak', kind: 'reminder', title: 'İmsak vaktine 30 dakika' });
});

test('disabled notifications produce no plan', () => {
  const day = prayerProvider.getDay('2026-09-30', location, zeroAdjustments);
  expect(buildNotificationPlan([day], defaultNotificationPreferences, location.name, 0)).toEqual([]);
});

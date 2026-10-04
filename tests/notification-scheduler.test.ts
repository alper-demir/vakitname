import { buildNotificationSimulation, diffNotificationPlan } from '@/services/notifications/scheduler';
import { createLatestTaskRunner } from '@/services/notifications/latest-task-runner';
import { defaultNotificationPreferences } from '@/domain/types';

test('notification simulation follows the selected reminder and prayer-time options', () => {
  expect(buildNotificationSimulation({ ...defaultNotificationPreferences, enabled: true, reminderMinutes: 30, atPrayerTime: true }, 'Kâğıthane')).toEqual([
    { title: 'İmsak vaktine 30 dakika', body: 'Kâğıthane · simülasyon', seconds: 3 },
    { title: 'İmsak vakti girdi', body: 'Kâğıthane', seconds: 6 },
  ]);
  expect(buildNotificationSimulation({ ...defaultNotificationPreferences, enabled: true, reminderMinutes: 0, atPrayerTime: false }, 'Kâğıthane')).toEqual([]);
});

test('scheduler diff preserves matching identifiers and isolates stale requests', () => {
  expect(diffNotificationPlan(['keep', 'stale'], ['keep', 'new'])).toEqual({ stale: ['stale'], missing: ['new'] });
});

test('scheduler marks previously planned Öğle requests stale when that prayer is disabled', () => {
  const ogleReminder = 'vakit-ogle-before';
  const ogleTime = 'vakit-ogle-time';
  const aksamTime = 'vakit-aksam-time';
  expect(diffNotificationPlan([ogleReminder, ogleTime, aksamTime], [aksamTime])).toEqual({
    stale: [ogleReminder, ogleTime],
    missing: [],
  });
});

test('notification refresh runs once at a time and coalesces queued work to the latest state', async () => {
  let releaseFirst!: () => void;
  const firstGate = new Promise<void>((resolve) => { releaseFirst = resolve; });
  let active = 0;
  let maxActive = 0;
  const calls: number[] = [];
  const runner = createLatestTaskRunner(async (value: number) => {
    active++;
    maxActive = Math.max(maxActive, active);
    calls.push(value);
    if (value === 1) await firstGate;
    active--;
  });

  const first = runner.run(1);
  const superseded = runner.run(2);
  const latest = runner.run(3);
  releaseFirst();
  await Promise.all([first, superseded, latest]);

  expect(calls).toEqual([1, 3]);
  expect(maxActive).toBe(1);
});

test('notification refresh runner accepts new work after a failed drain', async () => {
  const runner = createLatestTaskRunner(async (value: string) => {
    if (value === 'fail') throw new Error('temporary failure');
  });

  await expect(runner.run('fail')).rejects.toThrow('temporary failure');
  await expect(runner.run('recover')).resolves.toBeUndefined();
});

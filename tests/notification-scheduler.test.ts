import { diffNotificationPlan } from '@/services/notifications/scheduler';

test('scheduler diff preserves matching identifiers and isolates stale requests', () => {
  expect(diffNotificationPlan(['keep', 'stale'], ['keep', 'new'])).toEqual({ stale: ['stale'], missing: ['new'] });
});

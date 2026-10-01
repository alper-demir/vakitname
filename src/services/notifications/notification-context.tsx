import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import { addDays, localDateAt } from '@/domain/time';
import { buildNotificationPlan } from '@/domain/notifications';
import { Adjustments, NotificationPreferences, VakitLocation } from '@/domain/types';
import { prayerProvider } from '@/services/prayer/adhan-provider';
import { useAppState } from '@/services/app-state';
import { createLatestTaskRunner } from './latest-task-runner';
import { notificationScheduler, NotificationPermission } from './scheduler';

type NotificationContextValue = {
  permission: NotificationPermission;
  syncing: boolean;
  error: string | null;
  enable: () => Promise<boolean>;
  disable: () => void;
  refresh: () => Promise<void>;
  sendTest: () => Promise<boolean>;
};

const Context = createContext<NotificationContextValue | null>(null);
const allowed = (permission: NotificationPermission) => permission === 'granted' || permission === 'provisional';
type RefreshSnapshot = { location: VakitLocation | null; adjustments: Adjustments; notifications: NotificationPreferences };

export function NotificationProvider({ children }: React.PropsWithChildren) {
  const app = useAppState();
  const { ready, location, preferences, updateNotificationSchedule, updateNotifications } = app;
  const [permission, setPermission] = useState<NotificationPermission>('undetermined');
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeRefresh = useCallback(async (snapshot: RefreshSnapshot) => {
    const currentPermission = await notificationScheduler.getPermission();
    setPermission(currentPermission);
    if (!snapshot.notifications.enabled || !snapshot.location || !allowed(currentPermission)) {
      await notificationScheduler.cancelAll();
      updateNotificationSchedule({ scheduledCount: 0, scheduledThrough: null });
      return;
    }
    const now = Date.now();
    const localDate = localDateAt(now, snapshot.location.timeZone);
    const days = Array.from({ length: 14 }, (_, index) => prayerProvider.getDay(addDays(localDate, index), snapshot.location!, snapshot.adjustments));
    const plan = buildNotificationPlan(days, snapshot.notifications, snapshot.location.name, now);
    const result = await notificationScheduler.reconcile(plan, snapshot.notifications.sound);
    updateNotificationSchedule(result);
  }, [updateNotificationSchedule]);
  const refreshRunner = useMemo(() => createLatestTaskRunner(executeRefresh), [executeRefresh]);

  const refresh = useCallback(async () => {
    if (!ready) return;
    setSyncing(true); setError(null);
    try {
      await refreshRunner.run({ location, adjustments: preferences.adjustments, notifications: preferences.notifications });
    } catch {
      setError('Bildirim planı güncellenemedi. Daha sonra yeniden deneyebilirsin.');
    } finally { setSyncing(false); }
  }, [ready, location, preferences.adjustments, preferences.notifications, refreshRunner]);

  useEffect(() => { const timer = setTimeout(() => { void refresh(); }, 0); return () => clearTimeout(timer); }, [refresh]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => { if (state === 'active') void refresh(); });
    return () => subscription.remove();
  }, [refresh]);

  const enable = useCallback(async () => {
    setSyncing(true); setError(null);
    try {
      const result = await notificationScheduler.requestPermission();
      setPermission(result);
      if (!allowed(result)) {
        updateNotifications({ enabled: false });
        setError(result === 'unsupported' ? 'Bu platform yerel bildirimleri desteklemiyor.' : 'Bildirim izni verilmedi. Sistem ayarlarından daha sonra açabilirsin.');
        return false;
      }
      updateNotifications({ enabled: true });
      return true;
    } catch {
      setError('Bildirim izni alınamadı. Daha sonra yeniden deneyebilirsin.');
      return false;
    } finally { setSyncing(false); }
  }, [updateNotifications]);

  const disable = useCallback(() => updateNotifications({ enabled: false }), [updateNotifications]);
  const sendTest = useCallback(async () => {
    setSyncing(true); setError(null);
    try {
      let current = await notificationScheduler.getPermission();
      if (!allowed(current)) current = await notificationScheduler.requestPermission();
      setPermission(current);
      if (!allowed(current)) { setError('Test için bildirim izni gerekiyor.'); return false; }
      await notificationScheduler.scheduleTest(preferences.notifications.sound);
      return true;
    } catch { setError('Test bildirimi planlanamadı.'); return false; }
    finally { setSyncing(false); }
  }, [preferences.notifications.sound]);

  return <Context.Provider value={{ permission, syncing, error, enable, disable, refresh, sendTest }}>{children}</Context.Provider>;
}

export function useNotifications() {
  const value = useContext(Context);
  if (!value) throw new Error('NotificationProvider missing');
  return value;
}

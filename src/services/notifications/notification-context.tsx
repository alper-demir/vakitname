import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import { useAppState } from '@/services/app-state';
import { createLatestTaskRunner } from './latest-task-runner';
import { exactScheduling, ExactSchedulingStatus } from './exact-scheduling';
import { notificationScheduler, NotificationPermission } from './scheduler';
import { NotificationSnapshot, refreshNotificationPlan, serializeNotificationWork } from './refresh-plan';
import { BackgroundRefreshStatus, setLiveNotificationSnapshot, syncBackgroundRefresh } from './background-refresh';

type NotificationContextValue = {
  permission: NotificationPermission;
  backgroundRefreshStatus: BackgroundRefreshStatus;
  exactSchedulingStatus: ExactSchedulingStatus;
  syncing: boolean;
  error: string | null;
  enable: () => Promise<boolean>;
  disable: () => void;
  refresh: (forceReschedule?: boolean) => Promise<void>;
  requestExactScheduling: () => Promise<ExactSchedulingStatus>;
  sendTest: () => Promise<boolean>;
  simulateCurrentFlow: () => Promise<number>;
};

const Context = createContext<NotificationContextValue | null>(null);
const allowed = (permission: NotificationPermission) => permission === 'granted' || permission === 'provisional';
type RefreshSnapshot = NotificationSnapshot & { forceReschedule: boolean };

export function NotificationProvider({ children }: React.PropsWithChildren) {
  const app = useAppState();
  const { ready, location, preferences, updateNotificationSchedule, updateNotifications } = app;
  const [permission, setPermission] = useState<NotificationPermission>('undetermined');
  const [backgroundRefreshStatus, setBackgroundRefreshStatus] = useState<BackgroundRefreshStatus>('disabled');
  const [exactSchedulingStatus, setExactSchedulingStatus] = useState<ExactSchedulingStatus>('unsupported');
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeRefresh = useCallback((snapshot: RefreshSnapshot) => serializeNotificationWork(async () => {
    const result = await refreshNotificationPlan(snapshot, snapshot.forceReschedule);
    setPermission(result.permission);
    updateNotificationSchedule(result.schedule);
    try { setBackgroundRefreshStatus(await syncBackgroundRefresh(result.enabled)); }
    catch { setBackgroundRefreshStatus('error'); }
  }), [updateNotificationSchedule]);
  const refreshRunner = useMemo(() => createLatestTaskRunner(executeRefresh), [executeRefresh]);

  const refresh = useCallback(async (forceReschedule = false) => {
    if (!ready) return;
    setLiveNotificationSnapshot({ location, adjustments: preferences.adjustments, notifications: preferences.notifications });
    setSyncing(true); setError(null);
    try {
      await refreshRunner.run({ location, adjustments: preferences.adjustments, notifications: preferences.notifications, forceReschedule });
    } catch {
      setError('Bildirim planı güncellenemedi. Daha sonra yeniden deneyebilirsin.');
    } finally { setSyncing(false); }
  }, [ready, location, preferences.adjustments, preferences.notifications, refreshRunner]);

  useEffect(() => { const timer = setTimeout(() => { void refresh(); }, 0); return () => clearTimeout(timer); }, [refresh]);
  useEffect(() => () => setLiveNotificationSnapshot(null), []);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => { if (state === 'active') void refresh(); });
    return () => subscription.remove();
  }, [refresh]);
  useEffect(() => {
    if (!ready) return;
    void exactScheduling.getStatus().then((status) => {
      setExactSchedulingStatus(status);
    });
  }, [ready]);

  const requestExactScheduling = useCallback(async () => {
    setSyncing(true); setError(null);
    try {
      const status = await exactScheduling.requestAccess();
      setExactSchedulingStatus(status);
      await refresh(true);
      return status;
    } catch {
      setError('Dakik zamanlama ayarı açılamadı. Sistem ayarlarından daha sonra deneyebilirsin.');
      const status = await exactScheduling.getStatus();
      setExactSchedulingStatus(status);
      return status;
    } finally { setSyncing(false); }
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

  const simulateCurrentFlow = useCallback(async () => {
    if (!location || !preferences.notifications.enabled) return 0;
    setSyncing(true); setError(null);
    try {
      let current = await notificationScheduler.getPermission();
      if (!allowed(current)) current = await notificationScheduler.requestPermission();
      setPermission(current);
      if (!allowed(current)) { setError('Simülasyon için bildirim izni gerekiyor.'); return 0; }
      return await notificationScheduler.scheduleSimulation(preferences.notifications, location.name);
    } catch { setError('Bildirim simülasyonu planlanamadı.'); return 0; }
    finally { setSyncing(false); }
  }, [location, preferences.notifications]);

  return <Context.Provider value={{ permission, backgroundRefreshStatus, exactSchedulingStatus, syncing, error, enable, disable, refresh, requestExactScheduling, sendTest, simulateCurrentFlow }}>{children}</Context.Provider>;
}

export function useNotifications() {
  const value = useContext(Context);
  if (!value) throw new Error('NotificationProvider missing');
  return value;
}

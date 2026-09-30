import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const restart = (active: boolean) => {
      if (timer) clearInterval(timer);
      if (active) { setNow(Date.now()); timer = setInterval(() => setNow(Date.now()), intervalMs); }
    };
    restart(AppState.currentState !== 'background' && AppState.currentState !== 'inactive');
    const subscription = AppState.addEventListener('change', (state) => restart(state === 'active'));
    return () => { if (timer) clearInterval(timer); subscription.remove(); };
  }, [intervalMs]);
  return now;
}

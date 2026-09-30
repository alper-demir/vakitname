import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { decodeSavedState, initialSavedState, SavedState } from '@/domain/state';
import { Adjustments, PrayerId, ThemePreferences, VakitLocation, zeroAdjustments } from '@/domain/types';
import { persistence } from './storage';
import { locateDevice } from './location';

type ContextValue = SavedState & {
  ready: boolean; savingError: boolean; recovered: boolean; locating: boolean; locationError: string | null;
  selectLocation: (location: VakitLocation) => void;
  updateTheme: (theme: Partial<ThemePreferences>) => void;
  updateAdjustment: (prayer: PrayerId, minutes: number) => void;
  resetAdjustments: () => void;
  updateHijriOffset: (days: number) => void;
  completeOnboarding: () => void;
  requestLocation: () => Promise<boolean>;
  cancelLocation: () => void;
};
const Context = createContext<ContextValue | null>(null);
export function AppStateProvider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState(initialSavedState);
  const [ready, setReady] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const [savingError, setSavingError] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const revision = useRef(0);
  const writes = useRef(Promise.resolve());
  const lastSaved = useRef(state);
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const requests = revision;
    let mounted = true;
    persistence.read().then((raw) => {
      if (!mounted) return;
      const decoded = decodeSavedState(raw);
      lastSaved.current = decoded.state;
      setState(decoded.state); setRecovered(decoded.recovered); setReady(true);
    }).catch(() => { if (mounted) { setSavingError(true); setReady(true); } });
    return () => { mounted = false; requests.current++; };
  }, []);
  useEffect(() => {
    if (!ready || state === lastSaved.current) return;
    lastSaved.current = state;
    // Serialize writes so a slow old location cannot overwrite a newer one.
    writes.current = writes.current.catch(() => {}).then(() => persistence.write(JSON.stringify(state)))
      .then(() => setSavingError(false)).catch(() => setSavingError(true));
  }, [state, ready]);
  useEffect(() => {
    let mounted = true;
    const subscription = AppState.addEventListener('change', (nextState) => {
      const returningToForeground = appState.current !== 'active' && nextState === 'active';
      appState.current = nextState;
      if (!returningToForeground || !mounted || !state.location || state.location.source !== 'gps') return;
      const request = ++revision.current;
      setLocating(true); setLocationError(null);
      void locateDevice({ requestPermission: false }).then((location) => {
        if (request === revision.current) setState((current) => ({ ...current, location }));
      }).catch((error) => {
        if (request === revision.current) setLocationError(error instanceof Error ? error.message : 'unavailable');
      }).finally(() => {
        if (request === revision.current) setLocating(false);
      });
    });
    return () => { mounted = false; subscription?.remove(); };
  }, [state.location]);
  const cancelLocation = useCallback(() => { revision.current++; setLocating(false); setLocationError(null); }, []);
  const selectLocation = useCallback((location: VakitLocation) => {
    cancelLocation(); setState((s) => ({ ...s, location }));
  }, [cancelLocation]);
  const updateTheme = useCallback((theme: Partial<ThemePreferences>) => {
    setState((s) => ({ ...s, preferences: { ...s.preferences, theme: { ...s.preferences.theme, ...theme } } }));
  }, []);
  const updateAdjustment = useCallback((prayer: PrayerId, minutes: number) => {
    const safe = Math.max(-30, Math.min(30, Math.round(minutes)));
    setState((s) => ({ ...s, preferences: { ...s.preferences, adjustments: { ...s.preferences.adjustments, [prayer]: safe } as Adjustments } }));
  }, []);
  const resetAdjustments = useCallback(() => {
    setState((s) => ({ ...s, preferences: { ...s.preferences, adjustments: { ...zeroAdjustments } } }));
  }, []);
  const updateHijriOffset = useCallback((days: number) => {
    const safe = Math.max(-2, Math.min(2, Math.round(days)));
    setState((s) => ({ ...s, preferences: { ...s.preferences, hijriOffset: safe } }));
  }, []);
  const completeOnboarding = useCallback(() => {
    setState((s) => ({ ...s, onboardingComplete: true }));
  }, []);
  const requestLocation = useCallback(async () => {
    const request = ++revision.current;
    setLocating(true); setLocationError(null);
    try {
      const location = await locateDevice();
      if (request !== revision.current) return false;
      setState((s) => ({ ...s, location }));
      return true;
    } catch (error) {
      if (request === revision.current) setLocationError(error instanceof Error ? error.message : 'unavailable');
      return false;
    } finally { if (request === revision.current) setLocating(false); }
  }, []);
  return <Context.Provider value={{ ...state, ready, recovered, savingError, locating, locationError, selectLocation, updateTheme, updateAdjustment, resetAdjustments, updateHijriOffset, completeOnboarding, requestLocation, cancelLocation }}>{children}</Context.Provider>;
}
export function useAppState() {
  const value = useContext(Context);
  if (!value) throw new Error('AppStateProvider missing');
  return value;
}

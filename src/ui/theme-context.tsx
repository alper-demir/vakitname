import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { resolveTheme, seasonAt, solarPhaseAt, Theme } from '@/domain/theme';
import { addDays, localDateAt } from '@/domain/time';
import { ramadanAt } from '@/domain/calendar';
import { defaultPreferences } from '@/domain/types';
import { useAppState } from '@/services/app-state';
import { prayerProvider } from '@/services/prayer/adhan-provider';
import { useNow } from './use-now';

const Context = createContext<Theme>(resolveTheme({ season: 'spring', phase: 'day', ramadan: false, preferences: defaultPreferences.theme, systemDark: false }));
export function ThemeProvider({ children }: React.PropsWithChildren) {
  const { location, preferences } = useAppState();
  const { adjustments, hijriOffset, theme: themePreferences } = preferences;
  const now = useNow(15000);
  const systemDark = useColorScheme() === 'dark';
  const theme = useMemo(() => {
    let phase: Theme['phase'] = systemDark ? 'night' : 'day';
    let ramadan = false;
    if (location) {
      try {
        const date = localDateAt(now, location.timeZone);
        const today = prayerProvider.getDay(date, location, adjustments);
        const tomorrow = prayerProvider.getDay(addDays(date, 1), location, adjustments);
        phase = solarPhaseAt(now, today);
        ramadan = ramadanAt(now, today, tomorrow, hijriOffset).active;
      } catch { /* Home presents calculation errors; a readable theme remains available. */ }
    }
    return resolveTheme({ season: seasonAt(now, 'Europe/Istanbul'), phase, ramadan, preferences: themePreferences, systemDark });
  }, [location, adjustments, hijriOffset, themePreferences, now, systemDark]);
  return <Context.Provider value={theme}>{children}</Context.Provider>;
}
export const useTheme = () => useContext(Context);

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts, Manrope_200ExtraLight, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import * as SplashScreen from 'expo-splash-screen';
import { AppStateProvider } from '@/services/app-state';
import { ThemeProvider } from '@/ui/theme-context';
import { Text, View } from 'react-native';

export { ErrorBoundary } from 'expo-router';
void SplashScreen.preventAutoHideAsync().catch(() => {});
export default function RootLayout() {
  const [loaded, error] = useFonts({ Manrope_200ExtraLight, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold });
  useEffect(() => { if (loaded || error) void SplashScreen.hideAsync(); }, [loaded, error]);
  if (error) return <View style={{ flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#F3F9F3' }}><Text>Vakit hazırlanamadı. Lütfen uygulamayı yeniden açın.</Text></View>;
  if (!loaded) return null;
  return <AppStateProvider><ThemeProvider><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F3F9F3' } }}>
    <Stack.Screen name="index" />
    <Stack.Screen name="location" options={{ presentation: 'card' }} />
    <Stack.Screen name="appearance" options={{ presentation: 'modal' }} />
    <Stack.Screen name="settings" />
    <Stack.Screen name="calculation" />
    <Stack.Screen name="hijri" />
  </Stack></ThemeProvider></AppStateProvider>;
}

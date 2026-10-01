import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts, Manrope_200ExtraLight, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import * as SplashScreen from 'expo-splash-screen';
import { AppStateProvider } from '@/services/app-state';
import { NotificationProvider } from '@/services/notifications/notification-context';
import { ThemeProvider } from '@/ui/theme-context';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export { ErrorBoundary } from 'expo-router';
void SplashScreen.preventAutoHideAsync().catch(() => {});
function BrandSplash() {
  return <LinearGradient colors={['#08201D', '#123A31']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ alignItems: 'center', gap: 16 }}><Image source={require('../assets/icon/vakit-icon.png')} accessibilityLabel="Vakit uygulama ikonu" style={{ width: 84, height: 84, borderRadius: 24 }} /><Text style={{ color: '#F3F9F3', fontFamily: 'Manrope_600SemiBold', fontSize: 28, letterSpacing: -1 }}>Vakit</Text><Text style={{ color: '#B7D2BD', fontFamily: 'Manrope_400Regular', fontSize: 13 }}>Vaktin nefesini hisset.</Text><ActivityIndicator color="#B7D2BD" style={{ marginTop: 18 }} /></View>
  </LinearGradient>;
}
export default function RootLayout() {
  const [loaded, error] = useFonts({ Manrope_200ExtraLight, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold });
  useEffect(() => { if (loaded || error) void SplashScreen.hideAsync(); }, [loaded, error]);
  if (error) return <View style={{ flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#F3F9F3' }}><Text accessibilityRole="header">Vakit hazırlanamadı. Lütfen uygulamayı yeniden açın.</Text></View>;
  if (!loaded) return <BrandSplash />;
  return <AppStateProvider><NotificationProvider><ThemeProvider><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F3F9F3' } }}>
    <Stack.Screen name="index" />
    <Stack.Screen name="calendar" />
    <Stack.Screen name="qibla" />
    <Stack.Screen name="location" options={{ presentation: 'card' }} />
    <Stack.Screen name="appearance" options={{ presentation: 'modal' }} />
    <Stack.Screen name="settings" />
    <Stack.Screen name="calculation" />
    <Stack.Screen name="hijri" />
    <Stack.Screen name="notifications" />
    <Stack.Screen name="notification-help" />
    <Stack.Screen name="about" />
  </Stack></ThemeProvider></NotificationProvider></AppStateProvider>;
}

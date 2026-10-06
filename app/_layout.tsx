import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useFonts, Manrope_200ExtraLight, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import * as SplashScreen from 'expo-splash-screen';
import { AppStateProvider } from '@/services/app-state';
import { NotificationProvider } from '@/services/notifications/notification-context';
import { ThemeProvider } from '@/ui/theme-context';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

export { ErrorBoundary } from 'expo-router';
void SplashScreen.preventAutoHideAsync().catch(() => {});
function BrandSplash() {
  const [progress] = useState(() => new Animated.Value(0.32));

  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(progress, { toValue: 0.82, duration: 1100, useNativeDriver: false }),
      Animated.timing(progress, { toValue: 0.5, duration: 700, useNativeDriver: false }),
    ]));

    animation.start();
    return () => animation.stop();
  }, [progress]);

  return <LinearGradient colors={['#0E1324', '#1C1A3A', '#421C32', '#8A342B', '#CF6D1D', '#E59338']} locations={[0, 0.32, 0.58, 0.78, 0.92, 1]} style={styles.splash}>
    <View pointerEvents="none" style={styles.glowTop} />
    <View pointerEvents="none" style={[styles.particle, styles.particleOne]} />
    <View pointerEvents="none" style={[styles.particle, styles.particleTwo]} />
    <View pointerEvents="none" style={[styles.particle, styles.particleThree]} />
    <View style={styles.brand}>
      <View style={styles.iconFrame}><Image source={require('../assets/icon/vakit-icon.png')} accessibilityLabel="Vakitname uygulama ikonu" style={styles.icon} /></View>
      <Text style={styles.wordmark}>VAKİTNAME</Text>
      <Text style={styles.tagline}>SADE VE MANEVİ ZAMAN TAKİBİ</Text>
    </View>
    <View pointerEvents="none" style={styles.skyline}>
      <Svg width="100%" height="100%" viewBox="0 0 390 190" preserveAspectRatio="none">
        <Path d="M0 150H30V138H45V125H58V139H75V132H91V146H109V117H118V94H123V72H128V94H133V117H146V140H164V128H177V111H184V91H190V111H198V128H218V145H234V135H251V122H263V136H279V110H286V77H291V58H296V77H301V110H316V137H335V126H351V142H366V132H390V190H0Z" fill="#090B17" />
      </Svg>
    </View>
    <View style={styles.verse}>
      <Text style={styles.verseText}>“Gündüzün güneşin gün ortasını aşmasından gecenin karanlığına kadar namazı kıl; bir de sabah namazını; çünkü sabah namazı şahitlidir.”</Text>
      <Text style={styles.verseReference}>İSRÂ SURESİ · 78. AYET</Text>
    </View>
    <View style={styles.loading}>
      <Text style={styles.loadingLabel}>Hazırlanıyor</Text>
      <View style={styles.progressTrack}><Animated.View style={[styles.progressValue, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} /></View>
    </View>
  </LinearGradient>;
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  glowTop: { position: 'absolute', width: 280, height: 280, top: -130, borderRadius: 140, backgroundColor: '#FFFFFF12' },
  particle: { position: 'absolute', borderRadius: 99, backgroundColor: '#FFE5A4', opacity: 0.3 },
  particleOne: { width: 7, height: 7, top: '23%', left: '19%' },
  particleTwo: { width: 4, height: 4, top: '31%', right: '18%' },
  particleThree: { width: 6, height: 6, top: '43%', right: '29%' },
  brand: { alignItems: 'center', marginBottom: 42 },
  iconFrame: { width: 96, height: 96, alignItems: 'center', justifyContent: 'center', borderRadius: 24, borderWidth: 1, borderColor: '#FFFFFF4D', backgroundColor: '#FFFFFF1F', shadowColor: '#FFE088', shadowOpacity: 0.44, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  icon: { width: 84, height: 84, borderRadius: 20 },
  wordmark: { marginTop: 22, color: '#FFF8E8', fontFamily: 'Manrope_600SemiBold', fontSize: 28, letterSpacing: 5, paddingLeft: 5 },
  tagline: { marginTop: 10, color: '#FFE8B5', fontFamily: 'Manrope_500Medium', fontSize: 10, letterSpacing: 1.6 },
  skyline: { position: 'absolute', bottom: 0, width: '100%', height: 190, opacity: 0.88 },
  verse: { position: 'absolute', right: 32, bottom: 100, left: 32, alignItems: 'center' },
  verseText: { color: '#FFF2D4', fontFamily: 'Manrope_400Regular', fontSize: 12, lineHeight: 19, textAlign: 'center' },
  verseReference: { marginTop: 10, color: '#FFE2A2', fontFamily: 'Manrope_600SemiBold', fontSize: 9, letterSpacing: 1.3 },
  loading: { position: 'absolute', right: 32, bottom: 40, left: 32 },
  loadingLabel: { marginBottom: 9, color: '#FFF2CF', fontFamily: 'Manrope_500Medium', fontSize: 11, letterSpacing: 0.4 },
  progressTrack: { height: 4, overflow: 'hidden', borderRadius: 999, backgroundColor: '#FFFFFF42' },
  progressValue: { height: '100%', borderRadius: 999, backgroundColor: '#FFE088' },
});
export default function RootLayout() {
  const [loaded, error] = useFonts({ Manrope_200ExtraLight, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold });
  const [brandSplashComplete, setBrandSplashComplete] = useState(false);

  useEffect(() => {
    if (!loaded && !error) return;

    void SplashScreen.hideAsync();
    const timer = setTimeout(() => setBrandSplashComplete(true), 900);
    return () => clearTimeout(timer);
  }, [loaded, error]);

  if (error) return <View style={{ flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#F3F9F3' }}><Text accessibilityRole="header">Vakitname hazırlanamadı. Lütfen uygulamayı yeniden açın.</Text></View>;
  if (!loaded || !brandSplashComplete) return <BrandSplash />;
  return <AppStateProvider><NotificationProvider><ThemeProvider><Stack screenOptions={{ headerShown: false, freezeOnBlur: true, contentStyle: { backgroundColor: '#F3F9F3' } }}>
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

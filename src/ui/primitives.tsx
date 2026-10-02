import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, Animated, Easing, Pressable, ScrollView, StyleSheet, Text, TextProps, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from './theme-context';
import { Icon, IconName } from './icons';

const fonts = { light: 'Manrope_200ExtraLight', regular: 'Manrope_400Regular', medium: 'Manrope_500Medium', semibold: 'Manrope_600SemiBold' };
export function T({ weight = 'regular', style, ...props }: TextProps & { weight?: keyof typeof fonts }) {
  const theme = useTheme();
  return <Text {...props} style={[{ fontFamily: fonts[weight], fontSize: 15, color: theme.text }, style]} />;
}
export function Surface({ children, style }: React.PropsWithChildren<{ style?: ViewStyle }>) {
  const theme = useTheme();
  return <View style={[styles.surface, { backgroundColor: theme.surface, borderColor: theme.line }, style]}>{children}</View>;
}
export function Button({ label, onPress, icon, secondary = false, loading = false, disabled = false }: {
  label: string; onPress: () => void; icon?: IconName; secondary?: boolean; loading?: boolean; disabled?: boolean;
}) {
  const theme = useTheme();
  const color = secondary ? theme.accent : theme.accentText;
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: disabled || loading, busy: loading }}
    disabled={disabled || loading} onPress={onPress} style={({ pressed }) => [styles.button, { backgroundColor: secondary ? theme.surface : theme.accent, opacity: disabled ? .45 : pressed ? .8 : 1, borderColor: secondary ? theme.line : 'transparent', borderWidth: 1 }]}>
    {loading ? <ActivityIndicator color={color} /> : icon ? <Icon name={icon} color={color} size={20} /> : null}
    <T weight="semibold" style={{ color, textAlign: 'center', flexShrink: 1 }}>{label}</T>
  </Pressable>;
}
export function IconButton({ name, label, onPress }: { name: IconName; label: string; onPress: () => void }) {
  const theme = useTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.iconButton, { backgroundColor: theme.surface, opacity: pressed ? .6 : 1 }]}><Icon name={name} color={theme.text} /></Pressable>;
}
function Landscape({ color }: { color: string }) {
  return <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]} accessible={false}>
    <Svg width="100%" height="260" viewBox="0 0 500 260" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0 }}>
      <Path d="M0 120Q100 40 230 120T500 90V260H0Z" fill={color} opacity=".12" />
      <Path d="M0 190Q120 80 300 155T500 140V260H0Z" fill={color} opacity=".17" />
      <Path d="M0 240Q160 155 340 210T500 185V260H0Z" fill={color} opacity=".17" />
    </Svg>
  </View>;
}
function RamadanSky({ color }: { color: string }) {
  return <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]} accessible={false}>
    <Svg width="100%" height="300" viewBox="0 0 500 300" preserveAspectRatio="xMidYMin slice" style={{ position: 'absolute', top: 0 }}>
      <Path d="M405 28c-16 9-27 26-27 46 0 29 23 52 52 52 14 0 27-6 36-15-6 3-13 5-21 5-28 0-50-22-50-50 0-14 6-28 15-37Z" fill={color} opacity=".17" />
      <Path d="m333 56 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill={color} opacity=".2" />
      <Path d="m452 161 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill={color} opacity=".14" />
      <Circle cx="367" cy="145" r="2.5" fill={color} opacity=".18" />
      <Circle cx="470" cy="79" r="2" fill={color} opacity=".16" />
      <Circle cx="305" cy="123" r="1.8" fill={color} opacity=".14" />
    </Svg>
  </View>;
}
export function Backdrop({ children }: React.PropsWithChildren) {
  const theme = useTheme();
  const transitionKey = [theme.background.join(','), theme.surface, theme.text, theme.accent, theme.landscape].join('|');
  const previousKey = useRef(transitionKey);
  const currentVisual = { background: theme.background, landscape: theme.landscape, ramadan: theme.ramadan, glow: theme.glow };
  const [visuals, setVisuals] = useState(() => ({ key: transitionKey, current: currentVisual, outgoing: currentVisual }));
  if (visuals.key !== transitionKey) {
    setVisuals({ key: transitionKey, current: currentVisual, outgoing: visuals.current });
  }
  const outgoingVisual = visuals.outgoing;
  const [reduceMotion, setReduceMotion] = useState(false);
  const [outgoingOpacity] = useState(() => new Animated.Value(0));
  const [veilOpacity] = useState(() => new Animated.Value(0));
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);
  useLayoutEffect(() => {
    if (previousKey.current === transitionKey) return;
    previousKey.current = transitionKey;
    outgoingOpacity.stopAnimation();
    veilOpacity.stopAnimation();
    outgoingOpacity.setValue(1);
    veilOpacity.setValue(.12);
    Animated.parallel([
      Animated.timing(outgoingOpacity, { toValue: 0, duration: reduceMotion ? 0 : 320, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      Animated.timing(veilOpacity, { toValue: 0, duration: reduceMotion ? 0 : 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [outgoingOpacity, reduceMotion, theme.background, theme.glow, theme.landscape, theme.ramadan, transitionKey, veilOpacity]);
  return <LinearGradient colors={theme.background} style={{ flex: 1 }}>
    <StatusBar style={theme.dark ? 'light' : 'dark'} />
    {theme.ramadan ? <RamadanSky color={theme.glow} /> : null}
    <Landscape color={theme.landscape} />
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: outgoingOpacity }]}>
      <LinearGradient colors={outgoingVisual.background} style={StyleSheet.absoluteFill}>
        {outgoingVisual.ramadan ? <RamadanSky color={outgoingVisual.glow} /> : null}
        <Landscape color={outgoingVisual.landscape} />
      </LinearGradient>
    </Animated.View>
    {children}
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#08131F', opacity: veilOpacity }]} />
  </LinearGradient>;
}
export function Page({ children, footer, scroll = true }: React.PropsWithChildren<{ footer?: React.ReactNode; scroll?: boolean }>) {
  const insets = useSafeAreaInsets();
  return <Backdrop><View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
    {scroll ? <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>{children}</ScrollView>
      : <View style={[styles.page, { flex: 1 }]}>{children}</View>}
    {footer ? <View style={styles.footer}>{footer}</View> : null}
  </View></Backdrop>;
}
export const styles = StyleSheet.create({
  page: { width: '100%', maxWidth: 480, alignSelf: 'center', paddingHorizontal: 24, paddingTop: 14, paddingBottom: 24, flexGrow: 1 },
  footer: { width: '100%', maxWidth: 480, alignSelf: 'center', paddingHorizontal: 24, paddingBottom: 12, paddingTop: 8 },
  surface: { borderWidth: 1, borderRadius: 26, padding: 20 },
  button: { minHeight: 54, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  iconButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});

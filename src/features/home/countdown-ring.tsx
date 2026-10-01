import React, { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, { ReduceMotion, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { countdown, formatTime } from '@/domain/time';
import { PrayerEvent } from '@/domain/types';
import { useTheme } from '@/ui/theme-context';
import { T } from '@/ui/primitives';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
export function CountdownRing({ target, now, progress, label, zone, targetCaption = 'Vakit saati' }: { target: PrayerEvent; now: number; progress: number; label: string; zone: string; targetCaption?: string }) {
  const theme = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const size = Math.min(width - 56, 310);
  const circumference = 2 * Math.PI * 133;
  const value = useSharedValue(progress);
  useEffect(() => { value.value = withTiming(progress, { duration: 800, reduceMotion: ReduceMotion.System }); }, [progress, value]);
  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: circumference * (1 - value.value) }));
  const remaining = countdown(target.at, now);
  return <View style={{ alignSelf: 'center', width: size, height: size, marginVertical: 24 }}>
    <Svg width={size} height={size} viewBox="0 0 310 310" aria-hidden={true}>
      <Defs><RadialGradient id="halo"><Stop offset="0" stopColor={theme.glow} stopOpacity=".09" /><Stop offset="1" stopColor={theme.glow} stopOpacity="0" /></RadialGradient></Defs>
      <Circle cx="155" cy="155" r="155" fill="url(#halo)" />
      <Circle cx="155" cy="155" r="133" fill="none" stroke={theme.track} strokeWidth="2" />
      <AnimatedCircle cx="155" cy="155" r="133" fill="none" stroke={theme.accent} strokeWidth="3" strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`} transform="rotate(-90 155 155)" animatedProps={animatedProps} />
      <Circle cx="155" cy="22" r="4" fill={theme.accent} />
    </Svg>
    <View style={s.center} accessible accessibilityLabel={`${label}. Kalan süre ${remaining}. Hedef saat ${formatTime(target.at, zone)}`} accessibilityLiveRegion="none">
      <View style={[s.pill, { backgroundColor: theme.highlight }]}><T weight="semibold" style={[s.label, { color: theme.accent }]}>{label.toLocaleUpperCase('tr')}</T></View>
      <T weight="light" style={{ fontSize: Math.max(32, (size / 5.8) / Math.max(1, fontScale * .8)), letterSpacing: -2.5, fontVariant: ['tabular-nums'], marginTop: 8 }} numberOfLines={1}>{remaining}</T>
      <T style={{ fontSize: 12, color: theme.muted, marginTop: 6 }}><T style={{ fontSize: 10, color: theme.accent }}>● </T> {targetCaption} · {formatTime(target.at, zone)}</T>
    </View>
  </View>;
}
const s = StyleSheet.create({ center: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', padding: 22 }, pill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 }, label: { fontSize: 10, letterSpacing: 1, textAlign: 'center' } });

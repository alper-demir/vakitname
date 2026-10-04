import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { angularDifference, compassLabel, qiblaDirection } from '@/domain/qibla';
import { HeadingAvailability, HeadingReading, headingAvailability, requestHeadingPermission, watchHeading } from '@/services/qibla-heading';
import { useAppState } from '@/services/app-state';
import { Button, IconButton, Page, Surface, T } from '@/ui/primitives';
import { Icon } from '@/ui/icons';
import { useTheme } from '@/ui/theme-context';

function Compass({ bearing, heading, active }: { bearing: number; heading: number | null; active: boolean }) {
  const theme = useTheme();
  const relative = heading === null ? bearing : angularDifference(bearing, heading);
  const rotation = `${relative} 150 150`;
  return <View accessibilityLabel={active ? `Kıble oku, ${Math.round(Math.abs(relative))} derece yön farkı` : `Kıble oku, gerçek kuzeye göre ${Math.round(bearing)} derece`} accessible style={s.compass}>
    <Svg width="100%" height="100%" viewBox="0 0 300 300">
      <Circle cx="150" cy="150" r="138" fill={theme.highlight} stroke={theme.line} strokeWidth="1" />
      <Circle cx="150" cy="150" r="116" fill="none" stroke={theme.line} strokeDasharray="2 7" strokeWidth="1" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => <Line key={angle} x1="150" y1="25" x2="150" y2={angle % 90 === 0 ? '42' : '35'} transform={`rotate(${angle} 150 150)`} stroke={angle === 0 ? theme.accent : theme.muted} strokeWidth={angle % 90 === 0 ? 2 : 1} />)}
      <SvgText x="150" y="62" textAnchor="middle" fill={theme.accent} fontSize="14" fontFamily="Manrope_600SemiBold">K</SvgText>
      <SvgText x="238" y="155" textAnchor="middle" fill={theme.muted} fontSize="13" fontFamily="Manrope_400Regular">D</SvgText>
      <SvgText x="150" y="247" textAnchor="middle" fill={theme.muted} fontSize="13" fontFamily="Manrope_400Regular">G</SvgText>
      <SvgText x="62" y="155" textAnchor="middle" fill={theme.muted} fontSize="13" fontFamily="Manrope_400Regular">B</SvgText>
      <Path d="M150 73 167 157 150 139 133 157Z" transform={`rotate(${rotation})`} fill={theme.accent} opacity=".95" />
      <Circle cx="150" cy="150" r="42" fill={theme.surfaceStrong} stroke={theme.line} />
      <SvgText x="150" y="143" textAnchor="middle" fill={theme.muted} fontSize="10" fontFamily="Manrope_500Medium">KIBLE AÇISI</SvgText>
      <SvgText x="150" y="170" textAnchor="middle" fill={theme.text} fontSize="27" fontFamily="Manrope_600SemiBold">{Math.round(bearing)}°</SvgText>
    </Svg>
  </View>;
}

function headingCopy(status: HeadingAvailability, reading: HeadingReading | null, bearing: number): { title: string; detail: string; aligned: boolean } {
  const trueHeading = reading?.trueHeading;
  if (trueHeading !== null && trueHeading !== undefined) {
    const difference = Math.abs(angularDifference(bearing, trueHeading));
    const accuracy = reading?.accuracy ?? 0;
    if (accuracy >= 2 && difference <= 5) return { title: 'Kıble doğrultusuna yakınsın', detail: 'Kıble ile hizalandın.', aligned: true };
    if (accuracy < 2) return { title: 'Pusula hassasiyeti düşük', detail: 'Telefonu yatay tutup metal yüzeylerden uzaklaştırarak yavaşça hareket ettir.', aligned: false };
    return { title: `${Math.round(difference)}° yön farkı var`, detail: 'Oku merkezde tutacak şekilde yavaşça dön.', aligned: false };
  }
  if (reading?.magneticHeading !== null && reading?.magneticHeading !== undefined) return { title: 'Manyetik pusula verisi alındı', detail: 'Gerçek kuzey verisi olmadığı için hizalama doğrulanmıyor.', aligned: false };
  if (status === 'permission-required') return { title: 'Pusula için konum izni gerekli', detail: 'İzin verilirse cihaz gerçek kuzeye göre hizalamayı deneyebilir.', aligned: false };
  return { title: 'Cihaz pusulası kullanılamıyor', detail: 'Kıble açısını gerçek kuzeye göre manuel olarak kullanabilirsin.', aligned: false };
}

export default function QiblaScreen() {
  const theme = useTheme();
  const { location } = useAppState();
  const [availability, setAvailability] = useState<HeadingAvailability>('unavailable');
  const [reading, setReading] = useState<HeadingReading | null>(null);
  const [headingVersion, setHeadingVersion] = useState(0);

  useEffect(() => {
    let remove = () => {};
    let mounted = true;
    void headingAvailability().then(async (next) => {
      if (!mounted) return;
      setAvailability(next);
      if (next === 'available') remove = await watchHeading((value) => { if (mounted) setReading(value); }, () => { if (mounted) setAvailability('unavailable'); });
    }).catch(() => { if (mounted) setAvailability('unavailable'); });
    return () => { mounted = false; remove(); };
  }, [headingVersion]);

  const direction = useMemo(() => location ? qiblaDirection(location) : null, [location]);
  const status = direction ? headingCopy(availability, reading, direction.bearing) : null;
  const enableCompass = async () => {
    const next = await requestHeadingPermission();
    setAvailability(next);
    if (next === 'available') setHeadingVersion((value) => value + 1);
  };
  const footer = <View style={[s.dock, { backgroundColor: theme.surface, borderColor: theme.line }]}>
    <Pressable accessibilityRole="button" accessibilityLabel="Bugün" onPress={() => router.replace('/')} style={s.dockItem}><Icon name="clock" color={theme.muted} /><T style={[s.dockText, { color: theme.muted }]}>Bugün</T></Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Takvim" onPress={() => router.replace('/calendar')} style={s.dockItem}><Icon name="calendar" color={theme.muted} /><T style={[s.dockText, { color: theme.muted }]}>Takvim</T></Pressable>
    <View accessibilityRole="tab" accessibilityState={{ selected: true }} style={s.dockItem}><Icon name="compass" color={theme.accent} /><T weight="semibold" style={[s.dockText, { color: theme.accent }]}>Kıble</T></View>
    <Pressable accessibilityRole="button" accessibilityLabel="Ayarlar" onPress={() => router.replace('/settings')} style={s.dockItem}><Icon name="settings" color={theme.muted} /><T style={[s.dockText, { color: theme.muted }]}>Ayarlar</T></Pressable>
  </View>;
  const close = () => router.canGoBack() ? router.back() : router.replace('/');
  if (!location || !direction || !status) return <Page footer={footer}><View style={s.header}><IconButton name="back" label="Geri" onPress={close} /><T accessibilityRole="header" weight="semibold" style={{ fontSize: 20 }}>Kıble yönü</T><View style={{ width: 44 }} /></View><View style={s.empty}><Icon name="compass" size={50} color={theme.accent} /><T weight="medium" style={s.emptyTitle}>Kıble için konum seç</T><T style={[s.emptyCopy, { color: theme.muted }]}>Kâbe doğrultusunu hesaplamak için önce bir il veya ilçe seçmelisin.</T><Button label="Konum seç" onPress={() => router.push('/location')} /></View></Page>;
  const heading = reading?.trueHeading ?? null;
  return <Page footer={footer}>
    <View style={s.header}><IconButton name="back" label="Geri" onPress={close} /><View style={{ alignItems: 'center' }}><T accessibilityRole="header" weight="semibold" style={{ fontSize: 20 }}>Kıble yönü</T><T style={{ color: theme.muted, fontSize: 11, marginTop: 3 }}>{location.name}</T></View><IconButton name="pin" label="Konumu değiştir" onPress={() => router.push('/location')} /></View>
    <View style={[s.status, { backgroundColor: status.aligned ? theme.highlight : theme.surface }]}><Icon name={status.aligned ? 'check' : 'compass'} color={theme.accent} size={18} /><View style={{ flex: 1 }}><T weight="semibold" style={{ fontSize: 13 }}>{status.title}</T><T style={{ color: theme.muted, fontSize: 11, lineHeight: 18, marginTop: 3 }}>{status.detail}</T></View></View>
    <Compass bearing={direction.bearing} heading={heading} active={heading !== null} />
    <Surface style={{ padding: 18 }}><View style={s.directionHeader}><View style={[s.iconCircle, { backgroundColor: theme.highlight }]}><Icon name="compass" color={theme.accent} /></View><View style={{ flex: 1 }}><T weight="medium" style={{ fontSize: 22 }}>{Math.round(direction.bearing)}° {compassLabel(direction.bearing)}</T><T style={{ color: theme.muted, fontSize: 12, marginTop: 3 }}>Kıble açısı · gerçek kuzeye göre</T></View></View><View style={[s.metrics, { borderTopColor: theme.line }]}><View><T style={{ color: theme.muted, fontSize: 10, letterSpacing: 1 }}>MESAFE</T><T weight="semibold" style={{ color: theme.accent, fontSize: 20, marginTop: 5 }}>~{Math.round(direction.distanceKm).toLocaleString('tr-TR')} km</T><T style={{ color: theme.muted, fontSize: 11, marginTop: 2 }}>Kâbe-i Muazzama</T></View><View><T style={{ color: theme.muted, fontSize: 10, letterSpacing: 1 }}>PUSULA</T><T weight="semibold" style={{ color: theme.accent, fontSize: 15, marginTop: 7 }}>{heading === null ? 'Manuel açı' : 'Gerçek kuzey'}</T><T style={{ color: theme.muted, fontSize: 11, marginTop: 4 }}>{reading?.accuracy !== null && reading?.accuracy !== undefined ? `Hassasiyet: ${reading.accuracy}/3` : 'Hizalama doğrulanmadı'}</T></View></View></Surface>
    {availability === 'permission-required' ? <View style={{ marginTop: 16 }}><Button icon="gps" label="Pusulayı etkinleştir" onPress={() => { void enableCompass(); }} /></View> : null}
    <Surface style={{ marginTop: 16, padding: 18, backgroundColor: theme.highlight }}><View style={s.helpTitle}><Icon name="info" color={theme.accent} size={19} /><T weight="semibold">Pusula kullanımı</T></View><T style={{ color: theme.muted, fontSize: 12, lineHeight: 21, marginTop: 10 }}>Telefonu yatay tut. Metal yüzeylerden, mıknatıslı kılıflardan ve diğer cihazlardan uzaklaştır. Pusula kararsızsa telefonu havada yavaşça sekiz çizerek hareket ettir; bu, cihazın yön sensörünü kalibre etmesine yardımcı olur.</T><T style={{ color: theme.muted, fontSize: 11, lineHeight: 18, marginTop: 10 }}>Mesafe kuş uçuşudur. Pusula yokken ok, {Math.round(direction.bearing)}° gerçek kuzey doğrultusunu gösterir.</T></Surface>
  </Page>;
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 20, padding: 13, marginBottom: 14 },
  compass: { width: '100%', aspectRatio: 1, maxWidth: 350, alignSelf: 'center', marginVertical: 2 },
  directionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 }, iconCircle: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  metrics: { flexDirection: 'row', gap: 18, justifyContent: 'space-between', marginTop: 17, paddingTop: 16, borderTopWidth: 1 },
  helpTitle: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingBottom: 80 }, emptyTitle: { fontSize: 22, textAlign: 'center' }, emptyCopy: { textAlign: 'center', lineHeight: 22, maxWidth: 290 },
  dock: { flexDirection: 'row', borderWidth: 1, borderRadius: 32, paddingVertical: 8 }, dockItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: 44 }, dockText: { fontSize: 9 },
});

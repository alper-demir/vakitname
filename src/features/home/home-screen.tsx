import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import { useAppState } from '@/services/app-state';
import { prayerProvider } from '@/services/prayer/adhan-provider';
import { addDays, formatDate, formatTime, getEvent, localDateAt, timelineAt } from '@/domain/time';
import { ramadanAt } from '@/domain/calendar';
import { phaseNames, seasonNames } from '@/domain/theme';
import { tr } from '@/i18n/tr';
import { useNow } from '@/ui/use-now';
import { useTheme } from '@/ui/theme-context';
import { Button, IconButton, Page, Surface, T } from '@/ui/primitives';
import { Icon, Logo } from '@/ui/icons';
import { CountdownRing } from './countdown-ring';

export default function HomeScreen() {
  const state = useAppState();
  const theme = useTheme();
  const now = useNow();
  const [info, setInfo] = useState(false);
  const date = localDateAt(now, state.location?.timeZone);
  const result = useMemo(() => {
    if (!state.location) return null;
    try { return { days: [-1, 0, 1].map((delta) => prayerProvider.getDay(addDays(date, delta), state.location!, state.preferences.adjustments)), error: null }; }
    catch (error) { return { days: null, error: error instanceof Error ? error.message : 'Vakitler hesaplanamadı' }; }
  }, [date, state.location, state.preferences.adjustments]);
  const themeButton = () => router.push('/appearance');
  const locationButton = () => router.push('/location');
  const settingsButton = () => router.push('/settings');
  const calendarButton = () => router.push('/calendar');
  const qiblaButton = () => router.push('/qibla');
  const header = <View style={s.header}><View style={s.brand}><Logo color={theme.dark ? '#49665C' : '#66856A'} /><T accessibilityRole="header" weight="semibold" style={{ fontSize: 23, letterSpacing: -.8 }}>Vakit</T></View><IconButton name="palette" label="Görünümü değiştir" onPress={themeButton} /></View>;
  if (!state.ready) return <Page>{header}<View style={s.welcome}><ActivityIndicator color={theme.accent} /><T style={{ color: theme.muted }}>Vakit hazırlanıyor…</T></View></Page>;
  if (!state.location) return <Page>{header}
    <View style={s.welcome}><View style={[s.welcomeIcon, { backgroundColor: theme.surface }]}><Icon name="imsak" size={54} color={theme.accent} /></View>
      <T style={s.eyebrow}>VAKTİN NEFESİNİ HİSSET</T>
      <T accessibilityRole="header" weight="medium" style={s.welcomeTitle}>Günün ritmi,{"\n"}bulunduğun yerde.</T>
      <T style={[s.welcomeCopy, { color: theme.muted }]}>Namaz vakitlerin, sakin bir geri sayım ve sana eşlik eden gökyüzü.</T>
    </View>
    {state.recovered && <T style={s.notice}>Kayıtlı tercihler okunamadı. Şehrini yeniden seçebilirsin.</T>}
    {state.savingError && <T style={s.notice}>Cihazdaki kayıt okunamadı veya kaydedilemedi. Şehir seçerek devam edebilirsin.</T>}
    {state.locationError && <Surface style={{ marginBottom: 16 }}><T style={{ lineHeight: 23 }}>{tr.locationErrors[state.locationError] ?? tr.locationErrors.unavailable}</T></Surface>}
    <View style={{ gap: 12 }}><Button icon="gps" label="Konumumu kullan" loading={state.locating} onPress={() => { void state.requestLocation(); }} /><Button secondary icon="pin" label="Şehir veya ilçe seç" onPress={locationButton} /></View>
    <T style={[s.privacy, { color: theme.muted }]}>Hesapsız. Reklamsız. Çevrimdışı.{"\n"}Konumun yalnızca cihazında saklanır.</T>
  </Page>;
  if (!result?.days) return <Page>{header}<View style={s.welcome}><Icon name="info" size={40} color={theme.accent} /><T>{result?.error ?? 'Vakitler hazırlanıyor'}</T><Button label="Konumu değiştir" onPress={locationButton} /></View></Page>;
  const days = result.days;
  const today = days[1]!, tomorrow = days[2]!;
  const { next, progress } = timelineAt(days, now);
  const ramadan = ramadanAt(now, today, tomorrow, state.preferences.hijriOffset);
  const showFasting = theme.ramadan || (state.preferences.theme.ramadan !== 'off' && ramadan.fasting);
  const target = showFasting && ramadan.target ? ramadan.target : next;
  const isTomorrow = target.localDate !== today.localDate;
  const ramadanFocus = target !== next;
  const ringProgress = ramadanFocus ? Math.min(1, Math.max(0, (now - getEvent(today, 'imsak').at) / (target.at - getEvent(today, 'imsak').at))) : progress;
  const label = (showFasting && ramadan.target?.id === 'aksam' ? 'İftara kalan süre' : `${isTomorrow ? 'Yarın ' : ''}${tr.prayerNames[target.id]} vaktine`);
  const footer = <View style={[s.dock, { backgroundColor: theme.surface, borderColor: theme.line }]}>
    <View accessibilityRole="tab" accessibilityState={{ selected: true }} style={s.dockItem}><Icon name="clock" color={theme.accent} /><T weight="semibold" style={[s.dockText, { color: theme.accent }]}>Bugün</T></View>
    <Pressable accessibilityRole="button" accessibilityLabel="Takvim" onPress={calendarButton} style={s.dockItem}><Icon name="calendar" color={theme.muted} /><T style={[s.dockText, { color: theme.muted }]}>Takvim</T></Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Kıble" onPress={qiblaButton} style={s.dockItem}><Icon name="compass" color={theme.muted} /><T style={[s.dockText, { color: theme.muted }]}>Kıble</T></Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Ayarlar" onPress={settingsButton} style={s.dockItem}><Icon name="settings" color={theme.muted} /><T style={[s.dockText, { color: theme.muted }]}>Ayarlar</T></Pressable>
  </View>;
  return <Page footer={footer}>{header}
    <Animated.View entering={FadeIn.duration(400).reduceMotion(ReduceMotion.System)}>
      <View style={s.locationBlock}>
        <Pressable accessibilityRole="button" accessibilityLabel={`${state.location.name}, konumu değiştir`} onPress={locationButton} style={[s.locationPill, { backgroundColor: theme.surface }]}>
          <Icon name="pin" color={theme.accent} size={17} /><T weight="medium" style={{ fontSize: 16 }}>{state.location.name}</T><Icon name="chevron" color={theme.muted} size={18} />
        </Pressable>
        <T style={{ color: theme.muted, fontSize: 12, textAlign: 'center', lineHeight: 20 }}>{ramadan.civil.label} <T style={{ color: theme.subtle, fontSize: 12 }}> · </T>{formatDate(today.localDate)}</T>
      </View>
      <CountdownRing target={target} now={now} progress={ringProgress} label={label} zone={today.timeZone} />
      <View style={s.ambientLabel}><View style={[s.dot, { backgroundColor: theme.accent }]} /><T style={{ color: theme.muted, fontSize: 11, letterSpacing: .6 }}>{theme.ramadan ? 'Ramazan atmosferi' : `${seasonNames[theme.season]} · ${phaseNames[theme.phase]}`}</T></View>
      {state.savingError && <T style={s.notice}>Tercihler kaydedilemedi. Uygulama kapanınca yeniden seçmen gerekebilir.</T>}
      {state.locationError && <T style={s.notice}>Konum yenilenemedi; kayıtlı konum kullanılıyor.</T>}
      {next.localDate !== today.localDate && <Surface style={{ marginBottom: 20, padding: 16 }}><View style={s.between}><T style={{ color: theme.muted, fontSize: 12 }}>Yarının ilk vakti</T><T style={{ color: theme.muted, fontSize: 12 }}>{formatDate(next.localDate)}</T></View><View style={[s.between, { marginTop: 8 }]}><T weight="medium">İmsak</T><T weight="semibold" style={{ fontSize: 22, color: theme.accent }}>{formatTime(next.at, today.timeZone)}</T></View></Surface>}
      {showFasting && ramadan.target && <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
        {(['imsak', 'aksam'] as const).map((id) => <Surface key={id} style={{ flex: 1, padding: 14 }}><T style={{ color: theme.muted, fontSize: 11 }}>{isTomorrow ? 'YARIN · ' : ''}{id === 'imsak' ? 'İMSAK' : 'İFTAR'}</T><T weight="medium" style={{ marginTop: 8, fontSize: 23, color: theme.accent }}>{formatTime(getEvent(isTomorrow ? tomorrow : today, id).at, today.timeZone)}</T></Surface>)}
      </View>}
      <View style={[s.between, { marginBottom: 12 }]}><T accessibilityRole="header" weight="medium" style={{ fontSize: 13 }}>Günün vakitleri</T><T style={{ color: theme.muted, fontSize: 11 }}>{today.events.every((e) => e.at <= now) ? 'Son vakit girdi' : 'Türkiye yöntemi'}</T></View>
      <Surface style={{ padding: 8 }}>
        {today.events.map((event) => {
          const selected = event.at === next.at;
          const passed = event.at <= now;
          return <View key={event.id} style={[s.prayerRow, { backgroundColor: selected ? theme.highlight : 'transparent' }]} accessible accessibilityLabel={`${tr.prayerNames[event.id]}, ${formatTime(event.at, today.timeZone)}${selected ? ', sıradaki vakit' : passed ? ', vakit girdi' : ''}`}>
            {selected && <View style={[s.activeEdge, { backgroundColor: theme.accent }]} />}
            <View style={[s.prayerIcon, { backgroundColor: selected ? theme.surface : 'transparent' }]}><Icon name={event.id} color={selected ? theme.accent : theme.subtle} size={22} /></View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><T weight={selected ? 'semibold' : 'regular'} style={{ color: passed ? theme.muted : theme.text, fontSize: 15 }}>{tr.prayerNames[event.id]}</T>{selected && <View style={[s.badge, { backgroundColor: theme.accent }]}><T weight="semibold" style={{ color: theme.accentText, fontSize: 8, letterSpacing: .6 }}>SIRADAKİ</T></View>}</View>
            <T weight={selected ? 'semibold' : 'regular'} style={{ fontSize: 18, color: selected ? theme.accent : passed ? theme.muted : theme.text, fontVariant: ['tabular-nums'] }}>{formatTime(event.at, today.timeZone)}</T>
            <View style={{ width: 20, marginLeft: 10 }}>{passed ? <Icon name="check" size={15} color={theme.subtle} /> : selected ? <View style={[s.dot, { backgroundColor: theme.accent, alignSelf: 'center' }]} /> : null}</View>
          </View>;
        })}
      </Surface>
      <Pressable accessibilityRole="button" accessibilityLabel="Vakitlerin hesaplanması hakkında" onPress={() => setInfo(true)} style={s.source}><Icon name="info" size={13} color={theme.subtle} /><T style={{ color: theme.subtle, fontSize: 10 }}>Cihazında hesaplandı · Çevrimdışı hazır</T></Pressable>
      {ramadanFocus && <T style={{ textAlign: 'center', color: theme.muted, fontSize: 12 }}>Sıradaki vakit: {tr.prayerNames[next.id]} · {formatTime(next.at, today.timeZone)}</T>}
    </Animated.View>
    <Modal visible={info} transparent animationType="fade" onRequestClose={() => setInfo(false)}>
      <View style={s.modalOverlay}><Surface style={{ width: '100%', maxWidth: 420, backgroundColor: theme.surfaceStrong, gap: 16 }}><T weight="semibold" style={{ fontSize: 21 }}>Vakitlerin kaynağı</T>
        <T style={{ color: theme.muted, lineHeight: 24 }}>Vakitler konumuna göre Adhan Türkiye yöntemiyle cihazında hesaplanır. Resmî Diyanet verisi değildir; yerel takvimle farklılık gösterebilir.</T>
        <T style={{ color: theme.muted, lineHeight: 22, fontSize: 13 }}>Hicri tarih: {ramadan.civil.source === 'diyanet-months' ? 'Diyanet ay başlangıçları (2026–2027)' : ramadan.civil.source === 'unavailable' ? 'Bu cihazda kullanılamıyor' : 'Hesaplanan Umm al-Qura takvimi'}.{state.location.source === 'gps' ? ' Vakitler GPS koordinatından hesaplanır; yer adı en yakın kayıtlı ilçeye göre yaklaşık gösterilir.' : state.location.coordinateKind === 'representative' ? ' Seçili ilçenin koordinatı yaklaşık temsil noktasıdır.' : ' Manuel seçim, yerleşim merkezi koordinatını kullanır.'}</T>
        <T style={{ color: theme.subtle, fontSize: 11, lineHeight: 18 }}>Konum verisi: GeoNames (CC BY 4.0). Sınırlar: Natural Earth (public domain). Yazı tipi: Manrope (OFL).</T><Button label="Anladım" onPress={() => setInfo(false)} /></Surface></View>
    </Modal>
  </Page>;
}
const s = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }, brand: { flexDirection: 'row', gap: 9, alignItems: 'center' },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }, locationBlock: { alignItems: 'center', gap: 13, marginTop: 7 },
  locationPill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 30, paddingHorizontal: 16, minHeight: 44, paddingVertical: 8 },
  ambientLabel: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: -5, marginBottom: 32 }, dot: { width: 5, height: 5, borderRadius: 3 },
  prayerRow: { flexDirection: 'row', alignItems: 'center', minHeight: 57, borderRadius: 18, paddingHorizontal: 9, paddingVertical: 9, position: 'relative' },
  prayerIcon: { height: 36, width: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 9 }, activeEdge: { position: 'absolute', left: 0, width: 3, height: 29, borderRadius: 4 },
  badge: { borderRadius: 10, paddingHorizontal: 6, paddingVertical: 3 }, source: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, minHeight: 44, marginTop: 10 },
  dock: { flexDirection: 'row', borderWidth: 1, borderRadius: 32, paddingVertical: 10 }, dockItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5, minHeight: 44 }, dockText: { fontSize: 10 },
  welcome: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, paddingVertical: 48 }, welcomeIcon: { width: 108, height: 108, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  eyebrow: { fontSize: 10, letterSpacing: 2 }, welcomeTitle: { fontSize: 34, lineHeight: 45, textAlign: 'center', letterSpacing: -1.3 }, welcomeCopy: { lineHeight: 25, textAlign: 'center', maxWidth: 290 }, privacy: { textAlign: 'center', fontSize: 11, lineHeight: 21, marginTop: 25 },
  notice: { fontSize: 12, lineHeight: 20, marginBottom: 16 }, modalOverlay: { flex: 1, backgroundColor: '#00000066', alignItems: 'center', justifyContent: 'center', padding: 24 },
});

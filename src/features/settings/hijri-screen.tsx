import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { calendarProvider } from '@/domain/calendar';
import { formatDate, localDateAt } from '@/domain/time';
import { useAppState } from '@/services/app-state';
import { useTheme } from '@/ui/theme-context';
import { useNow } from '@/ui/use-now';
import { IconButton, Page, Surface, T } from '@/ui/primitives';

export default function HijriScreen() {
  const theme = useTheme();
  const { preferences, updateHijriOffset } = useAppState();
  const now = useNow(60000);
  const localDate = localDateAt(now);
  const hijri = calendarProvider.getDate(localDate, preferences.hijriOffset);
  const close = () => router.canGoBack() ? router.back() : router.replace('/settings');
  return <Page>
    <View style={s.header}><IconButton name="back" label="Ayarlara dön" onPress={close} /><T accessibilityRole="header" weight="semibold" style={{ fontSize: 20 }}>Hicri tarih</T><View style={{ width: 44 }} /></View>
    <Surface style={{ padding: 22 }}><T weight="semibold" style={{ color: theme.accent, fontSize: 10, letterSpacing: 1.3 }}>CANLI ÖNİZLEME</T><T style={{ color: theme.muted, marginTop: 20 }}>Miladi tarih</T><T weight="medium" style={{ fontSize: 23, marginTop: 5 }}>{formatDate(localDate, true)}</T>
      <View style={[s.preview, { backgroundColor: theme.highlight }]}><T style={{ color: theme.muted, fontSize: 11 }}>HİCRİ KARŞILIK</T><T weight="medium" style={{ fontSize: 27, marginTop: 7 }}>{hijri.label}</T></View>
    </Surface>
    <Surface style={{ marginTop: 20 }}><T weight="medium" style={{ fontSize: 21 }}>Hicri gün düzeltmesi</T><T style={{ color: theme.muted, lineHeight: 23, marginTop: 8 }}>Yerel takvim veya hilal gözlemi farkları için gösterilen tarihi ±2 gün değiştirebilirsin.</T>
      <View style={[s.offset, { backgroundColor: theme.highlight }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Hicri günü azalt" disabled={preferences.hijriOffset <= -2} onPress={() => updateHijriOffset(preferences.hijriOffset - 1)} style={[s.largeButton, { backgroundColor: theme.surfaceStrong }]}><T weight="semibold" style={{ fontSize: 25 }}>−</T></Pressable>
        <View><T weight="semibold" style={{ textAlign: 'center', fontSize: 18 }}>{preferences.hijriOffset > 0 ? '+' : ''}{preferences.hijriOffset} gün</T><T style={{ color: theme.muted, fontSize: 10, marginTop: 4 }}>Gösterim düzeltmesi</T></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Hicri günü artır" disabled={preferences.hijriOffset >= 2} onPress={() => updateHijriOffset(preferences.hijriOffset + 1)} style={[s.largeButton, { backgroundColor: theme.surfaceStrong }]}><T weight="semibold" style={{ fontSize: 25 }}>+</T></Pressable>
      </View>
      <View style={s.chips}>{[-2, -1, 0, 1, 2].map((value) => { const selected = preferences.hijriOffset === value; return <Pressable key={value} accessibilityRole="radio" accessibilityState={{ checked: selected }} accessibilityLabel={`${value > 0 ? '+' : ''}${value} gün`} onPress={() => updateHijriOffset(value)} style={[s.chip, { backgroundColor: selected ? theme.accent : theme.highlight }]}><T weight="medium" style={{ color: selected ? theme.accentText : theme.text, fontSize: 11 }}>{value > 0 ? '+' : ''}{value}</T></Pressable>; })}</View>
    </Surface>
    <Surface style={{ marginTop: 20 }}><T weight="medium">Takvim kaynağı</T><T style={{ color: theme.muted, lineHeight: 22, marginTop: 7 }}>{hijri.source === 'diyanet-months' ? '2026–2027 için Diyanet ay başlangıçları kullanılıyor.' : hijri.source === 'umm-al-qura' ? 'Kapsam dışındaki tarihlerde cihazın Umm al-Qura takvimi kullanılıyor.' : 'Bu cihazda Hicri takvim kullanılamıyor.'}</T></Surface>
  </Page>;
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }, preview: { borderRadius: 20, padding: 18, marginTop: 22 },
  offset: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 20, padding: 10, marginTop: 20 }, largeButton: { width: 56, height: 56, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', gap: 7, marginTop: 14 }, chip: { flex: 1, minHeight: 42, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});

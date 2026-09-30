import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { prayerIds, PrayerId } from '@/domain/types';
import { tr } from '@/i18n/tr';
import { useAppState } from '@/services/app-state';
import { useTheme } from '@/ui/theme-context';
import { Icon } from '@/ui/icons';
import { Button, IconButton, Page, Surface, T } from '@/ui/primitives';

function AdjustmentRow({ id }: { id: PrayerId }) {
  const theme = useTheme();
  const { preferences, updateAdjustment } = useAppState();
  const value = preferences.adjustments[id];
  const label = `${value > 0 ? '+' : ''}${value} dk`;
  return <View style={[s.adjustment, { backgroundColor: theme.surfaceStrong }]}>
    <View style={s.prayer} accessible accessibilityLabel={`${tr.prayerNames[id]}, ${label}`}><Icon name={id} color={theme.accent} size={21} /><T weight="medium">{tr.prayerNames[id]}</T></View>
    <View style={[s.stepper, { backgroundColor: theme.highlight }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={`${tr.prayerNames[id]} düzeltmesini azalt`} disabled={value <= -30} onPress={() => updateAdjustment(id, value - 1)} style={s.stepButton}><T weight="semibold" style={{ fontSize: 22 }}>−</T></Pressable>
      <T style={{ minWidth: 54, textAlign: 'center', fontSize: 12 }}>{label}</T>
      <Pressable accessibilityRole="button" accessibilityLabel={`${tr.prayerNames[id]} düzeltmesini artır`} disabled={value >= 30} onPress={() => updateAdjustment(id, value + 1)} style={s.stepButton}><T weight="semibold" style={{ fontSize: 22 }}>+</T></Pressable>
    </View>
  </View>;
}

export default function CalculationScreen() {
  const theme = useTheme();
  const { resetAdjustments } = useAppState();
  const close = () => router.canGoBack() ? router.back() : router.replace('/settings');
  return <Page>
    <View style={s.header}><IconButton name="back" label="Ayarlara dön" onPress={close} /><T accessibilityRole="header" weight="semibold" style={{ fontSize: 20 }}>Vakit hesabı</T><View style={{ width: 44 }} /></View>
    <Surface style={{ gap: 12 }}><T weight="semibold" style={{ color: theme.accent, fontSize: 11, letterSpacing: 1.2 }}>AKTİF YÖNTEM</T><T weight="medium" style={{ fontSize: 25 }}>Türkiye yöntemi</T>
      <T style={{ color: theme.muted, lineHeight: 23 }}>Vakitler Adhan 4.4.6 Türkiye profiliyle, seçili koordinata göre cihazında hesaplanır. Resmî Diyanet verisi değildir.</T>
    </Surface>
    <T weight="semibold" style={[s.section, { color: theme.muted }]}>VAKİT DÜZELTMELERİ</T>
    <T style={{ color: theme.muted, lineHeight: 22, marginBottom: 14 }}>Yerel takvim farkları için her vakti −30 ile +30 dakika arasında değiştirebilirsin. Değişiklikler Home’a hemen uygulanır.</T>
    <Surface style={{ padding: 10, gap: 8 }}>{prayerIds.map((id) => <AdjustmentRow id={id} key={id} />)}</Surface>
    <View style={{ marginTop: 20 }}><Button secondary label="Tüm düzeltmeleri sıfırla" onPress={resetAdjustments} /></View>
  </Page>;
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }, section: { fontSize: 10, letterSpacing: 1.4, marginTop: 28, marginBottom: 8 },
  adjustment: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, borderRadius: 18, minHeight: 66, paddingHorizontal: 12, paddingVertical: 8 },
  prayer: { flexDirection: 'row', alignItems: 'center', gap: 9, flex: 1 }, stepper: { flexDirection: 'row', alignItems: 'center', borderRadius: 22 }, stepButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});

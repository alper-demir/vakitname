import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useAppState } from '@/services/app-state';
import { useTheme } from '@/ui/theme-context';
import { Icon, IconName } from '@/ui/icons';
import { IconButton, Page, Surface, T } from '@/ui/primitives';

function SettingsRow({ icon, title, detail, value, onPress }: { icon: IconName; title: string; detail: string; value?: string; onPress: () => void }) {
  const theme = useTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel={`${title}. ${detail}${value ? `. ${value}` : ''}`} onPress={onPress}
    style={({ pressed }) => [s.row, { opacity: pressed ? .65 : 1 }]}>
    <View style={[s.icon, { backgroundColor: theme.highlight }]}><Icon name={icon} color={theme.accent} size={20} /></View>
    <View style={{ flex: 1 }}><T weight="medium">{title}</T><T style={{ color: theme.muted, fontSize: 11, lineHeight: 18, marginTop: 3 }}>{detail}</T></View>
    {value ? <T style={{ color: theme.muted, fontSize: 11 }}>{value}</T> : null}<Icon name="arrow" color={theme.muted} size={16} />
  </Pressable>;
}

export default function SettingsScreen() {
  const theme = useTheme();
  const { location, preferences } = useAppState();
  const close = () => router.canGoBack() ? router.back() : router.replace('/');
  const adjusted = Object.values(preferences.adjustments).filter(Boolean).length;
  return <Page>
    <View style={s.header}><IconButton name="back" label="Geri" onPress={close} /><T accessibilityRole="header" weight="semibold" style={{ fontSize: 21 }}>Ayarlar</T><View style={{ width: 44 }} /></View>
    <T weight="medium" style={s.title}>Deneyimini sana göre düzenle.</T>
    <T style={[s.copy, { color: theme.muted }]}>Tüm tercihler yalnızca bu cihazda saklanır.</T>

    <T weight="semibold" style={[s.section, { color: theme.muted }]}>GÖRÜNÜM VE KONUM</T>
    <Surface style={s.card}>
      <SettingsRow icon="palette" title="Görünüm" detail="Mevsim, ışık ve Ramazan atmosferi" onPress={() => router.push('/appearance')} />
      <View style={[s.divider, { backgroundColor: theme.line }]} />
      <SettingsRow icon="pin" title="Konum" detail="GPS veya manuel şehir seçimi" value={location?.name ?? 'Seçilmedi'} onPress={() => router.push('/location')} />
    </Surface>

    <T weight="semibold" style={[s.section, { color: theme.muted }]}>HESAPLAMA VE TAKVİM</T>
    <Surface style={s.card}>
      <SettingsRow icon="clock" title="Vakit hesabı ve düzeltmeler" detail="Türkiye yöntemi ve vakit bazlı dakika ayarı" value={adjusted ? `${adjusted} düzeltme` : 'Standart'} onPress={() => router.push('/calculation')} />
      <View style={[s.divider, { backgroundColor: theme.line }]} />
      <SettingsRow icon="calendar" title="Hicri tarih" detail="Yerel takvim farkı için ±2 gün" value={preferences.hijriOffset ? `${preferences.hijriOffset > 0 ? '+' : ''}${preferences.hijriOffset} gün` : 'Standart'} onPress={() => router.push('/hijri')} />
    </Surface>

    <T weight="semibold" style={[s.section, { color: theme.muted }]}>UYGULAMA</T>
    <Surface style={s.card}>
      <SettingsRow icon="bell" title="Bildirimler" detail="Vakitler, ön hatırlatma ve ses" value={preferences.notifications.enabled ? 'Açık' : 'Kapalı'} onPress={() => router.push('/notifications')} />
      <View style={[s.divider, { backgroundColor: theme.line }]} />
      <View style={s.row}><View style={[s.icon, { backgroundColor: theme.highlight }]}><Icon name="language" color={theme.accent} size={20} /></View><View style={{ flex: 1 }}><T weight="medium">Dil</T><T style={{ color: theme.muted, fontSize: 11, marginTop: 3 }}>Uygulama dili</T></View><T style={{ color: theme.muted, fontSize: 12 }}>Türkçe</T></View>
    </Surface>
  </Page>;
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  title: { fontSize: 28, lineHeight: 37, letterSpacing: -.8 }, copy: { lineHeight: 23, marginTop: 8 },
  section: { fontSize: 10, letterSpacing: 1.5, marginTop: 30, marginBottom: 10, marginLeft: 4 }, card: { padding: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 72, paddingHorizontal: 10, paddingVertical: 10 },
  icon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, divider: { height: 1, marginLeft: 62 },
});

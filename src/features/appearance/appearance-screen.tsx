import React from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { useAppState } from '@/services/app-state';
import { defaultPreferences, ThemePreferences } from '@/domain/types';
import { useTheme } from '@/ui/theme-context';
import { Button, IconButton, Page, Surface, T } from '@/ui/primitives';
import { Icon } from '@/ui/icons';

export default function AppearanceScreen() {
  const { preferences, updateTheme } = useAppState();
  const theme = useTheme();
  const close = () => router.canGoBack() ? router.back() : router.replace('/');
  const group = <K extends keyof ThemePreferences>(title: string, key: K, options: { value: ThemePreferences[K]; label: string; detail?: string; color?: string }[]) => <View style={{ marginTop: 28 }}>
    <T weight="semibold" style={{ color: theme.muted, fontSize: 11, letterSpacing: 1.4, marginBottom: 12 }}>{title}</T>
    <Surface style={{ padding: 8 }}>{options.map((option) => {
      const selected = preferences.theme[key] === option.value;
      return <Pressable key={option.value} accessibilityRole="radio" accessibilityLabel={option.label} accessibilityState={{ checked: selected }} onPress={() => updateTheme({ [key]: option.value })} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, minHeight: 57, borderRadius: 18, backgroundColor: selected ? theme.highlight : 'transparent', opacity: pressed ? .7 : 1 })}>
        {option.color && <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: option.color }} />}
        <View style={{ flex: 1 }}><T weight={selected ? 'semibold' : 'regular'}>{option.label}</T>{option.detail && <T style={{ color: theme.muted, fontSize: 11, marginTop: 4, lineHeight: 18 }}>{option.detail}</T>}</View>
        {selected && <Icon name="check" size={18} color={theme.accent} />}
      </Pressable>;
    })}</Surface>
  </View>;
  return <Page footer={<Button label="Tamam" onPress={close} />}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}><IconButton name="close" label="Görünümü kapat" onPress={close} /><T weight="semibold" style={{ fontSize: 20 }}>Görünüm</T><View style={{ width: 44 }} /></View>
    <T accessibilityRole="header" weight="medium" style={{ fontSize: 30, letterSpacing: -1 }}>Işıkla birlikte değişsin.</T>
    <T style={{ color: theme.muted, lineHeight: 24, marginTop: 10 }}>Gökyüzünün ritmini izle ya da sana iyi gelen renklerde kal.</T>
    {group('MEVSİM', 'season', [
      { value: 'auto', label: 'Mevsime göre', detail: 'Bulunduğun günün mevsimi' },
      { value: 'spring', label: 'İlkbahar', color: '#AFC6AB' }, { value: 'summer', label: 'Yaz', color: '#E8D895' },
      { value: 'autumn', label: 'Sonbahar', color: '#C49D78' }, { value: 'winter', label: 'Kış', color: '#A5C5D7' },
    ])}
    {group('IŞIK', 'appearance', [
      { value: 'solar', label: 'Gün ışığına göre', detail: 'Güneş doğmadan 45 dk önce şafak; doğduktan 15 dk sonra gündüz. Batmadan 45 dk önce gün batımı; battıktan 30 dk sonra gece.' },
      { value: 'dawn', label: 'Şafak', detail: 'Yumuşak sabah tonlarında kal' },
      { value: 'day', label: 'Gündüz', detail: 'Aydınlık mevsim renklerinde kal' },
      { value: 'sunset', label: 'Gün batımı', detail: 'Mor ve sıcak akşam tonlarında kal' },
      { value: 'night', label: 'Gece', detail: 'Koyu mavi gece görünümünde kal' },
    ])}
    {group('RAMAZAN ATMOSFERİ', 'ramadan', [
      { value: 'auto', label: 'Ramazan’da otomatik', detail: 'Özel tema açılır; ana sayaç İmsak ve İftara kalan süreyi gösterir' },
      { value: 'on', label: 'Her zaman açık', detail: 'Özel temayı şimdi önizle; takvimi değiştirmez' },
      { value: 'off', label: 'Kapalı', detail: 'Ramazan ayında da normal görünümü kullan' },
    ])}
    <View style={{ marginTop: 24 }}><Button secondary label="Otomatik görünüme dön" onPress={() => updateTheme(defaultPreferences.theme)} /></View>
  </Page>;
}

import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Linking, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { District, districts, manualLocation, matchesSearch, Province, provinces } from '@/domain/locations';
import { useAppState } from '@/services/app-state';
import { tr } from '@/i18n/tr';
import { useTheme } from '@/ui/theme-context';
import { Button, IconButton, Page, Surface, T } from '@/ui/primitives';
import { Icon } from '@/ui/icons';

type Row = { key: string; province: Province; district?: District; title: string; subtitle: string };
const provinceMap = new Map(provinces.map((p) => [p.id, p]));
export default function LocationScreen() {
  const theme = useTheme();
  const app = useAppState();
  const [query, setQuery] = useState('');
  const [province, setProvince] = useState<Province | null>(null);
  const [selected, setSelected] = useState<Row | null>(null);
  useEffect(() => app.cancelLocation, [app.cancelLocation]);
  const close = () => router.canGoBack() ? router.back() : router.replace('/');
  const rows = useMemo<Row[]>(() => {
    if (province) {
      const result: Row[] = [{ key: province.id, province, title: `${province.name} il merkezi`, subtitle: 'Merkez koordinatları' }];
      for (const d of districts) if (d.provinceId === province.id) result.push({ key: d.id, province, district: d, title: d.name, subtitle: d.coordinateKind === 'representative' ? 'Yaklaşık temsil noktası' : province.name });
      return result.filter((r) => matchesSearch(r.title, query));
    }
    const result: Row[] = provinces.filter((p) => matchesSearch(p.name, query)).map((p) => ({ key: p.id, province: p, title: p.name, subtitle: 'İl ve ilçeleri' }));
    if (query.trim()) {
      for (const d of districts) if (matchesSearch(d.name, query)) { const p = provinceMap.get(d.provinceId)!; result.push({ key: d.id, province: p, district: d, title: d.name, subtitle: p.name }); }
    }
    return result;
  }, [province, query]);
  const commit = () => {
    if (!selected) return;
    app.selectLocation(manualLocation(selected.province, selected.district));
    close();
  };
  const footer = selected ? <Button icon="check" label={`${selected.title} seçimini onayla`} onPress={commit} /> : <T style={{ textAlign: 'center', color: theme.muted, fontSize: 11, paddingVertical: 10 }}>Türkiye’deki konumunu seç · İnternet gerekmez</T>;
  return <Page scroll={false} footer={footer}>
    <View style={s.header}><IconButton name="back" label={province ? 'İl listesine dön' : 'Geri'} onPress={() => { if (province) { setProvince(null); setQuery(''); setSelected(null); } else close(); }} /><T accessibilityRole="header" weight="semibold" style={{ fontSize: 20 }}>{province ? province.name : 'Konumunu seç'}</T><View style={{ width: 44 }} /></View>
    <View style={[s.search, { backgroundColor: theme.surface, borderColor: theme.line }]}><Icon name="pin" color={theme.muted} size={20} />
      <TextInput accessibilityRole="search" accessibilityLabel={province ? 'İlçe ara' : 'İl veya ilçe ara'} placeholder={province ? 'İlçe ara…' : 'İl veya ilçe ara…'} placeholderTextColor={theme.muted} value={query} onChangeText={setQuery} autoCorrect={false} returnKeyType="search" style={[s.input, { color: theme.text }]} />
      {query ? <Pressable accessibilityRole="button" accessibilityLabel="Aramayı temizle" onPress={() => setQuery('')} style={{ padding: 10 }}><Icon name="close" color={theme.muted} size={18} /></Pressable> : null}
    </View>
    <View style={{ marginBottom: 16 }}><Button secondary icon="gps" label={app.locating ? 'Konum aranıyor…' : 'Konumumu kullan'} loading={app.locating} onPress={() => { void app.requestLocation().then((success) => { if (success) close(); }); }} /></View>
    {app.locationError && <Surface style={{ padding: 14, marginBottom: 16 }}><T style={{ fontSize: 13, lineHeight: 21 }}>{tr.locationErrors[app.locationError] ?? tr.locationErrors.unavailable}</T>{(app.locationError === 'blocked' || app.locationError === 'disabled') && Platform.OS !== 'web' && <Pressable accessibilityRole="button" onPress={() => { void Linking.openSettings(); }} style={{ paddingVertical: 12 }}><T weight="semibold" style={{ color: theme.accent }}>Cihaz ayarlarını aç</T></Pressable>}</Surface>}
    <View style={s.section}><T weight="semibold" style={{ fontSize: 10, letterSpacing: 1.5, color: theme.muted }}>{province ? 'İLÇELER' : query ? 'ARAMA SONUÇLARI' : 'TÜRKİYE'}</T><T style={{ color: theme.muted, fontSize: 11 }}>{rows.length} kayıt</T></View>
    <FlatList data={rows} keyExtractor={(r) => r.key} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} initialNumToRender={15}
      contentContainerStyle={{ paddingBottom: 20 }}
      ListEmptyComponent={<View style={{ paddingVertical: 40, alignItems: 'center', gap: 12 }}><Icon name="pin" color={theme.muted} size={34} /><T weight="medium">Sonuç bulunamadı</T><T style={{ color: theme.muted, textAlign: 'center', lineHeight: 22 }}>Yazımı kontrol et veya il merkezini seç.</T>{province && <Button secondary label={`${province.name} il merkezini seç`} onPress={() => { setQuery(''); setSelected({ key: province.id, province, title: `${province.name} il merkezi`, subtitle: 'Merkez koordinatları' }); }} />}</View>}
      renderItem={({ item }) => {
        const active = item.key === selected?.key;
        return <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} accessibilityLabel={`${item.title}, ${item.subtitle}`} onPress={() => {
          app.cancelLocation();
          if (!province && !item.district) { setProvince(item.province); setQuery(''); setSelected(null); }
          else setSelected(item);
        }} style={({ pressed }) => [s.row, { backgroundColor: active ? theme.highlight : theme.surface, borderColor: active ? theme.accent : theme.line, opacity: pressed ? .75 : 1 }]}>
          <View style={[s.icon, { backgroundColor: theme.highlight }]}><Icon name={active ? 'check' : 'pin'} size={18} color={theme.accent} /></View>
          <View style={{ flex: 1 }}><T weight={active ? 'semibold' : 'medium'}>{item.title}</T><T style={{ fontSize: 11, color: theme.muted, marginTop: 4 }}>{item.subtitle}</T></View>
          {!province && !item.district ? <Icon name="arrow" color={theme.muted} size={17} /> : active ? <Icon name="check" color={theme.accent} size={17} /> : null}
        </Pressable>;
      }} />
  </Page>;
}
const s = StyleSheet.create({ header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }, search: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingLeft: 16, borderRadius: 18, marginBottom: 12 }, input: { minHeight: 54, flex: 1, fontFamily: 'Manrope_400Regular', fontSize: 14, paddingHorizontal: 10 }, section: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }, row: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderRadius: 20, gap: 12, marginBottom: 8, minHeight: 76 }, icon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' } });

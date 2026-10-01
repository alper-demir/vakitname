import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { DateTime } from 'luxon';
import { router } from 'expo-router';
import { buildMonthRows, buildRamadanRows, getRamadanRange, CalendarTableRow } from '@/domain/calendar-table';
import { addDays, formatDate, formatTime, localDateAt } from '@/domain/time';
import { prayerIds } from '@/domain/types';
import { tr } from '@/i18n/tr';
import { useAppState } from '@/services/app-state';
import { prayerProvider } from '@/services/prayer/adhan-provider';
import { useNow } from '@/ui/use-now';
import { useTheme } from '@/ui/theme-context';
import { Button, IconButton, Page, Surface, T } from '@/ui/primitives';
import { Icon } from '@/ui/icons';

type Mode = 'month' | 'ramadan';

function time(row: CalendarTableRow, id: (typeof prayerIds)[number]) {
  const event = row.prayerDay.events.find((item) => item.id === id);
  return event ? formatTime(event.at, row.prayerDay.timeZone) : '—';
}

function Table({ rows, theme, compact = false, selected, onSelect }: { rows: CalendarTableRow[]; theme: ReturnType<typeof useTheme>; compact?: boolean; selected: string; onSelect: (date: string) => void }) {
  const ids = compact ? (['imsak', 'aksam', 'yatsi'] as const) : prayerIds;
  const width = (ids.length + 2) * 82;
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ minWidth: width }}>
    <View style={{ minWidth: width }}>
      <View style={[s.tableHeader, { backgroundColor: theme.highlight }]}><T style={[s.cell, s.dateCell, { color: theme.muted }]}>TARİH</T>{ids.map((id) => <T key={id} style={[s.cell, { color: id === 'imsak' || id === 'aksam' ? theme.accent : theme.muted }]}>{tr.prayerNames[id].toUpperCase()}</T>)}</View>
      {rows.map((row) => {
        const selectedRow = row.localDate === selected;
        const date = DateTime.fromISO(row.localDate, { zone: row.prayerDay.timeZone, locale: 'tr' });
        return <Pressable key={row.localDate} accessibilityRole="button" accessibilityLabel={`${formatDate(row.localDate, true)} vakitleri`} onPress={() => onSelect(row.localDate)} style={[s.tableRow, { backgroundColor: selectedRow ? theme.highlight : theme.surfaceStrong, borderBottomColor: theme.line }]}>
          <View style={[s.cell, s.dateCell]}><T weight={selectedRow ? 'semibold' : 'regular'} style={{ color: selectedRow ? theme.accent : theme.text }}>{date.toFormat('d MMM')}</T><T style={{ color: theme.muted, fontSize: 10 }}>{date.toFormat('ccc')}{row.isToday ? ' · Bugün' : ''}</T></View>
          {ids.map((id) => <T key={id} weight={selectedRow ? 'semibold' : 'regular'} style={[s.cell, { color: id === 'imsak' || id === 'aksam' ? theme.accent : row.isToday ? theme.text : theme.muted }]}>{time(row, id)}</T>)}
        </Pressable>;
      })}
    </View>
  </ScrollView>;
}

export default function CalendarScreen() {
  const theme = useTheme();
  const now = useNow(60000);
  const { location, preferences } = useAppState();
  const today = location ? localDateAt(now, location.timeZone) : localDateAt(now);
  const [mode, setMode] = useState<Mode>('month');
  const [month, setMonth] = useState(today.slice(0, 7));
  const range = useMemo(() => getRamadanRange(today), [today]);
  const [selected, setSelected] = useState(today);
  const rows = useMemo(() => {
    if (!location) return [];
    try {
      return mode === 'ramadan' && range ? buildRamadanRows(range, location, preferences.adjustments, today, prayerProvider, preferences.hijriOffset) : buildMonthRows(month, location, preferences.adjustments, today, prayerProvider, preferences.hijriOffset);
    } catch { return []; }
  }, [location, preferences.adjustments, preferences.hijriOffset, mode, range, month, today]);
  const visibleSelected = rows.some((row) => row.localDate === selected) ? selected : rows[0]?.localDate ?? today;
  const selectedRow = rows.find((row) => row.localDate === visibleSelected) ?? rows[0];
  const close = () => router.canGoBack() ? router.back() : router.replace('/');
  const moveMonth = (amount: number) => {
    const next = DateTime.fromISO(`${month}-01`, { zone: location?.timeZone ?? 'Europe/Istanbul' }).plus({ months: amount }).toFormat('yyyy-MM');
    setMonth(next); setSelected(next === today.slice(0, 7) ? today : `${next}-01`);
  };
  const footer = <View style={[s.dock, { backgroundColor: theme.surface, borderColor: theme.line }]}>
    <Pressable accessibilityRole="button" accessibilityLabel="Bugün" onPress={() => router.replace('/')} style={s.dockItem}><Icon name="clock" color={theme.muted} /><T style={[s.dockText, { color: theme.muted }]}>Bugün</T></Pressable>
    <View accessibilityRole="tab" accessibilityState={{ selected: true }} style={s.dockItem}><Icon name="calendar" color={theme.accent} /><T weight="semibold" style={[s.dockText, { color: theme.accent }]}>Takvim</T></View>
    <Pressable accessibilityRole="button" accessibilityLabel="Kıble" onPress={() => router.replace('/qibla')} style={s.dockItem}><Icon name="compass" color={theme.muted} /><T style={[s.dockText, { color: theme.muted }]}>Kıble</T></Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Ayarlar" onPress={() => router.replace('/settings')} style={s.dockItem}><Icon name="settings" color={theme.muted} /><T style={[s.dockText, { color: theme.muted }]}>Ayarlar</T></Pressable>
  </View>;
  if (!location) return <Page footer={footer}><View style={s.header}><IconButton name="back" label="Geri" onPress={close} /><T accessibilityRole="header" weight="semibold" style={{ fontSize: 20 }}>Takvim</T><View style={{ width: 44 }} /></View><View style={s.empty}><Icon name="calendar" size={48} color={theme.accent} /><T weight="medium" style={{ fontSize: 22, textAlign: 'center' }}>Takvim için konum seç</T><T style={{ color: theme.muted, textAlign: 'center', lineHeight: 22 }}>Vakitleri aylık olarak görmek için önce bir il veya ilçe seçmelisin.</T><Button label="Konum seç" onPress={() => router.push('/location')} /></View></Page>;
  return <Page footer={footer}>
    <View style={s.header}><IconButton name="back" label="Geri" onPress={close} /><View style={{ alignItems: 'center' }}><T accessibilityRole="header" weight="semibold" style={{ fontSize: 20 }}>{mode === 'ramadan' ? 'Ramazan imsakiyesi' : 'Aylık takvim'}</T><T style={{ color: theme.muted, fontSize: 11, marginTop: 3 }}>{location.name}</T></View><IconButton name="calendar" label="Bugünün ayına dön" onPress={() => { setMode('month'); setMonth(today.slice(0, 7)); setSelected(today); }} /></View>
    <View style={[s.modeSwitch, { backgroundColor: theme.highlight }]}>{(['month', 'ramadan'] as const).map((value) => <Pressable key={value} accessibilityRole="radio" accessibilityState={{ checked: mode === value }} onPress={() => { setMode(value); if (value === 'ramadan' && range) setSelected(range.start); }} style={[s.modeButton, mode === value && { backgroundColor: theme.surfaceStrong }]}><T weight={mode === value ? 'semibold' : 'regular'} style={{ color: mode === value ? theme.accent : theme.muted }}>{value === 'month' ? 'Aylık görünüm' : 'Ramazan'}</T></Pressable>)}</View>
    {mode === 'month' ? <View style={[s.navigator, { backgroundColor: theme.surface }]}><IconButton name="back" label="Önceki ay" onPress={() => moveMonth(-1)} /><T weight="medium" style={{ fontSize: 17 }}>{DateTime.fromISO(`${month}-01`, { locale: 'tr' }).toFormat('LLLL yyyy')}</T><IconButton name="arrow" label="Sonraki ay" onPress={() => moveMonth(1)} /></View> : <Surface style={{ padding: 16, marginTop: 16, backgroundColor: theme.highlight }}><T weight="semibold" style={{ color: theme.accent, fontSize: 11, letterSpacing: 1 }}>{range ? `${range.hijriYear} HİCRİ · ${range.days} GÜN` : 'RAMAZAN'}</T><T weight="medium" style={{ fontSize: 22, marginTop: 8 }}>{range ? `${formatDate(range.start)} – ${formatDate(addDays(range.endExclusive, -1))}` : 'Ramazan dönemi bulunamadı'}</T></Surface>}
    {selectedRow && <Surface style={{ marginTop: 16, padding: 16 }}><View style={s.between}><View><T style={{ color: theme.muted, fontSize: 11 }}>{selectedRow.isToday ? 'BUGÜN' : 'SEÇİLİ GÜN'}</T><T weight="medium" style={{ fontSize: 21, marginTop: 6 }}>{formatDate(selectedRow.localDate, true)}</T><T style={{ color: theme.muted, fontSize: 12, marginTop: 4 }}>{selectedRow.hijri.label}</T></View><View style={s.dateBadge}><T weight="semibold" style={{ color: theme.accent, fontSize: 22 }}>{DateTime.fromISO(selectedRow.localDate, { locale: 'tr' }).toFormat('d')}</T><T style={{ color: theme.accent, fontSize: 10 }}>{DateTime.fromISO(selectedRow.localDate, { locale: 'tr' }).toFormat('LLL').toUpperCase()}</T></View></View><View style={s.quickTimes}><View><T style={{ color: theme.muted, fontSize: 10 }}>İMSAK</T><T weight="semibold" style={{ color: theme.accent, fontSize: 22, marginTop: 4 }}>{time(selectedRow, 'imsak')}</T></View><View style={s.divider} /><View><T style={{ color: theme.muted, fontSize: 10 }}>İFTAR</T><T weight="semibold" style={{ color: theme.accent, fontSize: 22, marginTop: 4 }}>{time(selectedRow, 'aksam')}</T></View></View></Surface>}
    <T weight="semibold" style={[s.section, { color: theme.muted }]}>{mode === 'ramadan' ? 'İMSAKİYE ÇİZELGESİ' : 'VAKİT ÇİZELGESİ'}</T>
    <Surface style={{ padding: 0, overflow: 'hidden' }}><Table rows={rows} theme={theme} compact={mode === 'ramadan'} selected={visibleSelected} onSelect={setSelected} /></Surface>
    <Surface style={{ marginTop: 16, padding: 16, backgroundColor: theme.highlight }}><T style={{ color: theme.muted, lineHeight: 21, fontSize: 12 }}>{mode === 'ramadan' ? 'Ramazan günleri seçili konumun cihazda hesaplanan İmsak ve Akşam vakitleriyle gösterilir. Bu tablo resmî Diyanet verisi iddiası taşımaz.' : 'Vakitler seçili konuma göre cihazda hesaplanır. Yatay kaydırarak tüm vakitleri görebilirsin.'}</T></Surface>
  </Page>;
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  modeSwitch: { flexDirection: 'row', padding: 4, borderRadius: 24, gap: 4 }, modeButton: { flex: 1, minHeight: 42, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  navigator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 22, marginTop: 16, paddingHorizontal: 8 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }, dateBadge: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#E7EEDFAA', alignItems: 'center', justifyContent: 'center' }, quickTimes: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#49694E16' }, divider: { width: 1, height: 35, backgroundColor: '#49694E22' }, section: { fontSize: 10, letterSpacing: 1.4, marginTop: 24, marginBottom: 8 }, tableHeader: { flexDirection: 'row', minHeight: 46, alignItems: 'center' }, tableRow: { flexDirection: 'row', minHeight: 64, alignItems: 'center', borderBottomWidth: 1 }, cell: { width: 82, paddingHorizontal: 8, textAlign: 'center', fontSize: 12, fontVariant: ['tabular-nums'] }, dateCell: { width: 104, textAlign: 'left' }, empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingBottom: 80 }, dock: { flexDirection: 'row', borderWidth: 1, borderRadius: 32, paddingVertical: 8 }, dockItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: 44 }, dockText: { fontSize: 9 },
});

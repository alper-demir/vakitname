import React, { useMemo, useState } from 'react';
import Constants from 'expo-constants';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { router } from 'expo-router';
import { prayerIds, ReminderMinutes } from '@/domain/types';
import { formatTime, localDateAt } from '@/domain/time';
import { prayerProvider } from '@/services/prayer/adhan-provider';
import { useAppState } from '@/services/app-state';
import { useNotifications } from '@/services/notifications/notification-context';
import { tr } from '@/i18n/tr';
import { useNow } from '@/ui/use-now';
import { useTheme } from '@/ui/theme-context';
import { Button, IconButton, Page, Surface, T } from '@/ui/primitives';
import { Icon } from '@/ui/icons';

const reminders: ReminderMinutes[] = [0, 15, 30, 45];
const permissionLabels = { undetermined: 'İzin bekleniyor', granted: 'İzin açık', denied: 'İzin kapalı', provisional: 'Geçici izin', unsupported: 'Desteklenmiyor' } as const;

export default function NotificationsScreen() {
  const theme = useTheme();
  const app = useAppState();
  const notifications = useNotifications();
  const now = useNow(60_000);
  const [testSent, setTestSent] = useState(false);
  const [simulationSent, setSimulationSent] = useState(false);
  const preferences = app.preferences.notifications;
  const exactStatus = notifications.exactSchedulingStatus;
  const exactLabel = exactStatus === 'not-required' ? 'Gerekli değil' : exactStatus === 'managed-by-system' ? 'Sistem ayarı' : 'Desteklenmiyor';
  const today = useMemo(() => app.location ? prayerProvider.getDay(localDateAt(now, app.location.timeZone), app.location, app.preferences.adjustments) : null,
    [app.location, app.preferences.adjustments, now]);
  const toggleMaster = async (value: boolean) => { if (value) await notifications.enable(); else notifications.disable(); };
  const togglePrayer = (id: (typeof prayerIds)[number], enabled: boolean) => app.updateNotifications({ prayerEnabled: { ...preferences.prayerEnabled, [id]: enabled } });
  const activeCount = prayerIds.filter((id) => preferences.prayerEnabled[id]).length;
  const close = () => router.canGoBack() ? router.back() : router.replace('/settings');
  return <Page>
    <View style={s.header}><IconButton name="back" label="Ayarlara dön" onPress={close} /><T accessibilityRole="header" weight="semibold" style={{ fontSize: 20 }}>Bildirimler</T><IconButton name="info" label="Bildirim yardımı" onPress={() => router.push('/notification-help')} /></View>
    <T weight="medium" style={s.title}>Vakitleri sakin bir hatırlatmayla karşıla.</T>
    <T style={[s.copy, { color: theme.muted }]}>Bildirimler cihazında planlanır; hesap ve internet gerekmez.</T>

    <Surface style={{ marginTop: 22 }}><View style={s.between}><View style={s.label}><View style={[s.icon, { backgroundColor: theme.highlight }]}><Icon name="bell" color={theme.accent} /></View><View style={{ flex: 1 }}><T weight="medium">Vakit bildirimleri</T><T style={{ color: theme.muted, fontSize: 11, marginTop: 4 }}>{permissionLabels[notifications.permission]} · {activeCount} vakit</T></View></View><Switch accessibilityLabel="Vakit bildirimleri" value={preferences.enabled} disabled={notifications.syncing || !app.location} onValueChange={(value) => { void toggleMaster(value); }} trackColor={{ false: theme.line, true: theme.accent }} thumbColor={theme.accent} /></View>
      {!app.location ? <T style={[s.notice, { color: theme.muted }]}>Bildirimleri açmak için önce konum seçmelisin.</T> : null}
      {notifications.error ? <View style={{ marginTop: 12, gap: 10 }}><T accessibilityLiveRegion="polite" style={s.error}>{notifications.error}</T><Button secondary loading={notifications.syncing} label="Planı yeniden dene" onPress={() => { void notifications.refresh(); }} /></View> : null}
    </Surface>

    <T weight="semibold" style={[s.section, { color: theme.muted }]}>BİLDİRİM ŞEKLİ</T>
    <Surface style={{ gap: 18 }}>
      <View style={s.between}><View style={{ flex: 1 }}><T weight="medium">Vakit girince bildir</T><T style={{ color: theme.muted, fontSize: 11, marginTop: 4 }}>Hesaplanan vakit saatinde</T></View><Switch accessibilityLabel="Vakit girince bildir" value={preferences.atPrayerTime} onValueChange={(atPrayerTime) => app.updateNotifications({ atPrayerTime })} trackColor={{ false: theme.line, true: theme.accent }} thumbColor={theme.accent} /></View>
      <View><View style={s.between}><T weight="medium">Önceden hatırlat</T><T style={{ color: theme.accent, fontSize: 11 }}>{preferences.reminderMinutes ? `${preferences.reminderMinutes} dakika önce` : 'Kapalı'}</T></View>
        <View style={[s.segments, { backgroundColor: theme.highlight }]}>{reminders.map((minutes) => { const selected = preferences.reminderMinutes === minutes; return <Pressable key={minutes} accessibilityRole="radio" accessibilityState={{ checked: selected }} accessibilityLabel={minutes ? `${minutes} dakika önce` : 'Ön hatırlatma kapalı'} onPress={() => app.updateNotifications({ reminderMinutes: minutes })} style={[s.segment, { backgroundColor: selected ? theme.highlight : 'transparent' }]}><T weight={selected ? 'semibold' : 'regular'} style={{ fontSize: 10, color: selected ? theme.accent : theme.muted }}>{minutes ? `${minutes} dk` : 'Kapalı'}</T></Pressable>; })}</View>
      </View>
      <View><T weight="medium">Bildirim sesi</T><View style={s.soundChoices}>{([
        ['vakit', 'Vakit tonu'], ['default', 'Sistem sesi'], ['silent', 'Sessiz'],
      ] as const).map(([sound, label]) => { const selected = preferences.sound === sound; return <Pressable key={sound} accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={() => app.updateNotifications({ sound })} style={[s.sound, { borderColor: selected ? theme.accent : theme.line, backgroundColor: selected ? theme.highlight : 'transparent' }]}><Icon name={sound === 'silent' ? 'close' : 'volume'} size={17} color={selected ? theme.accent : theme.muted} /><T style={{ fontSize: 10, color: selected ? theme.accent : theme.muted }}>{label}</T></Pressable>; })}</View></View>
    </Surface>

    <T weight="semibold" style={[s.section, { color: theme.muted }]}>VAKİTLER</T>
    <Surface style={{ padding: 8 }}>{prayerIds.map((id) => { const event = today?.events.find((item) => item.id === id); return <View key={id} style={[s.prayerRow, { borderBottomColor: theme.line }]}><View style={[s.prayerIcon, { backgroundColor: theme.highlight }]}><Icon name={id} size={20} color={preferences.prayerEnabled[id] ? theme.accent : theme.muted} /></View><View style={{ flex: 1 }}><T weight="medium">{tr.prayerNames[id]}</T><T style={{ color: theme.muted, fontSize: 11, marginTop: 3 }}>{event ? formatTime(event.at, today!.timeZone) : 'Konum gerekli'}{id === 'gunes' ? ' · varsayılan kapalı' : ''}</T></View><Switch accessibilityLabel={`${tr.prayerNames[id]} bildirimi`} value={preferences.prayerEnabled[id]} onValueChange={(value) => togglePrayer(id, value)} trackColor={{ false: theme.line, true: theme.accent }} thumbColor={theme.accent} /></View>; })}</Surface>

    <Surface style={{ marginTop: 20, gap: 10 }}><View style={s.label}><Icon name="info" color={theme.accent} /><View style={{ flex: 1 }}><T weight="medium">Planlama durumu</T><T style={{ color: theme.muted, fontSize: 11, lineHeight: 18, marginTop: 3 }}>{app.notificationSchedule.scheduledCount ? `${app.notificationSchedule.scheduledCount} gelecek bildirim cihazda planlandı.` : preferences.enabled ? 'Plan güncelleniyor veya sistem izni bekleniyor.' : 'Bildirimler kapalı.'}</T></View></View><T style={{ color: theme.subtle, fontSize: 10, lineHeight: 17 }}>Telefonun pil, sessiz mod ve bildirim ayarları teslim zamanını etkileyebilir.</T></Surface>
    <Surface style={{ marginTop: 12, gap: 11 }}><View style={s.between}><View style={{ flex: 1 }}><T weight="medium">Dakik zamanlama</T><T style={{ color: theme.muted, fontSize: 11, lineHeight: 18, marginTop: 4 }}>{exactStatus === 'not-required' ? 'Bu Android sürümünde ayrıca erişim vermen gerekmez.' : exactStatus === 'managed-by-system' ? 'Vakitlerin gecikmemesi için “Alarmlar ve hatırlatıcılar” erişimini sistem ekranından aç. Geri döndüğünde bildirim planı yenilenir.' : 'Bu platformda özel Android zamanlama ayarı kullanılmaz.'}</T></View><View style={[s.statusBadge, { backgroundColor: theme.highlight }]}><T weight="semibold" style={{ color: theme.accent, fontSize: 9 }}>{exactLabel}</T></View></View>{exactStatus === 'managed-by-system' ? <Button secondary loading={notifications.syncing} label="Sistem ayarını aç" onPress={() => { void notifications.requestExactScheduling(); }} /> : null}{Constants.appOwnership === 'expo' ? <T style={{ color: theme.subtle, fontSize: 10, lineHeight: 17 }}>Expo Go testinde sistem erişimi Expo Go adına görünür. Yüklü sürümde Vakit adına gösterilir.</T> : null}</Surface>
    <View style={{ marginTop: 18, gap: 10 }}><Button secondary loading={notifications.syncing} label={testSent ? 'Test bildirimi planlandı' : '3 saniye sonra ses testi'} onPress={() => { void notifications.sendTest().then(setTestSent); }} /><Button secondary disabled={!preferences.enabled || !app.location} loading={notifications.syncing} label={simulationSent ? 'Bildirim akışı planlandı' : 'Seçili akışı simüle et'} onPress={() => { void notifications.simulateCurrentFlow().then((count) => setSimulationSent(count > 0)); }} /><Button secondary label="Bildirim durumu ve yardım" onPress={() => router.push('/notification-help')} /></View>
  </Page>;
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }, title: { fontSize: 27, lineHeight: 36, letterSpacing: -.8 }, copy: { lineHeight: 23, marginTop: 8 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }, label: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }, icon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, notice: { fontSize: 11, lineHeight: 18, marginTop: 12 }, error: { color: '#B34B44', fontSize: 11, lineHeight: 18 },
  section: { fontSize: 10, letterSpacing: 1.5, marginTop: 28, marginBottom: 10, marginLeft: 4 }, segments: { flexDirection: 'row', borderRadius: 14, padding: 4, marginTop: 12 }, segment: { flex: 1, minHeight: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, soundChoices: { flexDirection: 'row', gap: 7, marginTop: 12 }, sound: { flex: 1, minHeight: 58, borderWidth: 1, borderRadius: 15, alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: 4 },
  statusBadge: { borderRadius: 14, paddingHorizontal: 9, paddingVertical: 6 },
  prayerRow: { flexDirection: 'row', alignItems: 'center', gap: 11, minHeight: 68, paddingHorizontal: 9, borderBottomWidth: StyleSheet.hairlineWidth }, prayerIcon: { width: 39, height: 39, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});

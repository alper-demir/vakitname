import React, { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { localDateAt, formatDate, formatTime } from '@/domain/time';
import { useAppState } from '@/services/app-state';
import { useNotifications } from '@/services/notifications/notification-context';
import { useTheme } from '@/ui/theme-context';
import { Button, IconButton, Page, Surface, T } from '@/ui/primitives';
import { Icon } from '@/ui/icons';

export default function NotificationHelpScreen() {
  const theme = useTheme();
  const app = useAppState();
  const notifications = useNotifications();
  const [testSent, setTestSent] = useState(false);
  const through = app.notificationSchedule.scheduledThrough;
  const background = { registered: 'Planlandı', disabled: 'Kapalı', unavailable: 'Kullanılamıyor', error: 'Yeniden dene' }[notifications.backgroundRefreshStatus];
  const permission = notifications.permission === 'granted' ? 'Açık' : notifications.permission === 'provisional' ? 'Geçici izin' : notifications.permission === 'denied' ? 'Kapalı' : notifications.permission === 'unsupported' ? 'Desteklenmiyor' : 'Henüz sorulmadı';
  const exact = notifications.exactSchedulingStatus === 'not-required' ? 'Gerekli değil' : notifications.exactSchedulingStatus === 'managed-by-system' ? 'Sistem ayarı' : 'Desteklenmiyor';
  const close = () => router.canGoBack() ? router.back() : router.replace('/notifications');
  return <Page>
    <View style={s.header}><IconButton name="back" label="Bildirimlere dön" onPress={close} /><T accessibilityRole="header" weight="semibold" style={{ fontSize: 20 }}>Bildirim durumu</T><View style={{ width: 44 }} /></View>
    <Surface style={{ gap: 13 }}><View style={s.row}><View style={[s.icon, { backgroundColor: theme.highlight }]}><Icon name="bell" color={theme.accent} /></View><View style={{ flex: 1 }}><T weight="medium">Cihazdaki plan</T><T style={{ color: theme.muted, fontSize: 11, lineHeight: 18, marginTop: 4 }}>{app.notificationSchedule.scheduledCount} bekleyen Vakitname bildirimi</T></View></View>
      {through ? <T style={{ color: theme.muted, fontSize: 12 }}>Şu tarihe kadar planlandı: {formatDate(localDateAt(through))} · {formatTime(through)}</T> : null}
    </Surface>

    <T weight="semibold" style={[s.section, { color: theme.muted }]}>CİHAZ KONTROLLERİ</T>
    <Surface style={s.card}><StatusRow title="Sistem bildirim izni" value={permission} detail="Bildirimlerin gösterilebilmesi için işletim sistemi izni gerekir." /><Divider color={theme.line} /><StatusRow title="Dakik zamanlama" value={exact} detail="Android'in Alarmlar ve hatırlatıcılar erişimi açıksa vakit kayıtları kesin zamanlamayla kurulur; kapalıysa sistem geciktirebilir." /><Divider color={theme.line} /><StatusRow title="Ses ve sessiz mod" value="Cihaz ayarı" detail="Sessiz mod, Focus/Rahatsız Etmeyin ve Android kanal ayarları sesi engelleyebilir." /><Divider color={theme.line} /><StatusRow title="Pil yönetimi" value="Üreticiye bağlı" detail="Bazı Android üreticileri arka plan bildirim davranışını ek olarak kısıtlayabilir." /></Surface>

    <Surface style={{ marginTop: 20 }}><StatusRow title="Otomatik plan yenileme" value={background} detail={notifications.backgroundRefreshStatus === 'unavailable' ? 'Bu ortamda arka plan yenilemesi kullanılamıyor. Expo Go testinde plan uygulama açıldığında yenilenir.' : notifications.backgroundRefreshStatus === 'error' ? 'Otomatik yenileme kaydedilemedi. Planı şimdi yenile düğmesiyle yeniden deneyebilirsin; mevcut bildirimler korunur.' : notifications.backgroundRefreshStatus === 'disabled' ? 'Etkin vakit bildirimi ve kayıtlı konum olduğunda otomatik yenileme planlanır.' : 'Yaklaşık günde bir, kayıtlı konumunla 15 günlük plan tamamlanır. GPS açılmaz. Yenileme için sistem uygun pil koşulları ve ağ bağlantısı bekler; hazır bildirimler internetsiz gelir.'} /></Surface>
    <Surface style={{ marginTop: 20, gap: 10 }}><T weight="medium">Teslim hakkında</T><T style={{ color: theme.muted, lineHeight: 22, fontSize: 12 }}>Vakitname bildirimleri önceden cihazda planlar. Uygulama açıldığında plan yenilenir; otomatik yenileme kullanılabiliyorsa arka planda da tamamlanır. Uzun süre çevrimdışı kalma, pil kısıtlamaları veya uygulamayı sistem ayarlarından zorla durdurma yenilemeyi engelleyebilir. Böyle bir durumda uygulamayı açarak planı yenileyebilirsin.</T></Surface>
    <View style={{ gap: 10, marginTop: 20 }}><Button loading={notifications.syncing} label={testSent ? 'Test bildirimi planlandı' : '3 saniye sonra test bildirimi'} onPress={() => { void notifications.sendTest().then(setTestSent); }} />{notifications.exactSchedulingStatus === 'managed-by-system' ? <Button secondary loading={notifications.syncing} label="Dakik zamanlama ayarını aç" onPress={() => { void notifications.requestExactScheduling(); }} /> : null}<Button secondary label="Sistem bildirim ayarlarını aç" onPress={() => { void Linking.openSettings(); }} /><Button secondary label="Planı şimdi yenile" onPress={() => { void notifications.refresh(); }} /></View>
    {notifications.error ? <T accessibilityLiveRegion="polite" style={s.error}>{notifications.error}</T> : null}
  </Page>;
}

function StatusRow({ title, value, detail }: { title: string; value: string; detail: string }) {
  const theme = useTheme();
  return <View style={s.status}><View style={{ flex: 1 }}><T weight="medium">{title}</T><T style={{ color: theme.muted, fontSize: 11, lineHeight: 18, marginTop: 4 }}>{detail}</T></View><View style={[s.badge, { backgroundColor: theme.highlight }]}><T weight="semibold" style={{ color: theme.accent, fontSize: 9 }}>{value}</T></View></View>;
}
function Divider({ color }: { color: string }) { return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: color }} />; }
const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }, section: { fontSize: 10, letterSpacing: 1.5, marginTop: 28, marginBottom: 10, marginLeft: 4 }, row: { flexDirection: 'row', alignItems: 'center', gap: 12 }, icon: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }, card: { padding: 10 }, status: { minHeight: 88, flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12 }, badge: { borderRadius: 14, paddingHorizontal: 9, paddingVertical: 6 }, error: { color: '#B34B44', fontSize: 11, lineHeight: 18, marginTop: 14 },
});

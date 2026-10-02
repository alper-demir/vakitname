import React from 'react';
import { Image, Linking, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { IconButton, Page, Surface, T } from '@/ui/primitives';
import { Icon } from '@/ui/icons';
import { useTheme } from '@/ui/theme-context';

function LinkRow({ label, url }: { label: string; url: string }) {
  const theme = useTheme();
  return <View style={s.linkRow}><T style={{ flex: 1, color: theme.muted, fontSize: 12, lineHeight: 20 }}>{label}</T><IconButton name="arrow" label={`${label} bağlantısını aç`} onPress={() => { void Linking.openURL(url); }} /></View>;
}

export default function AboutScreen() {
  const theme = useTheme();
  const close = () => router.canGoBack() ? router.back() : router.replace('/settings');
  const version = Constants.expoConfig?.version ?? '0.2.0';
  return <Page>
    <View style={s.header}><IconButton name="back" label="Ayarlara dön" onPress={close} /><T accessibilityRole="header" weight="semibold" style={{ fontSize: 20 }}>Hakkında</T><View style={{ width: 44 }} /></View>
    <View style={s.brand}><Image source={require('../../../assets/icon/vakit-icon.png')} accessibilityLabel="Vakit uygulama ikonu" style={{ width: 82, height: 82, borderRadius: 24 }} /><T weight="semibold" style={s.name}>Vakit</T><T style={{ color: theme.muted, fontSize: 12 }}>Sade, cihazında çalışan namaz vakitleri</T><T style={{ color: theme.subtle, fontSize: 11 }}>Sürüm {version}</T></View>
    <T weight="semibold" style={[s.section, { color: theme.muted }]}>GİZLİLİK</T>
    <Surface style={s.card}><T weight="medium">Verilerin nerede tutulur?</T><T style={[s.copy, { color: theme.muted }]}>Konum, tercihler ve bildirim planı yalnızca bu cihazda saklanır. Hesap açılmaz; reklam, analiz veya uzaktan hata izleme hizmeti kullanılmaz. Uygulama kişisel verileri geliştiriciye ya da başka bir kuruluşa göndermez.</T><T style={[s.copy, { color: theme.muted }]}>Namaz vakitleri ve kıble yönü cihazda hesaplanır. GPS kullanırsan konum işletim sisteminden alınır; manuel şehir seçimiyle GPS kullanmadan da devam edebilirsin. Canlı pusula başlığı kaydedilmez.</T><T style={[s.copy, { color: theme.muted }]}>Yerel kayıtları Android ayarlarından uygulama verilerini temizleyerek veya uygulamayı kaldırarak silebilirsin. Konum ve bildirim izinlerini cihaz ayarlarından dilediğin zaman geri alabilirsin.</T><LinkRow label="Gizlilik soruları için e-posta" url="mailto:support.alemdem@gmail.com?subject=Vakit%20gizlilik%20sorusu" /></Surface>
    <T weight="semibold" style={[s.section, { color: theme.muted }]}>KAYNAKLAR</T>
    <Surface style={s.card}><T weight="medium">Hesaplama ve katalog</T><T style={[s.copy, { color: theme.muted }]}>Vakit hesabında Adhan JS Türkiye yöntemi, şehir/ilçe kataloğunda GeoNames verisi kullanılır. Bu sonuçlar resmî Diyanet tablosu değildir; farklar için vakit bazlı düzeltme yapılabilir.</T><LinkRow label="Adhan JS kaynak sayfası" url="https://github.com/batoulapps/adhan-js" /><LinkRow label="GeoNames lisans bilgisi" url="https://creativecommons.org/licenses/by/4.0/" /><LinkRow label="Kâbe referans noktası" url="https://www.openstreetmap.org/?mlat=21.422487&mlon=39.826206#map=18/21.422487/39.826206" /></Surface>
    <T weight="semibold" style={[s.section, { color: theme.muted }]}>LİSANSLAR</T>
    <Surface style={s.card}><T style={[s.copy, { color: theme.muted, marginTop: 0 }]}>Manrope yazı tipi SIL Open Font License 1.1, Adhan JS MIT lisansı ve GeoNames CC BY 4.0 koşullarıyla kullanılır. Uygulamadaki bildirim tonu proje içinde üretilmiş kısa bir sestir.</T><T style={{ color: theme.subtle, fontSize: 11, lineHeight: 18, marginTop: 12 }}>Lisans metinleri uygulama paketindeki assets/licenses klasöründe tutulur.</T></Surface>
    <View style={s.footerNote}><Icon name="check" color={theme.accent} size={16} /><T style={{ color: theme.muted, fontSize: 11 }}>Vakit hesabı çevrimdışı çalışmak üzere tasarlanmıştır.</T></View>
  </Page>;
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  brand: { alignItems: 'center', gap: 8, paddingVertical: 16 }, name: { fontSize: 26, letterSpacing: -0.8 },
  section: { fontSize: 10, letterSpacing: 1.5, marginTop: 24, marginBottom: 10, marginLeft: 4 }, card: { padding: 18, gap: 10 }, copy: { fontSize: 12, lineHeight: 21, marginTop: 8 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#49694E22' }, footerNote: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', paddingVertical: 24 },
});

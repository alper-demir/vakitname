import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useAppState } from '@/services/app-state';
import { useTheme } from '@/ui/theme-context';
import { Button, Page, Surface, T } from '@/ui/primitives';
import { Icon, Logo } from '@/ui/icons';

function Steps({ current }: { current: number }) {
  const theme = useTheme();
  return <View accessibilityLabel={`Adım ${current + 1} / 3`} style={s.steps}>{[0, 1, 2].map((step) => <View key={step} style={[s.step, { width: current === step ? 24 : 7, backgroundColor: current === step ? theme.accent : theme.line }]} />)}</View>;
}

export default function OnboardingScreen() {
  const theme = useTheme();
  const app = useAppState();
  const [step, setStep] = useState(0);
  const currentStep = step === 1 && app.location ? 2 : step;
  const finish = () => app.completeOnboarding();
  const top = <View style={s.top}><Steps current={currentStep} />{currentStep > 0 ? <Pressable accessibilityRole="button" accessibilityLabel="Onboarding adımını atla" onPress={() => currentStep === 1 ? setStep(2) : finish()} style={s.skip}><T style={{ color: theme.muted, fontSize: 12 }}>Atla</T></Pressable> : <View style={{ width: 44 }} />}</View>;

  if (currentStep === 0) return <Page scroll={false}>{top}<View style={s.center}>
    <View style={[s.logoCard, { backgroundColor: theme.surfaceStrong }]}><Logo size={72} color={theme.accent} /></View>
    <T accessibilityRole="header" weight="medium" style={s.hero}>Vakitname</T><T style={[s.tagline, { color: theme.muted }]}>“Vaktin nefesini hisset.”</T>
    <View style={[s.pill, { backgroundColor: theme.highlight }]}><Icon name="clock" size={16} color={theme.accent} /><T style={{ color: theme.muted, fontSize: 12 }}>Sade, sakin ve çevrimdışı namaz vakitleri</T></View>
  </View><View style={s.actions}><Button label="Başla" icon="arrow" onPress={() => setStep(1)} /><T style={[s.assurance, { color: theme.muted }]}>Hesapsız · reklamsız · verilerin yalnızca cihazında</T></View></Page>;

  if (currentStep === 1) return <Page scroll={false}>{top}<View style={s.center}>
    <View style={[s.orbit, { borderColor: theme.line, backgroundColor: theme.highlight }]}><View style={[s.pinCircle, { backgroundColor: theme.surfaceStrong }]}><Icon name="pin" size={36} color={theme.accent} /></View></View>
    <T accessibilityRole="header" weight="medium" style={s.title}>Doğru vakitler için konum</T>
    <T style={[s.copy, { color: theme.muted }]}>Bulunduğun yerin koordinatlarına göre vakitleri cihazında hesaplarız. Konumunu paylaşmak istemezsen şehir seçebilirsin.</T>
    {app.locationError ? <Surface style={{ padding: 14, width: '100%' }}><T style={{ color: theme.muted, lineHeight: 21 }}>Konum alınamadı. Şehir seçerek devam edebilirsin.</T></Surface> : null}
  </View><View style={s.actions}><Button icon="gps" label={app.locating ? 'Konum aranıyor…' : 'Konumumu kullan'} loading={app.locating} onPress={() => { void app.requestLocation().then((success) => { if (success) setStep(2); }); }} /><Button secondary icon="pin" label="Şehir seç" onPress={() => router.push('/location')} /></View></Page>;

  return <Page scroll={false}>{top}<View style={s.center}>
    <View style={[s.notification, { backgroundColor: theme.surfaceStrong, borderColor: theme.line }]}><View style={s.notificationTop}><Logo size={34} color={theme.accent} /><View style={{ flex: 1 }}><T weight="semibold" style={{ fontSize: 11 }}>VAKİTNAME</T><T style={{ color: theme.muted, fontSize: 10 }}>Örnek bildirim</T></View><Icon name="clock" color={theme.accent} /></View><T weight="semibold" style={{ marginTop: 16 }}>Öğle vakti girdi</T><T style={{ color: theme.muted, fontSize: 12, lineHeight: 19, marginTop: 5 }}>Seçtiğin vakitlerde kısa ve sakin bir bildirim alabilirsin.</T></View>
    <T accessibilityRole="header" weight="medium" style={s.title}>Vakitleri kaçırma</T>
    <T style={[s.copy, { color: theme.muted }]}>Bildirimler kullanıma açıldığında seçtiğin vakitler için cihazında planlanacak. İnternet veya hesap gerekmeyecek.</T>
  </View><View style={s.actions}><Button label="Vakitname’yi kullanmaya başla" onPress={finish} /><T style={[s.assurance, { color: theme.muted }]}>Bildirim izni yalnızca bildirimler etkinleştirildiğinde istenecek.</T></View></Page>;
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 44 }, steps: { flexDirection: 'row', gap: 6, alignItems: 'center' }, step: { height: 7, borderRadius: 4 }, skip: { minWidth: 44, minHeight: 44, alignItems: 'flex-end', justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14 }, actions: { gap: 11, paddingBottom: 8 }, logoCard: { borderRadius: 28, padding: 18 }, hero: { fontSize: 36, letterSpacing: -1.2 }, tagline: { fontStyle: 'italic', fontSize: 16 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9, marginTop: 10 }, assurance: { textAlign: 'center', fontSize: 10, lineHeight: 17, marginTop: 2 },
  orbit: { width: 190, height: 190, borderWidth: 1, borderRadius: 95, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }, pinCircle: { width: 82, height: 82, borderRadius: 41, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 29, lineHeight: 38, textAlign: 'center', letterSpacing: -.8 }, copy: { textAlign: 'center', lineHeight: 24, maxWidth: 340 }, notification: { width: '100%', maxWidth: 360, borderWidth: 1, borderRadius: 25, padding: 18, marginBottom: 15 }, notificationTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});

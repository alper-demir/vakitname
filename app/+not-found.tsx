import { router } from 'expo-router';
import { Page, T, Button } from '@/ui/primitives';
export default function NotFound() {
  return <Page><T style={{ fontSize: 28, marginVertical: 40 }}>Bu sayfa bulunamadı.</T><Button label="Bugüne dön" onPress={() => router.replace('/')} /></Page>;
}

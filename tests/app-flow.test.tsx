import React, { useState } from 'react';
import { AppState, Pressable, Text } from 'react-native';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { AppStateProvider, useAppState } from '@/services/app-state';
import { ThemeProvider } from '@/ui/theme-context';
import HomeScreen from '@/features/home/home-screen';
import LocationScreen from '@/features/location/location-screen';
import CalculationScreen from '@/features/settings/calculation-screen';
import HijriScreen from '@/features/settings/hijri-screen';
import OnboardingScreen from '@/features/onboarding/onboarding-screen';
import AppearanceScreen from '@/features/appearance/appearance-screen';
import { persistence } from '@/services/storage';
import { locateDevice } from '@/services/location';
import { initialSavedState } from '@/domain/state';
import { gpsLocation, manualLocation, provinces } from '@/domain/locations';

jest.mock('@/services/storage', () => ({ persistence: { read: jest.fn(), write: jest.fn() } }));
jest.mock('@/services/location', () => ({ locateDevice: jest.fn() }));
let mockNow = Date.parse('2026-09-30T14:00:00+03:00');
jest.mock('@/ui/use-now', () => ({ useNow: () => mockNow }));
const mockNavigate = jest.fn();
jest.mock('expo-router', () => ({ router: { push: (path: string) => mockNavigate(path), back: () => mockNavigate('/'), replace: (path: string) => mockNavigate(path), canGoBack: () => true } }));
const istanbul = manualLocation(provinces.find((p) => p.name === 'İstanbul')!);
const ankara = manualLocation(provinces.find((p) => p.name === 'Ankara')!);
function App() {
  const [route, setRoute] = useState('/');
  mockNavigate.mockImplementation(setRoute);
  return <AppStateProvider><ThemeProvider>{route === '/location' ? <LocationScreen /> : <HomeScreen />}</ThemeProvider></AppStateProvider>;
}
function Probe() {
  const state = useAppState();
  return <><Text>{state.ready ? state.location?.name ?? 'empty' : 'loading'}</Text>
    <Text>{state.savingError ? 'storage-error' : 'storage-ok'}</Text>
    <Pressable accessibilityRole="button" accessibilityLabel="gps" onPress={() => { void state.requestLocation(); }} />
    <Pressable accessibilityRole="button" accessibilityLabel="manual" onPress={() => state.selectLocation(ankara)} /></>;
}
beforeEach(() => {
  mockNow = Date.parse('2026-09-30T14:00:00+03:00');
  jest.mocked(persistence.read).mockResolvedValue(null);
  jest.mocked(persistence.write).mockResolvedValue(undefined);
});
test('denied GPS → offline manual city → real Home → persisted relaunch', async () => {
  jest.mocked(locateDevice).mockRejectedValue(new Error('denied'));
  const app = await render(<App />);
  await fireEvent.press(screen.getByRole('button', { name: 'Konumumu kullan' }));
  expect(screen.getByText(/Konum izni/)).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Şehir veya ilçe seç' }));
  expect(screen.getByText('81 il')).toBeTruthy();
  await fireEvent.changeText(screen.getByLabelText('İl veya ilçe ara'), 'istanbul');
  await fireEvent.press(screen.getByRole('button', { name: 'İstanbul, İl ve ilçeleri' }));
  await fireEvent.press(screen.getByRole('button', { name: 'İstanbul il merkezi, Merkez koordinatları' }));
  await fireEvent.press(screen.getByRole('button', { name: 'İstanbul il merkezi seçimini onayla' }));
  expect(screen.getByText('Günün vakitleri')).toBeTruthy();
  expect(screen.getByLabelText(/İkindi, .*sıradaki vakit/)).toBeTruthy();
  const saved = jest.mocked(persistence.write).mock.calls.at(-1)![0];
  await app.unmount();
  jest.mocked(persistence.read).mockResolvedValue(saved);
  await render(<App />);
  expect(screen.getByText('Günün vakitleri')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'İstanbul, konumu değiştir' })).toBeTruthy();
});
test('a late GPS response cannot overwrite a newer manual selection', async () => {
  let resolveGps!: (location: typeof istanbul) => void;
  jest.mocked(locateDevice).mockReturnValue(new Promise((resolve) => { resolveGps = resolve; }));
  await render(<AppStateProvider><Probe /></AppStateProvider>);
  await fireEvent.press(screen.getByRole('button', { name: 'gps' }));
  await fireEvent.press(screen.getByRole('button', { name: 'manual' }));
  await act(async () => resolveGps(istanbul));
  expect(screen.getByText('Ankara')).toBeTruthy();
  expect(JSON.parse(jest.mocked(persistence.write).mock.calls.at(-1)![0]).location.name).toBe('Ankara');
});
test('failed hydration does not overwrite unread persisted data with defaults', async () => {
  jest.mocked(persistence.read).mockRejectedValue(new Error('disk unavailable'));
  await render(<AppStateProvider><Probe /></AppStateProvider>);
  expect(screen.getByText('storage-error')).toBeTruthy();
  expect(persistence.write).not.toHaveBeenCalled();
});
test('failed GPS refresh preserves the last valid location', async () => {
  jest.mocked(persistence.read).mockResolvedValue(JSON.stringify({ ...initialSavedState, location: istanbul }));
  jest.mocked(locateDevice).mockRejectedValue(new Error('timeout'));
  await render(<AppStateProvider><Probe /></AppStateProvider>);
  await fireEvent.press(screen.getByRole('button', { name: 'gps' }));
  expect(screen.getByText('İstanbul')).toBeTruthy();
});
test('persisted GPS location refreshes on cold start without asking permission again', async () => {
  const previous = gpsLocation(41.01, 28.95, 40, 100);
  const refreshed = gpsLocation(39.92, 32.85, 35, 200);
  jest.mocked(persistence.read).mockResolvedValue(JSON.stringify({ ...initialSavedState, location: previous }));
  jest.mocked(locateDevice).mockResolvedValue(refreshed);
  await render(<AppStateProvider><Probe /></AppStateProvider>);
  await waitFor(() => expect(screen.getByText('Çankaya')).toBeTruthy());
  expect(locateDevice).toHaveBeenCalledWith({ requestPermission: false });
  expect(JSON.parse(jest.mocked(persistence.write).mock.calls.at(-1)![0]).location.updatedAt).toBe(200);
});
test('failed cold-start GPS refresh keeps the persisted location', async () => {
  const previous = gpsLocation(41.01, 28.95, 40, 100);
  jest.mocked(persistence.read).mockResolvedValue(JSON.stringify({ ...initialSavedState, location: previous }));
  jest.mocked(locateDevice).mockRejectedValue(new Error('timeout'));
  await render(<AppStateProvider><Probe /></AppStateProvider>);
  await waitFor(() => expect(locateDevice).toHaveBeenCalledWith({ requestPermission: false }));
  expect(screen.getByText(previous.name)).toBeTruthy();
});
test('GPS location refreshes after returning to foreground without prompting again', async () => {
  let listener: ((state: 'active' | 'background' | 'inactive') => void) | undefined;
  const addListener = jest.spyOn(AppState, 'addEventListener').mockImplementation((type, callback) => {
    if (type === 'change') listener = callback;
    return { remove: jest.fn() };
  });
  const previous = gpsLocation(41.01, 28.95, 40, 100);
  const refreshed = gpsLocation(39.92, 32.85, 35, 200);
  jest.mocked(persistence.read).mockResolvedValue(JSON.stringify({ ...initialSavedState, location: previous }));
  jest.mocked(locateDevice).mockResolvedValue(refreshed);
  const app = await render(<AppStateProvider><Probe /></AppStateProvider>);
  await act(async () => {
    listener?.('background');
    listener?.('active');
  });
  expect(screen.getByText('Çankaya')).toBeTruthy();
  expect(locateDevice).toHaveBeenCalledWith({ requestPermission: false });
  expect(JSON.parse(jest.mocked(persistence.write).mock.calls.at(-1)![0]).location.updatedAt).toBe(200);
  addListener.mockRestore();
  await app.unmount();
});
test('prayer and Hijri corrections update persisted preferences', async () => {
  const calculation = await render(<AppStateProvider><ThemeProvider><CalculationScreen /></ThemeProvider></AppStateProvider>);
  await fireEvent.press(screen.getByRole('button', { name: 'İmsak düzeltmesini artır' }));
  expect(screen.getByText('+1 dk')).toBeTruthy();
  expect(JSON.parse(jest.mocked(persistence.write).mock.calls.at(-1)![0]).preferences.adjustments.imsak).toBe(1);
  await calculation.unmount();

  jest.mocked(persistence.read).mockResolvedValue(JSON.stringify(initialSavedState));
  const hijri = await render(<AppStateProvider><ThemeProvider><HijriScreen /></ThemeProvider></AppStateProvider>);
  await fireEvent.press(screen.getByRole('button', { name: 'Hicri günü artır' }));
  expect(screen.getByText('+1 gün')).toBeTruthy();
  expect(JSON.parse(jest.mocked(persistence.write).mock.calls.at(-1)![0]).preferences.hijriOffset).toBe(1);
  await hijri.unmount();
});
test.each([
  ['2026-02-18T20:00:00+03:00', 'İMSAKA KALAN SÜRE'],
  ['2026-02-19T12:00:00+03:00', 'İFTARA KALAN SÜRE'],
])('Ramadan Home at %s focuses the countdown on fasting milestones', async (instant, expectedLabel) => {
  mockNow = Date.parse(instant);
  jest.mocked(persistence.read).mockResolvedValue(JSON.stringify({ ...initialSavedState, location: istanbul }));
  await render(<AppStateProvider><ThemeProvider><HomeScreen /></ThemeProvider></AppStateProvider>);
  expect(screen.getByText(expectedLabel)).toBeTruthy();
  expect(screen.getByText(/SAHUR · İMSAK/)).toBeTruthy();
  expect(screen.getByText(/İFTAR · AKŞAM/)).toBeTruthy();
});
test('manual sunset appearance persists and overrides the current daylight phase', async () => {
  jest.mocked(persistence.read).mockResolvedValue(JSON.stringify({ ...initialSavedState, location: istanbul }));
  const appearance = await render(<AppStateProvider><ThemeProvider><AppearanceScreen /></ThemeProvider></AppStateProvider>);
  expect(screen.queryByRole('radio', { name: 'Cihaz teması' })).toBeNull();
  expect(screen.queryByRole('radio', { name: 'Her zaman aydınlık' })).toBeNull();
  expect(screen.queryByRole('radio', { name: 'Her zaman karanlık' })).toBeNull();
  await fireEvent.press(screen.getByRole('radio', { name: 'Gün batımı' }));
  const saved = jest.mocked(persistence.write).mock.calls.at(-1)![0];
  expect(JSON.parse(saved).preferences.theme.appearance).toBe('sunset');
  await appearance.unmount();

  jest.mocked(persistence.read).mockResolvedValue(saved);
  await render(<AppStateProvider><ThemeProvider><HomeScreen /></ThemeProvider></AppStateProvider>);
  expect(screen.getByText('Sonbahar · Gün batımı')).toBeTruthy();
});
test('onboarding can finish without location and persists completion', async () => {
  function OnboardingApp() {
    const state = useAppState();
    return <ThemeProvider>{state.onboardingComplete ? <Text>onboarding-complete</Text> : <OnboardingScreen />}</ThemeProvider>;
  }
  await render(<AppStateProvider><OnboardingApp /></AppStateProvider>);
  await fireEvent.press(screen.getByRole('button', { name: 'Başla' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Onboarding adımını atla' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Vakit’i kullanmaya başla' }));
  expect(screen.getByText('onboarding-complete')).toBeTruthy();
  expect(JSON.parse(jest.mocked(persistence.write).mock.calls.at(-1)![0]).onboardingComplete).toBe(true);
});

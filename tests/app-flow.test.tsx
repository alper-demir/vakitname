import React, { useState } from 'react';
import { AppState, Pressable, Text } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AppStateProvider, useAppState } from '@/services/app-state';
import { ThemeProvider } from '@/ui/theme-context';
import HomeScreen from '@/features/home/home-screen';
import LocationScreen from '@/features/location/location-screen';
import { persistence } from '@/services/storage';
import { locateDevice } from '@/services/location';
import { initialSavedState } from '@/domain/state';
import { gpsLocation, manualLocation, provinces } from '@/domain/locations';

jest.mock('@/services/storage', () => ({ persistence: { read: jest.fn(), write: jest.fn() } }));
jest.mock('@/services/location', () => ({ locateDevice: jest.fn() }));
jest.mock('@/ui/use-now', () => ({ useNow: () => Date.parse('2026-09-30T14:00:00+03:00') }));
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
  jest.mocked(persistence.read).mockResolvedValue(null);
  jest.mocked(persistence.write).mockResolvedValue(undefined);
});
test('denied GPS → offline manual city → real Home → persisted relaunch', async () => {
  jest.mocked(locateDevice).mockRejectedValue(new Error('denied'));
  const app = await render(<App />);
  await fireEvent.press(screen.getByRole('button', { name: 'Konumumu kullan' }));
  expect(screen.getByText(/Konum izni/)).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Şehir veya ilçe seç' }));
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

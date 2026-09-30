import * as Location from 'expo-location';
import { gpsLocation } from '@/domain/locations';

export type LocationError = 'denied' | 'blocked' | 'disabled' | 'timeout' | 'outside-turkey' | 'unavailable';
export async function locateDevice({ requestPermission = true }: { requestPermission?: boolean } = {}) {
  if (!(await Location.hasServicesEnabledAsync())) throw new Error('disabled');
  let permission = await Location.getForegroundPermissionsAsync();
  if (!permission.granted && requestPermission && permission.canAskAgain) permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) throw new Error(permission.canAskAgain ? 'denied' : 'blocked');
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const position = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error('timeout')), 15000); }),
    ]);
    return gpsLocation(position.coords.latitude, position.coords.longitude, position.coords.accuracy ?? undefined);
  } finally { if (timeout) clearTimeout(timeout); }
}

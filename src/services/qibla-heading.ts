import * as Location from 'expo-location';

export type HeadingReading = { trueHeading: number | null; magneticHeading: number | null; accuracy: number | null };
export type HeadingAvailability = 'available' | 'permission-required' | 'unavailable';

function numberOrNull(value: number): number | null {
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function mapReading(reading: Location.LocationHeadingObject): HeadingReading {
  return { trueHeading: numberOrNull(reading.trueHeading), magneticHeading: numberOrNull(reading.magHeading), accuracy: Number.isFinite(reading.accuracy) ? reading.accuracy : null };
}

export async function headingAvailability(): Promise<HeadingAvailability> {
  const permission = await Location.getForegroundPermissionsAsync();
  return permission.granted ? 'available' : permission.canAskAgain ? 'permission-required' : 'unavailable';
}

export async function requestHeadingPermission(): Promise<HeadingAvailability> {
  const permission = await Location.requestForegroundPermissionsAsync();
  return permission.granted ? 'available' : 'unavailable';
}

export async function watchHeading(onReading: (reading: HeadingReading) => void, onError: () => void): Promise<() => void> {
  try {
    const subscription = await Location.watchHeadingAsync((reading) => onReading(mapReading(reading)), onError);
    return () => subscription.remove();
  } catch {
    onError();
    return () => {};
  }
}

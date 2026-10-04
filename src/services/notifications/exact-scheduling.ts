import * as Application from 'expo-application';
import * as IntentLauncher from 'expo-intent-launcher';
import { Platform } from 'react-native';

export type ExactSchedulingStatus = 'managed-by-system' | 'not-required' | 'unsupported';

export const exactScheduling = {
  async getStatus(): Promise<ExactSchedulingStatus> {
    if (Platform.OS !== 'android') return 'unsupported';
    if (Number(Platform.Version) < 31) return 'not-required';
    // SCHEDULE_EXACT_ALARM is special access, not a runtime permission.
    // React Native's PermissionsAndroid.check() stays false even after the
    // Android switch is enabled, so claiming an on/off state would be wrong.
    return 'managed-by-system';
  },

  async requestAccess(): Promise<ExactSchedulingStatus> {
    if (Platform.OS !== 'android') return 'unsupported';
    if (Number(Platform.Version) < 31) return 'not-required';

    const data = Application.applicationId ? `package:${Application.applicationId}` : undefined;
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.REQUEST_SCHEDULE_EXACT_ALARM,
      data ? { data } : undefined,
    );
    return 'managed-by-system';
  },
};

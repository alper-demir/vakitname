import React from 'react';
import HomeScreen from '@/features/home/home-screen';
import OnboardingScreen from '@/features/onboarding/onboarding-screen';
import { useAppState } from '@/services/app-state';

export default function IndexScreen() {
  const state = useAppState();
  return state.ready && !state.onboardingComplete ? <OnboardingScreen /> : <HomeScreen />;
}

/* eslint-disable @typescript-eslint/no-require-imports -- Jest mock factories are hoisted. */
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

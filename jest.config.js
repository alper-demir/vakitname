module.exports = {
  preset: 'jest-expo',
  resolver: 'react-native-worklets/jest/resolver',
  testMatch: ['<rootDir>/tests/**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  clearMocks: true,
  collectCoverageFrom: ['src/domain/**/*.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native.*|@react-native(-community)?/.*|expo.*|@expo(nent)?/.*|@expo-google-fonts/.*|@react-navigation/.*|adhan)/)',
  ],
};

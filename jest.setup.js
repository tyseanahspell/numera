jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

jest.mock('@/shared/store', () => ({
  useSettingsStore: (selector) =>
    selector({
      settings: {
        fontScale: 1,
        reducedMotion: false,
        highContrast: false,
        darkMode: true,
        notifications: { dailyInsight: true },
        numerologySystem: 'pythagorean',
      },
    }),
  useAuthStore: jest.fn(),
  useAppDataStore: jest.fn(),
  useCoachStore: jest.fn(),
}));

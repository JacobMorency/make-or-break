import '@testing-library/jest-native/extend-expect';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock AsyncStorage - must be defined before any imports
const mockAsyncStorageStore = {};
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = {};
  return {
    __esModule: true,
    default: {
      getItem: (key) => Promise.resolve(store[key] || null),
      setItem: (key, value) => {
        store[key] = value;
        return Promise.resolve();
      },
      removeItem: (key) => {
        delete store[key];
        return Promise.resolve();
      },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
        return Promise.resolve();
      },
    },
  };
});

// Mock expo-router
const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  replace: jest.fn(),
  canGoBack: jest.fn(() => true),
};

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  Link: {
    Trigger: ({ children }) => children,
    Preview: () => null,
    Menu: ({ children }) => children,
    MenuAction: ({ onPress, ...props }) => null,
  },
  router: mockRouter,
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  default: {
    executionEnvironment: 'standalone',
  },
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }) => React.createElement(View, props, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// Reset mocks before each test
beforeEach(() => {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  AsyncStorage.clear();
  mockRouter.push.mockClear();
  mockRouter.back.mockClear();
  mockRouter.replace.mockClear();
});


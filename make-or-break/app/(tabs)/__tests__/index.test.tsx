import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../index';
import { useHabitsStore } from '@/src/features/habits/store/habitsStore';
import { todayISO } from '@/src/lib/date';
import { getHabitCount } from '@/src/features/habits/model/selectors';

// Mock expo-router (already mocked in jest.setup.js, but override for this test)
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
}));

describe('Home Screen Integration', () => {
  beforeEach(() => {
    // Reset store before each test
    useHabitsStore.getState().resetStore();
    mockPush.mockClear();
  });

  it('create habit and increment flow', async () => {
    const { getByTestId, queryByText, getAllByTestId } = render(<HomeScreen />);
    
    // Initially no habits (or seed habits might be present)
    const store = useHabitsStore.getState();
    store.resetStore();

    // Create habit directly in store (simulating form submission)
    store.createHabit({
      name: 'Test Habit',
      iconKey: 'star.fill',
      cadence: 'daily',
      polarity: 'build',
      goal: 5,
      step: 1,
    });

    // Get fresh state after createHabit
    const updatedStore = useHabitsStore.getState();
    const habit = updatedStore.habits[0];
    expect(habit).toBeDefined();
    const today = todayISO();

    // Wait for re-render and verify habit appears
    await waitFor(() => {
      expect(queryByText('Test Habit')).toBeTruthy();
    });

    // Initially count should be 0
    expect(getHabitCount(habit.id, today, updatedStore.entries)).toBe(0);

    // Find all mini ring buttons (there might be multiple habits)
    const ringButtons = getAllByTestId('mini-ring-button');
    expect(ringButtons.length).toBeGreaterThan(0);

    // Get the first ring button (for our test habit)
    const ringButton = ringButtons[0];

    // Fire press event to increment
    fireEvent.press(ringButton);

    // Wait for state update
    await waitFor(() => {
      const updatedStore = useHabitsStore.getState();
      expect(getHabitCount(habit.id, today, updatedStore.entries)).toBe(1);
    });

    // Fire longPress event to decrement
    fireEvent(ringButton, 'longPress');

    // Wait for state update
    await waitFor(() => {
      const updatedStore = useHabitsStore.getState();
      expect(getHabitCount(habit.id, today, updatedStore.entries)).toBe(0);
    });
  });
});


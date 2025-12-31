import { useHabitsStore } from '../habitsStore';
import { todayISO } from '@/src/lib/date';
import { getHabitCount } from '../../model/selectors';

describe('habitsStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useHabitsStore.getState();
    store.resetStore();
    // Wait a bit for async operations to complete
    return new Promise((resolve) => setTimeout(resolve, 10));
  });

  it('incrementHabit creates entry for today', async () => {
    const store = useHabitsStore.getState();
    
    // Create a habit
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
    const habits = updatedStore.habits;
    expect(habits.length).toBeGreaterThan(0);
    const habit = habits[0];
    const today = todayISO();

    // Initially no entry
    expect(getHabitCount(habit.id, today, updatedStore.entries)).toBe(0);

    // Increment
    updatedStore.incrementHabit(habit.id, today);

    // Get fresh state after increment
    const finalStore = useHabitsStore.getState();
    const count = getHabitCount(habit.id, today, finalStore.entries);
    expect(count).toBe(1);
  });

  it('decrementHabit clamps at 0', async () => {
    const store = useHabitsStore.getState();
    
    // Create a habit
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
    const habits = updatedStore.habits;
    expect(habits.length).toBeGreaterThan(0);
    const habit = habits[0];
    const today = todayISO();

    // Increment once
    updatedStore.incrementHabit(habit.id, today);
    const afterIncrement = useHabitsStore.getState();
    expect(getHabitCount(habit.id, today, afterIncrement.entries)).toBe(1);

    // Decrement twice
    afterIncrement.decrementHabit(habit.id, today);
    afterIncrement.decrementHabit(habit.id, today);

    // Verify count is 0 (not negative)
    const finalStore = useHabitsStore.getState();
    const count = getHabitCount(habit.id, today, finalStore.entries);
    expect(count).toBe(0);
  });
});


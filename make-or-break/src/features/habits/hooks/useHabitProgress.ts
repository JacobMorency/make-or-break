import { useHabitsStore } from '../store/habitsStore';
import { getHabitProgress, getHabitCount, getWeeklyHabitCount } from '../model/selectors';
import { getWeekStartISO } from '@/src/lib/date';

/**
 * Hook to get habit progress and count for the selected date
 */
export function useHabitProgress(habitId: string) {
  const { entries, selectedDate } = useHabitsStore();
  const habits = useHabitsStore((state) => state.habits);
  const habit = habits.find((h) => h.id === habitId);

  if (!habit) {
    return { progress: 0, count: 0 };
  }

  const progress = getHabitProgress(habit, selectedDate, entries);
  
  let count: number;
  if (habit.cadence === 'daily') {
    count = getHabitCount(habitId, selectedDate, entries);
  } else {
    const weekStart = getWeekStartISO(selectedDate);
    count = getWeeklyHabitCount(habitId, weekStart, entries);
  }

  return { progress, count };
}


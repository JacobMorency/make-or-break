/**
 * Pure selector functions for habit data
 */

import type { Habit, HabitEntry } from './types';
import { getWeekStartISO } from '@/src/lib/date';

/**
 * Get entry key for storage
 */
export function getEntryKey(habitId: string, dateISO: string): string {
  return `${habitId}-${dateISO}`;
}

/**
 * Get habit count for a specific date
 */
export function getHabitCount(
  habitId: string,
  dateISO: string,
  entries: Record<string, HabitEntry>
): number {
  const key = getEntryKey(habitId, dateISO);
  const entry = entries[key];
  return entry?.count ?? 0;
}

/**
 * Get weekly habit count (sum of counts from Monday to Sunday of the week)
 */
export function getWeeklyHabitCount(
  habitId: string,
  weekStartISO: string,
  entries: Record<string, HabitEntry>
): number {
  let total = 0;
  const weekStart = new Date(weekStartISO + 'T00:00:00');
  
  // Sum counts for all 7 days of the week
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const dateISO = date.toISOString().split('T')[0];
    total += getHabitCount(habitId, dateISO, entries);
  }
  
  return total;
}

/**
 * Get habit progress (0-1) for a specific date
 */
export function getHabitProgress(
  habit: Habit,
  dateISO: string,
  entries: Record<string, HabitEntry>
): number {
  if (habit.goal === 0) return 0;
  
  let count: number;
  if (habit.cadence === 'daily') {
    count = getHabitCount(habit.id, dateISO, entries);
  } else {
    const weekStart = getWeekStartISO(dateISO);
    count = getWeeklyHabitCount(habit.id, weekStart, entries);
  }
  
  const progress = count / habit.goal;
  return Math.min(Math.max(progress, 0), 1); // Clamp 0-1
}

/**
 * Get overall progress (mean of all visible habit progresses)
 */
export function getOverallProgress(
  habits: Habit[],
  dateISO: string,
  entries: Record<string, HabitEntry>
): number {
  const visibleHabits = habits.filter((h) => !h.archived);
  if (visibleHabits.length === 0) return 0;
  
  const progresses = visibleHabits.map((habit) =>
    getHabitProgress(habit, dateISO, entries)
  );
  
  const sum = progresses.reduce((acc, p) => acc + p, 0);
  return sum / visibleHabits.length;
}


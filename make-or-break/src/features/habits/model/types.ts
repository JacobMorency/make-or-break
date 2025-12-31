/**
 * Data model types for habits
 */

export type Habit = {
  id: string;
  name: string;
  iconKey: string;
  cadence: 'daily' | 'weekly';
  polarity: 'build' | 'break';
  goal: number;
  step: number;
  createdAt: string;
  archived: boolean;
  sortOrder: number;
};

export type HabitEntry = {
  id: string;
  habitId: string;
  dateISO: string; // YYYY-MM-DD
  count: number;
  updatedAt: string;
};


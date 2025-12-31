import { getWeeklyHabitCount, getEntryKey } from '../selectors';
import type { HabitEntry } from '../types';
import { getWeekStartISO, addDays, formatDateISO } from '@/src/lib/date';

describe('selectors', () => {
  it('getWeeklyHabitCount sums entries from Monday to Sunday', () => {
    const habitId = 'test-habit-1';
    
    // Get a Monday date
    const monday = new Date('2024-01-01T00:00:00'); // Monday
    const weekStart = getWeekStartISO(monday);
    
    // Create entries for Mon, Wed, Fri of the same week
    const mondayISO = formatDateISO(monday);
    const wednesdayISO = addDays(mondayISO, 2);
    const fridayISO = addDays(mondayISO, 4);
    
    const entries: Record<string, HabitEntry> = {
      [getEntryKey(habitId, mondayISO)]: {
        id: '1',
        habitId,
        dateISO: mondayISO,
        count: 2,
        updatedAt: new Date().toISOString(),
      },
      [getEntryKey(habitId, wednesdayISO)]: {
        id: '2',
        habitId,
        dateISO: wednesdayISO,
        count: 3,
        updatedAt: new Date().toISOString(),
      },
      [getEntryKey(habitId, fridayISO)]: {
        id: '3',
        habitId,
        dateISO: fridayISO,
        count: 1,
        updatedAt: new Date().toISOString(),
      },
      // Entry from previous week (should not be included)
      [getEntryKey(habitId, addDays(mondayISO, -1))]: {
        id: '4',
        habitId,
        dateISO: addDays(mondayISO, -1),
        count: 10,
        updatedAt: new Date().toISOString(),
      },
      // Entry from next week (should not be included)
      [getEntryKey(habitId, addDays(mondayISO, 7))]: {
        id: '5',
        habitId,
        dateISO: addDays(mondayISO, 7),
        count: 20,
        updatedAt: new Date().toISOString(),
      },
    };

    const total = getWeeklyHabitCount(habitId, weekStart, entries);
    
    // Should sum Mon (2) + Wed (3) + Fri (1) = 6
    // Should NOT include previous/next week entries
    expect(total).toBe(6);
  });
});


import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Habit, HabitEntry } from '../model/types';
import { generateId } from '@/src/lib/id';
import { todayISO } from '@/src/lib/date';
import { getEntryKey } from '../model/selectors';

interface HabitsState {
  habits: Habit[];
  entries: Record<string, HabitEntry>;
  selectedDate: string;
  
  // Actions
  createHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'archived' | 'sortOrder'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  archiveHabit: (id: string) => void;
  incrementHabit: (habitId: string, dateISO: string) => void;
  decrementHabit: (habitId: string, dateISO: string) => void;
  setSelectedDate: (dateISO: string) => void;
  resetStore: () => void;
  
  // Internal
  _loadFromStorage: () => Promise<void>;
  _saveToStorage: () => Promise<void>;
}

const STORAGE_KEYS = {
  habits: '@habits',
  entries: '@entries',
  selectedDate: '@selectedDate',
};

// Dev seed habits
const seedHabits: Habit[] = [
  {
    id: generateId(),
    name: 'Drink water',
    iconKey: 'drop.fill',
    cadence: 'daily',
    polarity: 'build',
    goal: 8,
    step: 1,
    createdAt: new Date().toISOString(),
    archived: false,
    sortOrder: 0,
  },
  {
    id: generateId(),
    name: 'Go to the gym',
    iconKey: 'figure.strengthtraining.traditional',
    cadence: 'daily',
    polarity: 'build',
    goal: 6,
    step: 1,
    createdAt: new Date().toISOString(),
    archived: false,
    sortOrder: 1,
  },
  {
    id: generateId(),
    name: 'Work on Side Projects',
    iconKey: 'chart.pie.fill',
    cadence: 'weekly',
    polarity: 'build',
    goal: 4,
    step: 1,
    createdAt: new Date().toISOString(),
    archived: false,
    sortOrder: 2,
  },
];

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  entries: {},
  selectedDate: todayISO(),

  _loadFromStorage: async () => {
    try {
      const [habitsJson, entriesJson, selectedDateJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.habits),
        AsyncStorage.getItem(STORAGE_KEYS.entries),
        AsyncStorage.getItem(STORAGE_KEYS.selectedDate),
      ]);

      const habits = habitsJson ? JSON.parse(habitsJson) : seedHabits;
      const entries = entriesJson ? JSON.parse(entriesJson) : {};
      const selectedDate = selectedDateJson || todayISO();

      set({ habits, entries, selectedDate });

      // If no habits in storage, save seed habits
      if (!habitsJson) {
        await get()._saveToStorage();
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
      // Fallback to seed habits
      set({ habits: seedHabits, entries: {}, selectedDate: todayISO() });
    }
  },

  _saveToStorage: async () => {
    try {
      const { habits, entries, selectedDate } = get();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(habits)),
        AsyncStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries)),
        AsyncStorage.setItem(STORAGE_KEYS.selectedDate, selectedDate),
      ]);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },

  createHabit: (habitData) => {
    const newHabit: Habit = {
      ...habitData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      archived: false,
      sortOrder: get().habits.length,
    };

    set((state) => ({
      habits: [...state.habits, newHabit],
    }));

    get()._saveToStorage();
  },

  updateHabit: (id, updates) => {
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    }));

    get()._saveToStorage();
  },

  archiveHabit: (id) => {
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? { ...h, archived: true } : h)),
    }));

    get()._saveToStorage();
  },

  incrementHabit: (habitId, dateISO) => {
    const habit = get().habits.find((h) => h.id === habitId);
    if (!habit) return;

    const key = getEntryKey(habitId, dateISO);
    const existingEntry = get().entries[key];

    const newEntry: HabitEntry = {
      id: existingEntry?.id || generateId(),
      habitId,
      dateISO,
      count: (existingEntry?.count || 0) + habit.step,
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      entries: {
        ...state.entries,
        [key]: newEntry,
      },
    }));

    get()._saveToStorage();
  },

  decrementHabit: (habitId, dateISO) => {
    const habit = get().habits.find((h) => h.id === habitId);
    if (!habit) return;

    const key = getEntryKey(habitId, dateISO);
    const existingEntry = get().entries[key];
    const currentCount = existingEntry?.count || 0;
    const newCount = Math.max(0, currentCount - habit.step);

    if (newCount === 0 && existingEntry) {
      // Remove entry if count is 0
      set((state) => {
        const newEntries = { ...state.entries };
        delete newEntries[key];
        return { entries: newEntries };
      });
    } else if (newCount > 0) {
      const newEntry: HabitEntry = {
        id: existingEntry?.id || generateId(),
        habitId,
        dateISO,
        count: newCount,
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        entries: {
          ...state.entries,
          [key]: newEntry,
        },
      }));
    }

    get()._saveToStorage();
  },

  setSelectedDate: (dateISO) => {
    set({ selectedDate: dateISO });
    get()._saveToStorage();
  },

  resetStore: () => {
    set({
      habits: [],
      entries: {},
      selectedDate: todayISO(),
    });
  },
}));

// Load from storage on initialization
useHabitsStore.getState()._loadFromStorage();


import type { Habit } from "@/types/habit";
import { storage } from "./asyncStorage";

const STORAGE_KEY = "habits";

// Generate a simple unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Migrate habits to include IDs if they don't have them
export async function migrateHabitsWithIds(): Promise<Habit[]> {
  try {
    const habits = await storage.getItem<Habit[]>(STORAGE_KEY);
    if (!habits || habits.length === 0) {
      return [];
    }

    // Check if any habit is missing an ID
    const needsMigration = habits.some((habit) => !habit.id);

    if (needsMigration) {
      const migratedHabits = habits.map((habit) => ({
        ...habit,
        id: habit.id || generateId(),
      }));

      await storage.setItem(STORAGE_KEY, migratedHabits);
      return migratedHabits;
    }

    return habits;
  } catch (error) {
    console.error("Error migrating habits:", error);
    return [];
  }
}


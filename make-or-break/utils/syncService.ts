import { supabase } from "./supabase";
import { storage } from "./asyncStorage";
import { getDeviceId } from "./deviceId";
import { isWiFiConnected } from "./networkService";
import type { Habit } from "@/types/habit";

const STORAGE_KEY = "habits";
const DAILY_PROGRESS_KEY = "dailyProgress";
const LAST_SYNC_KEY = "lastSyncTimestamp";

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

/**
 * Sync habits to Supabase (push local to remote)
 */
export async function syncHabitsToSupabase(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured, skipping sync");
    return false;
  }

  const isWiFi = await isWiFiConnected();
  if (!isWiFi) {
    console.log("Not on WiFi, skipping sync");
    return false;
  }

  try {
    const deviceId = await getDeviceId();
    const localHabits = (await storage.getItem<Habit[]>(STORAGE_KEY)) || [];

    if (localHabits.length === 0) {
      return true;
    }

    // Transform local habits to Supabase format
    const habitsToSync = localHabits.map((habit) => ({
      id: habit.id,
      user_id: deviceId,
      icon: habit.icon,
      name: habit.name,
      goal_amount: habit.goalAmount,
      updated_at: new Date().toISOString(),
    }));

    // Upsert habits (insert or update)
    // Handle each habit individually to work with composite primary key
    let hasError = false;

    for (const habit of habitsToSync) {
      // Try to update first
      const { data: existing, error: selectError } = await supabase!
        .from("habits")
        .select("id")
        .eq("id", habit.id)
        .eq("user_id", deviceId)
        .single();

      if (selectError && selectError.code !== "PGRST116") {
        // PGRST116 is "not found" which is fine
        console.error("Error checking existing habit:", selectError);
      }

      if (existing) {
        // Update existing
        const { error: updateError } = await supabase!
          .from("habits")
          .update({
            icon: habit.icon,
            name: habit.name,
            goal_amount: habit.goal_amount,
            updated_at: habit.updated_at,
          })
          .eq("id", habit.id)
          .eq("user_id", deviceId);

        if (updateError) {
          console.error("Error updating habit:", updateError);
          hasError = true;
        }
      } else {
        // Insert new
        const { error: insertError } = await supabase!
          .from("habits")
          .insert(habit);

        if (insertError) {
          console.error("Error inserting habit:", insertError);
          hasError = true;
        }
      }
    }

    if (hasError) {
      console.error("Some habits failed to sync");
      return false;
    }

    // Update last sync timestamp
    await storage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    return true;
  } catch (error) {
    console.error("Error in syncHabitsToSupabase:", error);
    return false;
  }
}

/**
 * Sync habits from Supabase (pull remote to local)
 */
export async function syncHabitsFromSupabase(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const isWiFi = await isWiFiConnected();
  if (!isWiFi) {
    return false;
  }

  try {
    const deviceId = await getDeviceId();

    // Fetch habits from Supabase
    const { data, error } = await supabase!
      .from("habits")
      .select("*")
      .eq("user_id", deviceId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching habits from Supabase:", error);
      return false;
    }

    if (!data || data.length === 0) {
      return true; // No remote data, that's okay
    }

    // Transform Supabase format to local format
    const remoteHabits: Habit[] = data.map((row) => ({
      id: row.id,
      icon: row.icon,
      name: row.name,
      goalAmount: row.goal_amount,
      currentAmount: 0, // Will be set from local or daily progress
    }));

    // Get local habits
    const localHabits = (await storage.getItem<Habit[]>(STORAGE_KEY)) || [];

    // Merge: prefer local currentAmount, but use remote for other fields if newer
    const mergedHabits = remoteHabits.map((remote) => {
      const local = localHabits.find((h) => h.id === remote.id);
      return {
        ...remote,
        currentAmount: local?.currentAmount ?? 0,
      };
    });

    // Add any local-only habits
    const localOnlyHabits = localHabits.filter(
      (local) => !remoteHabits.some((remote) => remote.id === local.id)
    );

    const finalHabits = [...mergedHabits, ...localOnlyHabits];

    // Save merged habits
    await storage.setItem(STORAGE_KEY, finalHabits);

    // Update last sync timestamp
    await storage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    return true;
  } catch (error) {
    console.error("Error in syncHabitsFromSupabase:", error);
    return false;
  }
}

/**
 * Sync daily progress to Supabase
 */
export async function syncDailyProgressToSupabase(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const isWiFi = await isWiFiConnected();
  if (!isWiFi) {
    return false;
  }

  try {
    const deviceId = await getDeviceId();
    const dailyProgress =
      (await storage.getItem<{
        [date: string]: { habits: Habit[] };
      }>(DAILY_PROGRESS_KEY)) || {};

    const progressEntries: Array<{
      user_id: string;
      date: string;
      habit_id: string;
      current_amount: number;
    }> = [];

    // Transform daily progress data
    for (const [date, data] of Object.entries(dailyProgress)) {
      for (const habit of data.habits) {
        progressEntries.push({
          user_id: deviceId,
          date,
          habit_id: habit.id,
          current_amount: habit.currentAmount,
        });
      }
    }

    if (progressEntries.length === 0) {
      return true;
    }

    // Upsert daily progress
    const { error } = await supabase!
      .from("daily_progress")
      .upsert(progressEntries, {
        onConflict: "user_id,date,habit_id",
      });

    if (error) {
      console.error("Error syncing daily progress to Supabase:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in syncDailyProgressToSupabase:", error);
    return false;
  }
}

/**
 * Perform full bidirectional sync
 */
export async function performFullSync(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const isWiFi = await isWiFiConnected();
  if (!isWiFi) {
    console.log("Not on WiFi, cannot perform sync");
    return false;
  }

  try {
    console.log("Starting full sync...");

    // Pull first (get latest from server)
    const pullSuccess = await syncHabitsFromSupabase();
    if (!pullSuccess) {
      console.log("Failed to pull habits from Supabase");
    }

    // Push local changes
    const pushSuccess = await syncHabitsToSupabase();
    if (!pushSuccess) {
      console.log("Failed to push habits to Supabase");
    }

    // Sync daily progress
    const progressSuccess = await syncDailyProgressToSupabase();
    if (!progressSuccess) {
      console.log("Failed to sync daily progress");
    }

    const allSuccess = pullSuccess && pushSuccess && progressSuccess;
    console.log(`Sync ${allSuccess ? "completed" : "completed with errors"}`);
    return allSuccess;
  } catch (error) {
    console.error("Error in performFullSync:", error);
    return false;
  }
}

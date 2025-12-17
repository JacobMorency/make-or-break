import { View, Text, Pressable, Alert } from "react-native";
import HabitCard from "@/components/habitcard/habitcard";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";

import { SafeAreaView } from "react-native-safe-area-context";

import { CircularProgressBase } from "react-native-circular-progress-indicator";

import HabitDetailModal from "@/components/habit-detail-modal";
import EditHabitModal from "@/components/habitcard/edit-habit-modal";
import WeeklyDaysProgress from "@/components/weekly-days-progress";

import { storage } from "@/utils/asyncStorage";
import { migrateHabitsWithIds } from "@/utils/habitMigration";
import type { Habit } from "@/types/habit";

const STORAGE_KEY = "habits";
const LAST_RESET_KEY = "lastResetTimestamp";
const DAILY_PROGRESS_KEY = "dailyProgress";

// Calculate total progress percentage across all habits
function calculateTotalProgress(habits: Habit[]): number {
  if (habits.length === 0) return 0;

  const validHabits = habits.filter((h) => h.goalAmount > 0);
  if (validHabits.length === 0) return 0;

  const totalPercentage = validHabits.reduce((sum, habit) => {
    const percentage = Math.min(
      (habit.currentAmount / habit.goalAmount) * 100,
      100
    );
    return sum + percentage;
  }, 0);

  return Math.round(totalPercentage / validHabits.length);
}

// Get current hour in EST/EDT
function getCurrentESTHour(): { hour: number; date: string } {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const utcDate = now.toISOString().split("T")[0]; // YYYY-MM-DD

  // Determine if DST is active (simplified: March to November)
  const month = now.getUTCMonth();
  const isDST = month >= 2 && month <= 10; // March (2) to November (10)

  // EST is UTC-5, EDT is UTC-4
  const offset = isDST ? 4 : 5;
  let estHour = utcHour - offset;
  let estDate = utcDate;

  // Handle day rollover
  if (estHour < 0) {
    estHour += 24;
    // Get previous day
    const prevDay = new Date(now);
    prevDay.setUTCDate(prevDay.getUTCDate() - 1);
    estDate = prevDay.toISOString().split("T")[0];
  }

  return { hour: estHour, date: estDate };
}

// Check if reset is needed and perform reset if necessary
async function checkAndResetDaily(habits: Habit[]): Promise<Habit[]> {
  try {
    const { hour: currentESTHour, date: currentESTDate } = getCurrentESTHour();

    // Get last reset timestamp
    const lastResetStr = await storage.getItem<string>(LAST_RESET_KEY);

    if (lastResetStr) {
      const lastReset = new Date(lastResetStr);
      const lastResetDate = lastReset.toISOString().split("T")[0];

      // If we've already reset today, don't reset again
      if (lastResetDate === currentESTDate) {
        return habits;
      }
    }

    // Check if current time is >= 3am EST
    if (currentESTHour >= 3) {
      // Reset all habits
      const resetHabits = habits.map((habit) => ({
        ...habit,
        currentAmount: 0,
      }));

      // Save reset timestamp
      await storage.setItem(LAST_RESET_KEY, new Date().toISOString());

      return resetHabits;
    }

    return habits;
  } catch (error) {
    console.error("Error checking/resetting daily:", error);
    return habits;
  }
}

export default function HomeScreen() {
  const router = useRouter();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyProgress, setDailyProgress] = useState<{
    [date: string]: { habits: Habit[] };
  }>({});

  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

  const handleIncrement = (habitId: string, newAmount: number) => {
    setHabits((prevHabits) => {
      return prevHabits.map((habit) =>
        habit.id === habitId ? { ...habit, currentAmount: newAmount } : habit
      );
    });
  };

  const handleDeleteHabit = async (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    Alert.alert(
      "Delete Habit",
      `Are you sure you want to delete "${habit.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedHabits = habits.filter((h) => h.id !== habitId);
            setHabits(updatedHabits);
            await storage.setItem(STORAGE_KEY, updatedHabits);
          },
        },
      ]
    );
  };

  const handleEditHabit = (habit: Habit) => {
    setHabitToEdit(habit);
    setIsEditMode(true);
  };

  const handleUpdateHabit = async (updatedHabit: Habit) => {
    setHabits((prevHabits) => {
      return prevHabits.map((habit) =>
        habit.id === updatedHabit.id ? updatedHabit : habit
      );
    });
    setIsEditMode(false);
    setHabitToEdit(null);
  };

  // Helper function to load habits from storage
  const loadHabits = useCallback(async () => {
    try {
      // Migrate habits to include IDs if needed
      const migratedHabits = await migrateHabitsWithIds();

      if (migratedHabits.length > 0) {
        // Check and perform daily reset if needed
        const habitsAfterReset = await checkAndResetDaily(migratedHabits);
        setHabits(habitsAfterReset);

        // If habits were reset, save them
        if (habitsAfterReset !== migratedHabits) {
          await storage.setItem(STORAGE_KEY, habitsAfterReset);
        }
      } else {
        // Try loading from storage if migration didn't return anything
        const storedHabits = await storage.getItem<Habit[]>(STORAGE_KEY);
        if (storedHabits) {
          const habitsAfterReset = await checkAndResetDaily(storedHabits);
          setHabits(habitsAfterReset);
          if (habitsAfterReset !== storedHabits) {
            await storage.setItem(STORAGE_KEY, habitsAfterReset);
          }
        }
      }

      // Load daily progress
      const storedDailyProgress = await storage.getItem<{
        [date: string]: { habits: Habit[] };
      }>(DAILY_PROGRESS_KEY);
      if (storedDailyProgress) {
        setDailyProgress(storedDailyProgress);
      }
    } catch (error) {
      console.error("Error loading habits:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  useFocusEffect(
    useCallback(() => {
      if (!isLoading) {
        loadHabits();
      }
    }, [loadHabits, isLoading])
  );

  useEffect(() => {
    if (!isLoading) {
      const saveHabits = async () => {
        try {
          await storage.setItem(STORAGE_KEY, habits);

          // Save daily snapshot
          const today = new Date().toISOString().split("T")[0];
          const currentDailyProgress =
            (await storage.getItem<{ [date: string]: { habits: Habit[] } }>(
              DAILY_PROGRESS_KEY
            )) || {};

          currentDailyProgress[today] = {
            habits: habits.map((h) => ({ ...h })), // Deep copy
          };

          await storage.setItem(DAILY_PROGRESS_KEY, currentDailyProgress);
          setDailyProgress(currentDailyProgress);
        } catch (error) {
          console.error("Error saving habits:", error);
        }
      };

      saveHabits();
    }
  }, [habits, isLoading]);

  // Calculate total progress from habits
  const totalProgress = useMemo(() => {
    const progress = calculateTotalProgress(habits);
    return progress;
  }, [habits]);

  return (
    <>
      <SafeAreaView className="flex-1 bg-bg gap-4 p-4">
        <ActionButtons
          onDevPress={() => router.push("/dev-storage")}
          onEditPress={() => setIsEditMode(!isEditMode)}
          onAddPress={() => router.push("/add-habit")}
          isEditMode={isEditMode}
        />
        <WeeklyDaysProgress
          dailyProgress={dailyProgress}
          onDayPress={(date) => {
            // Future: Navigate to that day's view
            console.log("Day pressed:", date);
          }}
        />
        <HeaderSection />
        <ProgressSection value={totalProgress} />
        <HabitsList
          habits={habits}
          onIncrement={handleIncrement}
          onHabitPress={(habit) => {
            setSelectedHabit(habit);
          }}
          onEdit={handleEditHabit}
          onDelete={handleDeleteHabit}
          isEditMode={isEditMode}
        />
      </SafeAreaView>
      <HabitDetailModal
        isOpen={selectedHabit !== null && !isEditMode}
        onClose={() => setSelectedHabit(null)}
        habit={selectedHabit}
        onUpdate={(newAmount) => {
          if (selectedHabit !== null) {
            handleIncrement(selectedHabit.id, newAmount);
          }
        }}
      />
      <EditHabitModal
        isOpen={isEditMode && habitToEdit !== null}
        onClose={() => {
          setIsEditMode(false);
          setHabitToEdit(null);
        }}
        habit={habitToEdit}
        onSave={handleUpdateHabit}
      />
    </>
  );
}

// Action Buttons Component
type ActionButtonsProps = {
  onDevPress: () => void;
  onEditPress?: () => void;
  onAddPress: () => void;
  isEditMode?: boolean;
};

function ActionButtons({
  onDevPress,
  onEditPress,
  onAddPress,
  isEditMode = false,
}: ActionButtonsProps) {
  return (
    <View className="flex-row justify-end gap-3">
      <Pressable
        className="bg-card w-10 h-10 rounded-full items-center justify-center shadow-sm active:opacity-70"
        onPress={onDevPress}
      >
        <AntDesign name="tool" size={18} color="#3b82f6" />
      </Pressable>
      {onEditPress && (
        <Pressable
          className={`w-10 h-10 rounded-full items-center justify-center shadow-sm active:opacity-70 ${
            isEditMode ? "bg-primary" : "bg-card"
          }`}
          onPress={onEditPress}
        >
          <AntDesign
            name="edit"
            size={18}
            color={isEditMode ? "white" : "#3b82f6"}
          />
        </Pressable>
      )}
      <Pressable
        className="bg-primary w-12 h-12 rounded-full items-center justify-center shadow-md active:opacity-80"
        onPress={onAddPress}
      >
        <AntDesign name="plus" size={24} color="white" />
      </Pressable>
    </View>
  );
}

// Header Section Component
type HeaderSectionProps = {
  title?: string;
};

function HeaderSection({ title }: HeaderSectionProps) {
  // Get today's day name
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const todayName = dayNames[new Date().getDay()];
  const displayTitle = title || todayName;

  return (
    <View>
      <Text className="text-text font-bold text-3xl">{displayTitle}</Text>
    </View>
  );
}

// Progress Section Component
type ProgressSectionProps = {
  value: number;
  activeStrokeColor?: string;
};

function ProgressSection({
  value,
  activeStrokeColor = "#3b82f6",
}: ProgressSectionProps) {
  return (
    <View className="items-center">
      <CircularProgressBase
        value={value}
        maxValue={100}
        activeStrokeColor={activeStrokeColor}
        radius={60}
      >
        <Text className="text-primary font-bold text-2xl">{value}%</Text>
      </CircularProgressBase>
    </View>
  );
}

// Habits List Component
type HabitsListProps = {
  habits: Habit[];
  onIncrement: (habitId: string, newAmount: number) => void;
  onHabitPress: (habit: Habit) => void;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
  isEditMode?: boolean;
};

function HabitsList({
  habits,
  onIncrement,
  onHabitPress,
  onEdit,
  onDelete,
  isEditMode = false,
}: HabitsListProps) {
  return (
    <View>
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          id={habit.id}
          icon={habit.icon}
          name={habit.name}
          goalAmount={habit.goalAmount}
          currentAmount={habit.currentAmount}
          onIncrement={(newAmount) => {
            onIncrement(habit.id, newAmount);
          }}
          onPress={() => {
            onHabitPress(habit);
          }}
          onEdit={onEdit ? () => onEdit(habit) : undefined}
          onDelete={onDelete ? () => onDelete(habit.id) : undefined}
          isEditMode={isEditMode}
        />
      ))}
    </View>
  );
}

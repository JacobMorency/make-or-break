import { View, Text, Pressable } from "react-native";
import HabitCard from "@/components/habitcard/habitcard";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";

import { SafeAreaView } from "react-native-safe-area-context";

import { CircularProgressBase } from "react-native-circular-progress-indicator";

import HabitDetailModal from "@/components/habit-detail-modal";

import { storage } from "@/utils/asyncStorage";
import type { Habit } from "@/types/habit";

const STORAGE_KEY = "habits";
const LAST_RESET_KEY = "lastResetTimestamp";

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

  const [selectedHabit, setSelectedHabit] = useState<{
    habit: (typeof habits)[0];
    index: number;
  } | null>(null);

  const handleIncrement = (habitIndex: number, newAmount: number) => {
    setHabits((prevHabits) => {
      const updated = [...prevHabits];
      updated[habitIndex] = {
        ...updated[habitIndex],
        currentAmount: newAmount,
      };
      return updated;
    });
  };

  // Helper function to load habits from storage
  const loadHabits = useCallback(async () => {
    try {
      const storedHabits = await storage.getItem<Habit[]>(STORAGE_KEY);
      if (storedHabits) {
        // Check and perform daily reset if needed
        const habitsAfterReset = await checkAndResetDaily(storedHabits);
        setHabits(habitsAfterReset);

        // If habits were reset, save them
        if (habitsAfterReset !== storedHabits) {
          await storage.setItem(STORAGE_KEY, habitsAfterReset);
        }
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
          onAddPress={() => router.push("/add-habit")}
        />
        <HeaderSection />
        <ProgressSection value={totalProgress} />
        <HabitsList
          habits={habits}
          onIncrement={handleIncrement}
          onHabitPress={(habit, index) => {
            setSelectedHabit({ habit, index });
          }}
        />
      </SafeAreaView>
      <HabitDetailModal
        isOpen={selectedHabit !== null}
        onClose={() => setSelectedHabit(null)}
        habit={selectedHabit?.habit || null}
        onUpdate={(newAmount) => {
          if (selectedHabit !== null) {
            handleIncrement(selectedHabit.index, newAmount);
          }
        }}
      />
    </>
  );
}

// Action Buttons Component
type ActionButtonsProps = {
  onDevPress: () => void;
  onEditPress?: () => void;
  onAddPress: () => void;
};

function ActionButtons({
  onDevPress,
  onEditPress,
  onAddPress,
}: ActionButtonsProps) {
  return (
    <View className="flex-row justify-end gap-3">
      <Pressable
        className="bg-card w-10 h-10 rounded-full items-center justify-center shadow-sm active:opacity-70"
        onPress={onDevPress}
      >
        <AntDesign name="tool" size={18} color="#9CA3AF" />
      </Pressable>
      {onEditPress && (
        <Pressable
          className="bg-card w-10 h-10 rounded-full items-center justify-center shadow-sm active:opacity-70"
          onPress={onEditPress}
        >
          <AntDesign name="edit" size={18} color="#9CA3AF" />
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

function HeaderSection({ title = "Today (Hard Coded)" }: HeaderSectionProps) {
  return (
    <View>
      <Text className="text-text font-bold text-3xl">{title}</Text>
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
  onIncrement: (index: number, newAmount: number) => void;
  onHabitPress: (habit: Habit, index: number) => void;
};

function HabitsList({ habits, onIncrement, onHabitPress }: HabitsListProps) {
  return (
    <View>
      {habits.map((habit, index) => (
        <HabitCard
          key={index}
          icon={habit.icon}
          name={habit.name}
          goalAmount={habit.goalAmount}
          currentAmount={habit.currentAmount}
          onIncrement={(newAmount) => {
            onIncrement(index, newAmount);
          }}
          onPress={() => {
            onHabitPress(habit, index);
          }}
        />
      ))}
    </View>
  );
}

import { View, Text, Pressable } from "react-native";
import HabitCard from "@/components/habitcard/habitcard";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";

import CircularProgress from "react-native-circular-progress-indicator";

import HabitDetailModal from "@/components/habit-detail-modal";

import { storage } from "@/utils/asyncStorage";
import type { Habit } from "@/types/habit";

const STORAGE_KEY = "habits";

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
        setHabits(storedHabits);
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

  return (
    <>
      <SafeAreaView className="flex-1 bg-bg gap-4 p-2">
        <View className="flex-row justify-end gap-2">
          <Pressable
            className="bg-card p-2 rounded-full"
            onPress={() => router.push("/dev-storage")}
          >
            <Text className="text-text text-xs">Dev</Text>
          </Pressable>
          <Pressable className="bg-card p-2 rounded-full">
            <Text className="text-text">Edit</Text>
          </Pressable>
          <Pressable
            className="bg-card p-2 rounded-full"
            onPress={() => router.push("/add-habit")}
          >
            <Text className="text-text text-center">+</Text>
          </Pressable>
        </View>
        <View>
          <Text className="text-text font-bold text-3xl">
            Today (Hard Coded)
          </Text>
        </View>
        <View className="items-center">
          <CircularProgress value={64} activeStrokeColor={"#3b82f6"} />
        </View>
        <View>
          {habits.map((habit, index) => (
            <HabitCard
              key={index}
              icon={habit.icon}
              name={habit.name}
              goalAmount={habit.goalAmount}
              currentAmount={habit.currentAmount}
              onIncrement={(newAmount) => {
                handleIncrement(index, newAmount);
              }}
              onPress={() => {
                setSelectedHabit({ habit, index });
              }}
            />
          ))}
        </View>
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

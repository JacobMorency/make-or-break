import { View, Text, Pressable } from "react-native";
import HabitCard from "@/components/habitcard/habitcard";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularProgress from "react-native-circular-progress-indicator";
import type { Habit } from "@/types/habit";

import { storage } from "@/utils/asyncStorage";

const STORAGE_KEY = "habits";

// Default habits to use if nothing is in storage
const defaultHabits = [
  { icon: "dumbbell", name: "Exercise", goalAmount: 3, currentAmount: 0 },
  { icon: "book", name: "Read", goalAmount: 5, currentAmount: 2 },
  { icon: "water", name: "Drink Water", goalAmount: 8, currentAmount: 4 },
];

export default function HomeScreen() {
  const [habitsArr, setHabits] = useState(defaultHabits);
  const [isLoading, setIsLoading] = useState(true);

  // Load habits from storage on mount
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const storedHabits =
          await storage.getItem<typeof defaultHabits>(STORAGE_KEY);
        if (storedHabits) {
          setHabits(storedHabits);
        }
      } catch (error) {
        console.error("Error loading habits:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHabits();
  }, []);

  // Save habits to storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      const saveHabits = async () => {
        try {
          await storage.setItem(STORAGE_KEY, habitsArr);
        } catch (error) {
          console.error("Error saving habits:", error);
        }
      };

      saveHabits();
    }
  }, [habitsArr, isLoading]);

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

  return (
    <SafeAreaView className="flex-1 bg-bg gap-4 p-2">
      <View className="flex-row justify-end gap-4">
        <Pressable className="bg-card p-2 rounded-full">
          <Text className="text-text">Edit</Text>
        </Pressable>
        <Pressable className="bg-card p-2 rounded-full">
          <Text className="text-text">+</Text>
        </Pressable>
      </View>
      <View>
        <Text className="text-text font-bold text-3xl">Today (Hard Coded)</Text>
      </View>
      <View className="items-center">
        <CircularProgress value={64} activeStrokeColor={"#3b82f6"} />
      </View>
      <View>
        {habitsArr.map((habit, index) => (
          <HabitCard
            key={index}
            icon={habit.icon}
            name={habit.name}
            goalAmount={habit.goalAmount}
            currentAmount={habit.currentAmount}
            onIncrement={(newAmount) => {
              handleIncrement(index, newAmount);
            }}
          />
        ))}
      </View>
      <View>
        <Text className="text-text font-bold text-2xl ">Weekly Goals</Text>
        <HabitCard />
        <HabitCard />
        <HabitCard />
      </View>
    </SafeAreaView>
  );
}

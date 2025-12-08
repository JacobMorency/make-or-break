import { View, Text, Pressable } from "react-native";
import HabitCard from "@/components/habitcard/habitcard";
import CircleProgress from "@/components/homepage/circle-progress";
import { useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import CircularProgress from "react-native-circular-progress-indicator";

export default function HomeScreen() {
  // Example habit data - in real app, this will come from state/API
  const [habits, setHabits] = useState([
    { icon: "dumbbell", name: "Exercise", goalAmount: 3, currentAmount: 0 },
    { icon: "book", name: "Read", goalAmount: 5, currentAmount: 2 },
    { icon: "water", name: "Drink Water", goalAmount: 8, currentAmount: 4 },
  ]);

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
        <Text className="text-text font-bold text-2xl">Weekly Goals</Text>
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

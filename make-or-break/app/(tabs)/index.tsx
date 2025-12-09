import { View, Text, Pressable } from "react-native";
import HabitCard from "@/components/habitcard/habitcard";
import { useState } from "react";
import { useRouter } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import CircularProgress from "react-native-circular-progress-indicator";

import HabitDetailModal from "@/components/habit-detail-modal";

export default function HomeScreen() {
  const router = useRouter();

  // Example habit data - in real app, this will come from state/API
  const [habits, setHabits] = useState([
    { icon: "dumbbell", name: "Exercise", goalAmount: 3, currentAmount: 0 },
    { icon: "book", name: "Read", goalAmount: 5, currentAmount: 2 },
    { icon: "water", name: "Drink Water", goalAmount: 8, currentAmount: 4 },
  ]);

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

  const addHabit = (
    icon: string,
    name: string,
    goalAmount: number,
    currentAmount: number
  ): void => {
    setHabits((prevHabits) => {
      const updated = [...prevHabits];
      updated.push({
        icon: icon,
        name: name,
        goalAmount: goalAmount,
        currentAmount: currentAmount,
      });
      return updated;
    });
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-bg gap-4 p-2">
        <View className="flex-row justify-end gap-4">
          <Pressable className="bg-card p-2 rounded-full">
            <Text className="text-text">Edit</Text>
          </Pressable>
          <Pressable
            className="bg-card p-2 rounded-full"
            onPress={() => router.push("/add-habit")}
          >
            <Text className="text-text">+</Text>
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
        <View>
          <Text className="text-text font-bold text-2xl ">Weekly Goals</Text>
          <HabitCard />
          <HabitCard />
          <HabitCard />
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

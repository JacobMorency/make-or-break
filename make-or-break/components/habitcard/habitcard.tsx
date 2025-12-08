import { View, Text, Pressable, Modal } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CircleProgressButton from "@/components/habitcard/circle-progress-button";
import { useState } from "react";

type HabitCardProps = {
  icon?: string;
  name?: string;
  goalAmount?: number;
  currentAmount?: number;
  onIncrement?: (newAmount: number) => void;
};

export default function HabitCard({
  icon = "question-circle",
  name = "Default Name",
  goalAmount = 0,
  currentAmount = 0,
  onIncrement,
}: HabitCardProps) {
  return (
    <View>
      <Pressable
        className="bg-card flex-row p-2 rounded-xl items-center justify-between my-1"
        onPress={() => {
          console.log("modal opens");
        }}
      >
        <View className="flex-row items-center gap-3">
          <FontAwesome5 name={icon} size={24} color="text" />
          <View>
            <Text className="text-text">{name}</Text>
            <Text className="text-text text-xs">Goal: {goalAmount}</Text>
          </View>
        </View>
        <CircleProgressButton
          currentAmount={currentAmount}
          targetAmount={3}
          setCurrentAmount={(newAmount) => {
            onIncrement?.(newAmount);
          }}
        />
      </Pressable>
    </View>
  );
}

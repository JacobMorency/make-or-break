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
  onPress?: () => void;
};

export default function HabitCard({
  icon = "question-circle",
  name = "Default Name",
  goalAmount = 0,
  currentAmount = 0,
  onIncrement,
  onPress,
}: HabitCardProps) {
  return (
    <View>
      <Pressable
        className="bg-card flex-row p-2 rounded-xl items-center justify-between my-1 shadow-sm"
        onPress={onPress}
      >
        <View className="flex-row items-center gap-3">
          <View className="w-10">
            <FontAwesome5 name={icon} size={24} color="text" />
          </View>
          <View>
            <Text className="text-text font-bold">{name}</Text>
            <Text className="text-text text-xs">Goal: {goalAmount}</Text>
          </View>
        </View>
        <CircleProgressButton
          currentAmount={currentAmount}
          targetAmount={goalAmount}
          setCurrentAmount={(newAmount) => {
            onIncrement?.(newAmount);
          }}
        />
      </Pressable>
    </View>
  );
}

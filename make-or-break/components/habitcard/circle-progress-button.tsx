import { View, Text, Pressable } from "react-native";
import { useState } from "react";

type CircleProgressButtonProps = {
  currentAmount: number;
  targetAmount: number;
  setCurrentAmount: (amount: number) => void;
};

export default function CircleProgressButton({
  currentAmount,
  targetAmount,
  setCurrentAmount,
}: CircleProgressButtonProps) {
  return (
    <View>
      <Pressable
        className="bg-bg rounded-full w-12 h-12 items-center justify-center"
        onPress={() => {
          setCurrentAmount(currentAmount + 1);
        }}
      >
        <Text className="text-text">{currentAmount}</Text>
      </Pressable>
    </View>
  );
}

import { View, Text, Pressable } from "react-native";
import { useState } from "react";
import CircularProgress from "react-native-circular-progress-indicator";

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
        className="items-center justify-center"
        onPress={() => {
          setCurrentAmount(currentAmount + 1);
        }}
      >
        <CircularProgress
          value={currentAmount}
          title={currentAmount === targetAmount ? "Done" : ""}
          radius={24}
          maxValue={targetAmount}
          activeStrokeColor={"#3b82f6"}
        />
        {/* <Text className="text-text">{currentAmount}</Text> */}
      </Pressable>
    </View>
  );
}

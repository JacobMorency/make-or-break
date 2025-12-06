import { View, Text, Pressable } from "react-native";
import { useState } from "react";

export default function CircleProgressButton() {
  const [timesPressed, setTimesPressed] = useState(0);
  return (
    <View>
      <Pressable
        className="bg-bg rounded-full w-12 h-12 items-center justify-center"
        onPress={() => {
          setTimesPressed((current) => current + 1);
        }}
      >
        <Text className="text-text">{timesPressed}</Text>
      </Pressable>
    </View>
  );
}

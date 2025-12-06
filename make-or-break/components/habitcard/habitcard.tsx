import { View, Text } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CircleProgressButton from "@/components/habitcard/circle-progress-button";

export default function HabitCard() {
  return (
    <View className="bg-card flex-row p-2 rounded-xl items-center justify-between my-1">
      <View className="flex-row items-center gap-3">
        <FontAwesome5 name="question-circle" size={24} color="text" />
        <View>
          <Text className="text-text">Habit Name</Text>
          <Text className="text-text text-xs">Goal: 0</Text>
        </View>
      </View>
      <CircleProgressButton />
    </View>
  );
}

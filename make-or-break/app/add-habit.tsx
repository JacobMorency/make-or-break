import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddHabitScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-text text-2xl font-bold">Add New Habit</Text>
      </View>
    </SafeAreaView>
  );
}

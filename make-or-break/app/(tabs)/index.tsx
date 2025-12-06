import { View, Text } from "react-native";
import HabitCard from "@/components/habitcard/habitcard";
import CircleProgress from "@/components/homepage/circle-progress";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg gap-4">
      <View>
        <Text className="text-text font-bold text-3xl">Today (Hard Coded)</Text>
      </View>
      <View className="items-center">
        <CircleProgress />
      </View>
      <HabitCard />
      <View>
        <Text className="text-text font-bold text-2xl ">Weekly Goals</Text>
        <HabitCard />
        <HabitCard />
        <HabitCard />
      </View>
    </SafeAreaView>
  );
}

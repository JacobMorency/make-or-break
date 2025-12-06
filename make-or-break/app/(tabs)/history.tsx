import { View, Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-bg-dark">
      <View>
        <Text className="text-text dark:text-text">Testing Text history</Text>
      </View>
    </SafeAreaView>
  );
}

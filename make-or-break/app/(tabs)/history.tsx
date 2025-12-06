import { View, Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg ">
      <View>
        <Text className="text-text ">Testing Text history</Text>
      </View>
    </SafeAreaView>
  );
}

import { View, Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-bg-dark">
      <View>
        <Text className="text-primary">Testing Text</Text>
      </View>
    </SafeAreaView>
  );
}

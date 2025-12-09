import { View, Text, Pressable } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type AddHabitCardProps = {
  icon: string;
  name: string;
  onPress?: () => void;
};

export default function AddHabitCard({
  icon = "question-circle",
  name = "Default Name",
  onPress,
}: AddHabitCardProps) {
  return (
    <View>
      <Pressable
        className="bg-card flex-row p-2 rounded-xl items-center justify-between my-1 shadow-sm h-16"
        onPress={onPress}
      >
        <View className="flex-row gap-3 items-center">
          <View className="w-10">
            <FontAwesome5 name={icon} size={24} />
          </View>
          <Text className="text-text">{name}</Text>
        </View>
      </Pressable>
    </View>
  );
}

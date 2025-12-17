import { View, Text, Pressable } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import CircleProgressButton from "@/components/habitcard/circle-progress-button";

type HabitCardProps = {
  id: string;
  icon?: string;
  name?: string;
  goalAmount?: number;
  currentAmount?: number;
  onIncrement?: (newAmount: number) => void;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isEditMode?: boolean;
};

export default function HabitCard({
  id,
  icon = "question-circle",
  name = "Default Name",
  goalAmount = 0,
  currentAmount = 0,
  onIncrement,
  onPress,
  onEdit,
  onDelete,
  isEditMode = false,
}: HabitCardProps) {
  return (
    <View>
      <Pressable
        className="bg-card flex-row p-2 rounded-xl items-center justify-between my-1 shadow-sm"
        onPress={onPress}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <View className="w-10">
            <FontAwesome5 name={icon} size={24} color="#3b82f6" />
          </View>
          <View className="flex-1">
            <Text className="text-text font-bold">{name}</Text>
            <Text className="text-text text-xs">Goal: {goalAmount}</Text>
          </View>
        </View>
        <View
          className={`h-12 items-center justify-center flex-row ${
            isEditMode ? "w-24" : "w-12"
          }`}
        >
          {isEditMode ? (
            <View className="flex-row gap-2 items-center justify-center">
              {onEdit && (
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="bg-primary w-10 h-10 rounded-full items-center justify-center"
                >
                  <AntDesign name="edit" size={18} color="white" />
                </Pressable>
              )}
              {onDelete && (
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="bg-red-500 w-10 h-10 rounded-full items-center justify-center"
                >
                  <AntDesign name="delete" size={18} color="white" />
                </Pressable>
              )}
            </View>
          ) : (
            <View className="items-center justify-center">
              <CircleProgressButton
                currentAmount={currentAmount}
                targetAmount={goalAmount}
                setCurrentAmount={(newAmount) => {
                  onIncrement?.(newAmount);
                }}
              />
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
}

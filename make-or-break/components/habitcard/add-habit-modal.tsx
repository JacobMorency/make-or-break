import { useState, useEffect } from "react";
import { Modal, View, Text, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";

type HabitTemplate = {
  icon: string;
  name: string;
};

type AddHabitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  habitTemplate: HabitTemplate | null;
  onSave?: (habit: { icon: string; name: string; goalAmount: number }) => void;
};

export default function AddHabitModal({
  isOpen,
  onClose,
  habitTemplate,
  onSave,
}: AddHabitModalProps) {
  const [habitName, setHabitName] = useState("");
  const [goalAmount, setGoalAmount] = useState("1");
  const [selectedIcon, setSelectedIcon] = useState("question-circle");

  const CUSTOM_HABIT_TEXT = "Create a custom habit";

  useEffect(() => {
    if (habitTemplate) {
      setHabitName(habitTemplate.name);
      setSelectedIcon(habitTemplate.icon);
    } else {
      setHabitName("");
      setSelectedIcon("question-circle");
    }
    setGoalAmount("1");
  }, [habitTemplate]);

  const handleSave = () => {
    const goal = parseInt(goalAmount) || 1;
    if (habitName.trim() && goal > 0) {
      onSave?.({
        icon: selectedIcon,
        name: habitName.trim(),
        goalAmount: goal,
      });
      onClose();
    }
  };

  const isFormValid = habitName.trim().length > 0 && parseInt(goalAmount) > 0;

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 pt-12">
        <View className="bg-card rounded-t-3xl p-6 flex-1">
          <SafeAreaView className="flex-1">
            {/* Header */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-6">
                <Pressable
                  onPress={onClose}
                  className="bg-card/25 rounded-full w-12 h-12 items-center justify-center"
                >
                  <AntDesign name="close" size={24} color="white" />
                </Pressable>
                <Text className="text-text font-bold text-2xl">New Habit</Text>
                <Pressable
                  onPress={handleSave}
                  disabled={!isFormValid}
                  className={`rounded-full w-12 h-12 items-center justify-center ${
                    isFormValid ? "bg-primary" : "bg-gray-400"
                  }`}
                >
                  <AntDesign name="check" size={24} color="white" />
                </Pressable>
              </View>

              {/* Habit Name Input */}
              <View className="mb-4">
                <Text className="text-text text-sm font-semibold mb-2">
                  Habit Name
                </Text>
                <View className="bg-bg rounded-xl p-4">
                  <TextInput
                    value={habitName === CUSTOM_HABIT_TEXT ? "" : habitName}
                    onChangeText={setHabitName}
                    placeholder="Enter habit name"
                    placeholderTextColor="#9CA3AF"
                    className="text-text text-base"
                    autoFocus={true}
                  />
                </View>
              </View>

              {/* Goal Amount Input */}
              <View className="mb-4">
                <Text className="text-text text-sm font-semibold mb-2">
                  Daily Goal
                </Text>
                <View className="bg-bg rounded-xl p-4">
                  <View className="flex-row items-center">
                    <TextInput
                      value={goalAmount}
                      onChangeText={setGoalAmount}
                      placeholder="1"
                      placeholderTextColor="#9CA3AF"
                      className="text-text text-base flex-1"
                      keyboardType="numeric"
                    />
                    <Text className="text-text ml-2">times per day</Text>
                  </View>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

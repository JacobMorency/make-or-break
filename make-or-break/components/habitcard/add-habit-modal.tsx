import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
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
  const [currentView, setCurrentView] = useState<"form" | "iconSelector">(
    "form"
  );

  const CUSTOM_HABIT_TEXT = "Create a custom habit";

  // Common FontAwesome5 icons for habits
  const availableIcons = [
    "dumbbell",
    "book",
    "water",
    "tooth",
    "walking",
    "heart",
    "star",
    "fire",
    "moon",
    "sun",
    "coffee",
    "apple",
    "bicycle",
    "running",
    "meditation",
    "music",
    "camera",
    "pencil",
    "laptop",
    "phone",
    "bed",
    "utensils",
    "shopping-cart",
    "gamepad",
    "paint-brush",
  ];

  useEffect(() => {
    if (habitTemplate) {
      setHabitName(habitTemplate.name);
      setSelectedIcon(habitTemplate.icon);
    } else {
      setHabitName("");
      setSelectedIcon("question-circle");
    }
    setGoalAmount("1");
    setCurrentView("form"); // Reset to form view when modal opens/closes
  }, [habitTemplate, isOpen]);

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
            {currentView === "form" ? (
              <FormView
                habitName={habitName}
                setHabitName={setHabitName}
                goalAmount={goalAmount}
                setGoalAmount={setGoalAmount}
                selectedIcon={selectedIcon}
                onIconPress={() => setCurrentView("iconSelector")}
                onClose={onClose}
                onSave={handleSave}
                isFormValid={isFormValid}
                customHabitText={CUSTOM_HABIT_TEXT}
              />
            ) : (
              <IconSelectorView
                availableIcons={availableIcons}
                selectedIcon={selectedIcon}
                onSelectIcon={(icon) => {
                  setSelectedIcon(icon);
                  setCurrentView("form");
                }}
                onBack={() => setCurrentView("form")}
              />
            )}
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

// Form View Component
type FormViewProps = {
  habitName: string;
  setHabitName: (name: string) => void;
  goalAmount: string;
  setGoalAmount: (amount: string) => void;
  selectedIcon: string;
  onIconPress: () => void;
  onClose: () => void;
  onSave: () => void;
  isFormValid: boolean;
  customHabitText: string;
};

function FormView({
  habitName,
  setHabitName,
  goalAmount,
  setGoalAmount,
  selectedIcon,
  onIconPress,
  onClose,
  onSave,
  isFormValid,
  customHabitText,
}: FormViewProps) {
  return (
    <View className="flex-1">
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
            onPress={onSave}
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
              value={habitName === customHabitText ? "" : habitName}
              onChangeText={setHabitName}
              placeholder="Enter habit name"
              placeholderTextColor="#9CA3AF"
              className="text-text"
              autoFocus={true}
            />
          </View>
        </View>

        {/* Icon Selector */}
        <View className="mb-4">
          <Text className="text-text text-sm font-semibold mb-2">Icon</Text>
          <Pressable
            className="flex-row items-center justify-between bg-bg rounded-xl p-4"
            onPress={onIconPress}
          >
            <View className="flex-row items-center gap-3">
              <FontAwesome5 name={selectedIcon} size={24} color="#3b82f6" />
              <Text className="text-text">Select Icon</Text>
            </View>
            <AntDesign name="right" size={20} color="#9CA3AF" />
          </Pressable>
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
    </View>
  );
}

// Icon Selector View Component
type IconSelectorViewProps = {
  availableIcons: string[];
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
  onBack: () => void;
};

function IconSelectorView({
  availableIcons,
  selectedIcon,
  onSelectIcon,
  onBack,
}: IconSelectorViewProps) {
  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Pressable
          onPress={onBack}
          className="bg-card/25 rounded-full w-12 h-12 items-center justify-center"
        >
          <AntDesign name="left" size={24} color="white" />
        </Pressable>
        <Text className="text-text font-bold text-2xl"></Text>
        <View className="w-12" />
      </View>

      {/* Icon Grid */}
      <ScrollView className="flex-1">
        <View className="flex-row flex-wrap gap-4 justify-center">
          {availableIcons.map((iconName) => (
            <Pressable
              key={iconName}
              onPress={() => onSelectIcon(iconName)}
              className={`w-16 h-16 rounded-xl items-center justify-center ${
                selectedIcon === iconName ? "bg-primary" : "bg-bg"
              }`}
            >
              <FontAwesome5
                name={iconName}
                size={32}
                color={selectedIcon === iconName ? "white" : "#3b82f6"}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

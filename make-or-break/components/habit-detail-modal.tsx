import { useState, useEffect } from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { CircularProgressBase } from "react-native-circular-progress-indicator";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type Habit = {
  icon: string;
  name: string;
  goalAmount: number;
  currentAmount: number;
};

type HabitDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
  onUpdate: (newAmount: number) => void;
};

export default function HabitDetailModal({
  isOpen,
  onClose,
  habit,
  onUpdate,
}: HabitDetailModalProps) {
  if (!habit) return null;

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <ModalOverlay habit={habit} onClose={onClose} onUpdate={onUpdate} />
    </Modal>
  );
}

function ModalOverlay({
  habit,
  onClose,
  onUpdate,
}: {
  habit: Habit;
  onClose: () => void;
  onUpdate: (newAmount: number) => void;
}) {
  const [currentAmount, setCurrentAmount] = useState(habit.currentAmount);

  useEffect(() => {
    setCurrentAmount(habit.currentAmount);
  }, [habit.currentAmount]);

  const handleClose = () => {
    onUpdate(currentAmount);
    onClose();
  };

  const handleIncrement = () => {
    setCurrentAmount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setCurrentAmount((prev) => Math.max(0, prev - 1));
  };

  const isExactlyComplete = currentAmount === habit.goalAmount;
  const isComplete = currentAmount >= habit.goalAmount;
  const progressValue = isComplete ? habit.goalAmount : currentAmount;

  return (
    <View className="flex-1 bg-black/50 justify-end">
      <View className="bg-card rounded-t-3xl p-6">
        <View className="mb-6">
          <Text className="text-text font-bold text-4xl mb-2 text-center">
            {habit.name}
          </Text>
          <Text className="text-text text-center">
            Goal: {habit.goalAmount}
          </Text>
        </View>

        <View className="flex-row items-center justify-center mb-6">
          <Pressable
            onPress={handleDecrement}
            disabled={currentAmount === 0}
            className={`w-16 h-16 rounded-full items-center justify-center ${
              currentAmount === 0 ? "bg-gray-300 opacity-50" : "bg-primary"
            }`}
          >
            <FontAwesome5 name="minus" size={24} color="white" />
          </Pressable>

          <View className="mx-8">
            <CircularProgressBase
              value={progressValue}
              radius={70}
              maxValue={habit.goalAmount}
              activeStrokeColor={"#3b82f6"}
            >
              {isExactlyComplete ? (
                <FontAwesome5 name={"check"} size={32} color="#3b82f6" />
              ) : (
                <Text className="text-primary font-bold text-3xl">
                  {currentAmount}
                </Text>
              )}
            </CircularProgressBase>
          </View>

          <Pressable
            onPress={handleIncrement}
            className="w-16 h-16 rounded-full bg-primary items-center justify-center"
          >
            <FontAwesome5 name="plus" size={24} color="white" />
          </Pressable>
        </View>

        <Pressable
          onPress={handleClose}
          className="bg-card py-3 px-6 rounded-xl items-center"
        >
          <Text className="text-text font-semibold text-base">Close</Text>
        </Pressable>
      </View>
    </View>
  );
}

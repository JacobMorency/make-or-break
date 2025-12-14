import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddHabitCard from "@/components/add-habit-card";
import { useState } from "react";
import { useRouter } from "expo-router";
import AddHabitModal from "@/components/habitcard/add-habit-modal";
import { storage } from "@/utils/asyncStorage";

const STORAGE_KEY = "habits";

type HabitTemplate = {
  icon: string;
  name: string;
};

export default function AddHabitScreen() {
  const router = useRouter();

  const [habitTemplates, setHabitTemplates] = useState<HabitTemplate[]>([
    {
      icon: "water",
      name: "Drink water",
    },
    {
      icon: "tooth",
      name: "Brush teeth",
    },
    {
      icon: "walking",
      name: "Do cardio",
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] =
    useState<HabitTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardPress = (template: HabitTemplate) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleSaveHabit = async (habit: {
    icon: string;
    name: string;
    goalAmount: number;
  }) => {
    try {
      const existingHabits =
        (await storage.getItem<
          Array<{
            icon: string;
            name: string;
            goalAmount: number;
            currentAmount: number;
          }>
        >(STORAGE_KEY)) || [];

      const newHabit = {
        ...habit,
        currentAmount: 0,
      };

      await storage.setItem(STORAGE_KEY, [...existingHabits, newHabit]);

      router.back();
    } catch (error) {
      console.error("Error saving habit:", error);
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-bg p-2">
        <View>
          <Text className="text-text text-3xl font-bold">Add New Habit</Text>
          <View>
            <AddHabitCard
              icon="plus-circle"
              name="Create a custom habit"
              onPress={() =>
                handleCardPress({
                  icon: "plus-circle",
                  name: "Create a custom habit",
                })
              }
            />
          </View>
          <View className="mt-3">
            <Text className="text-text text-xl">Templates</Text>
            {habitTemplates.map((template, index) => (
              <AddHabitCard
                key={index}
                icon={template.icon}
                name={template.name}
                onPress={() => handleCardPress(template)}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        habitTemplate={selectedTemplate}
        onSave={handleSaveHabit}
      />
    </>
  );
}

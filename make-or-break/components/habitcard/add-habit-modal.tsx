import { Modal, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type HabitTemplate = {
  icon: string;
  name: string;
};

type AddHabitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  habitTemplate: HabitTemplate | null;
};

export default function AddHabitModal({
  isOpen,
  onClose,
  habitTemplate,
}: AddHabitModalProps) {
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
            <View className="mb-6">
              <Text className="text-text font-bold text-2xl mb-2 text-center">
                {habitTemplate ? habitTemplate.name : "Add Habit Details"}
              </Text>
              {habitTemplate && (
                <View className="items-center mt-4">
                  <FontAwesome5
                    name={habitTemplate.icon}
                    size={48}
                    color="#3b82f6"
                  />
                </View>
              )}
            </View>

            <View className="mb-6">
              <Text className="text-text text-center">
                Habit configuration will go here
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              className="bg-primary py-3 px-6 rounded-xl items-center"
            >
              <Text className="text-white font-semibold text-base">Close</Text>
            </Pressable>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { storage } from "@/utils/asyncStorage";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import type { Habit } from "@/types/habit";

const STORAGE_KEY = "habits";

export default function DevStorageScreen() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Habit | null>(null);

  const loadHabits = async () => {
    try {
      const stored = await storage.getItem<Habit[]>(STORAGE_KEY);
      setHabits(stored || []);
    } catch (error) {
      console.error("Error loading:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const saveHabits = async (newHabits: Habit[]) => {
    try {
      await storage.setItem(STORAGE_KEY, newHabits);
      setHabits(newHabits);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleDelete = (index: number) => {
    const updated = habits.filter((_, i) => i !== index);
    saveHabits(updated);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...habits[index] });
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editForm) {
      const updated = [...habits];
      updated[editingIndex] = editForm;
      saveHabits(updated);
      setEditingIndex(null);
      setEditForm(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditForm(null);
  };

  const handleClearAll = () => {
    saveHabits([]);
  };

  const handleAddTestHabit = () => {
    const newHabit: Habit = {
      icon: "star",
      name: "Test Habit",
      goalAmount: 5,
      currentAmount: 0,
    };
    saveHabits([...habits, newHabit]);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-bg">
        <View className="flex-1 items-center justify-center">
          <Text className="text-text">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary text-lg">← Back</Text>
          </Pressable>
          <Text className="text-text font-bold text-2xl">
            Dev Storage Editor
          </Text>
          <View className="w-16" />
        </View>

        {/* Actions */}
        <View className="flex-row gap-2 mb-6">
          <Pressable
            onPress={handleAddTestHabit}
            className="bg-primary px-4 py-2 rounded-lg flex-1"
          >
            <Text className="text-white text-center font-semibold">
              Add Test Habit
            </Text>
          </Pressable>
          <Pressable
            onPress={handleClearAll}
            className="bg-red-500 px-4 py-2 rounded-lg flex-1"
          >
            <Text className="text-white text-center font-semibold">
              Clear All
            </Text>
          </Pressable>
          <Pressable
            onPress={loadHabits}
            className="bg-card px-4 py-2 rounded-lg flex-1"
          >
            <Text className="text-text text-center font-semibold">Reload</Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View className="bg-card p-4 rounded-xl mb-6">
          <Text className="text-text font-bold text-lg mb-2">
            Storage Stats
          </Text>
          <Text className="text-text">Total Habits: {habits.length}</Text>
          <Text className="text-text">
            Storage Key: <Text className="font-mono">{STORAGE_KEY}</Text>
          </Text>
        </View>

        {/* Habits List */}
        <View className="mb-6">
          <Text className="text-text font-bold text-lg mb-4">
            Habits ({habits.length})
          </Text>
          {habits.length === 0 ? (
            <View className="bg-card p-6 rounded-xl items-center">
              <Text className="text-text/70">No habits stored</Text>
            </View>
          ) : (
            habits.map((habit, index) => (
              <View key={index} className="bg-card p-4 rounded-xl mb-3">
                {editingIndex === index ? (
                  // Edit Mode
                  <View>
                    <View className="mb-3">
                      <Text className="text-text text-sm font-semibold mb-1">
                        Icon
                      </Text>
                      <TextInput
                        value={editForm?.icon || ""}
                        onChangeText={(text) =>
                          setEditForm({ ...editForm!, icon: text })
                        }
                        className="bg-bg p-3 rounded-lg text-text"
                        placeholder="icon name"
                      />
                    </View>
                    <View className="mb-3">
                      <Text className="text-text text-sm font-semibold mb-1">
                        Name
                      </Text>
                      <TextInput
                        value={editForm?.name || ""}
                        onChangeText={(text) =>
                          setEditForm({ ...editForm!, name: text })
                        }
                        className="bg-bg p-3 rounded-lg text-text"
                        placeholder="habit name"
                      />
                    </View>
                    <View className="mb-3">
                      <Text className="text-text text-sm font-semibold mb-1">
                        Goal Amount
                      </Text>
                      <TextInput
                        value={editForm?.goalAmount.toString() || ""}
                        onChangeText={(text) =>
                          setEditForm({
                            ...editForm!,
                            goalAmount: parseInt(text) || 0,
                          })
                        }
                        className="bg-bg p-3 rounded-lg text-text"
                        keyboardType="numeric"
                        placeholder="goal"
                      />
                    </View>
                    <View className="mb-3">
                      <Text className="text-text text-sm font-semibold mb-1">
                        Current Amount
                      </Text>
                      <TextInput
                        value={editForm?.currentAmount.toString() || ""}
                        onChangeText={(text) =>
                          setEditForm({
                            ...editForm!,
                            currentAmount: parseInt(text) || 0,
                          })
                        }
                        className="bg-bg p-3 rounded-lg text-text"
                        keyboardType="numeric"
                        placeholder="current"
                      />
                    </View>
                    <View className="flex-row gap-2">
                      <Pressable
                        onPress={handleSaveEdit}
                        className="bg-primary px-4 py-2 rounded-lg flex-1"
                      >
                        <Text className="text-white text-center font-semibold">
                          Save
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={handleCancelEdit}
                        className="bg-card px-4 py-2 rounded-lg flex-1"
                      >
                        <Text className="text-text text-center font-semibold">
                          Cancel
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  // View Mode
                  <View>
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center gap-3">
                        <FontAwesome5
                          name={habit.icon}
                          size={24}
                          color="#3b82f6"
                        />
                        <Text className="text-text font-bold text-lg">
                          {habit.name}
                        </Text>
                      </View>
                    </View>
                    <View className="mb-3">
                      <Text className="text-text/70 text-sm">
                        Goal: {habit.goalAmount} | Current:{" "}
                        {habit.currentAmount}
                      </Text>
                    </View>
                    <View className="flex-row gap-2">
                      <Pressable
                        onPress={() => handleEdit(index)}
                        className="bg-primary px-4 py-2 rounded-lg flex-1"
                      >
                        <Text className="text-white text-center font-semibold">
                          Edit
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleDelete(index)}
                        className="bg-red-500 px-4 py-2 rounded-lg flex-1"
                      >
                        <Text className="text-white text-center font-semibold">
                          Delete
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            ))
          )}
        </View>

        {/* Raw JSON View */}
        <View className="bg-card p-4 rounded-xl mb-6">
          <Text className="text-text font-bold text-lg mb-2">Raw JSON</Text>
          <ScrollView className="bg-bg p-3 rounded-lg max-h-40">
            <Text className="text-text font-mono text-xs">
              {JSON.stringify(habits, null, 2)}
            </Text>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

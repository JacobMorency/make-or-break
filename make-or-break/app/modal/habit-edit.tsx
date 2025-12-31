import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useHabitsStore } from "@/src/features/habits/store/habitsStore";
import { generateId } from "@/src/lib/id";
import { useColors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { radius } from "@/src/theme/radius";
import {
  ScreenTitle,
  CardTitle,
  CardSubtitle,
  Text,
} from "@/src/components/ui/Text";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function HabitEditModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const colors = useColors();
  const { habits, createHabit, updateHabit } = useHabitsStore();

  const isEditing = !!params.id;
  const existingHabit = isEditing
    ? habits.find((h) => h.id === params.id)
    : null;

  const [name, setName] = useState("");
  const [cadence, setCadence] = useState<"daily" | "weekly">("daily");
  const [polarity, setPolarity] = useState<"build" | "break">("build");
  const [goal, setGoal] = useState("1");
  const [step, setStep] = useState("1");
  const [iconKey, setIconKey] = useState("star.fill");

  useEffect(() => {
    if (existingHabit) {
      setName(existingHabit.name);
      setCadence(existingHabit.cadence);
      setPolarity(existingHabit.polarity);
      setGoal(existingHabit.goal.toString());
      setStep(existingHabit.step.toString());
      setIconKey(existingHabit.iconKey);
    }
  }, [existingHabit]);

  const handleSave = () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a habit name");
      return;
    }

    const goalNum = parseInt(goal, 10);
    const stepNum = parseInt(step, 10);

    if (isNaN(goalNum) || goalNum <= 0) {
      Alert.alert("Error", "Goal must be greater than 0");
      return;
    }

    if (isNaN(stepNum) || stepNum <= 0) {
      Alert.alert("Error", "Step must be greater than 0");
      return;
    }

    if (isEditing && existingHabit) {
      updateHabit(params.id!, {
        name: name.trim(),
        cadence,
        polarity,
        goal: goalNum,
        step: stepNum,
        iconKey,
      });
    } else {
      createHabit({
        name: name.trim(),
        cadence,
        polarity,
        goal: goalNum,
        step: stepNum,
        iconKey,
      });
    }

    router.back();
  };

  const styles = getStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <IconSymbol name="xmark" size={20} color={colors.textPrimary} />
          </Pressable>
          <ScreenTitle>{isEditing ? "Edit Habit" : "New Habit"}</ScreenTitle>
          <View style={styles.placeholder} />
        </View>

        {/* Name Input */}
        <View style={styles.section}>
          <CardSubtitle style={styles.label}>Name</CardSubtitle>
          <TextInput
            testID="habit-name-input"
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter habit name"
            placeholderTextColor={colors.textTertiary}
            autoFocus
          />
        </View>

        {/* Cadence Toggle */}
        <View style={styles.section}>
          <CardSubtitle style={styles.label}>Frequency</CardSubtitle>
          <View style={styles.toggleContainer}>
            <Pressable
              style={[
                styles.toggleOption,
                cadence === "daily" && styles.toggleOptionActive,
              ]}
              onPress={() => setCadence("daily")}
            >
              <Text
                variant="cardTitle"
                style={
                  cadence === "daily"
                    ? styles.toggleTextActive
                    : styles.toggleText
                }
              >
                Daily
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.toggleOption,
                cadence === "weekly" && styles.toggleOptionActive,
              ]}
              onPress={() => setCadence("weekly")}
            >
              <Text
                variant="cardTitle"
                style={
                  cadence === "weekly"
                    ? styles.toggleTextActive
                    : styles.toggleText
                }
              >
                Weekly
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Polarity Toggle */}
        <View style={styles.section}>
          <CardSubtitle style={styles.label}>Type</CardSubtitle>
          <View style={styles.toggleContainer}>
            <Pressable
              style={[
                styles.toggleOption,
                polarity === "build" && styles.toggleOptionActive,
              ]}
              onPress={() => setPolarity("build")}
            >
              <Text
                variant="cardTitle"
                style={
                  polarity === "build"
                    ? styles.toggleTextActive
                    : styles.toggleText
                }
              >
                Build
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.toggleOption,
                polarity === "break" && styles.toggleOptionActive,
              ]}
              onPress={() => setPolarity("break")}
            >
              <Text
                variant="cardTitle"
                style={
                  polarity === "break"
                    ? styles.toggleTextActive
                    : styles.toggleText
                }
              >
                Break
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Goal Input */}
        <View style={styles.section}>
          <CardSubtitle style={styles.label}>Goal</CardSubtitle>
          <TextInput
            style={styles.input}
            value={goal}
            onChangeText={setGoal}
            placeholder="Enter goal number"
            placeholderTextColor={colors.textTertiary}
            keyboardType="number-pad"
          />
        </View>

        {/* Step Input */}
        <View style={styles.section}>
          <CardSubtitle style={styles.label}>
            Step (increment amount)
          </CardSubtitle>
          <TextInput
            style={styles.input}
            value={step}
            onChangeText={setStep}
            placeholder="Enter step (default: 1)"
            placeholderTextColor={colors.textTertiary}
            keyboardType="number-pad"
          />
        </View>

        {/* Save Button */}
        <Pressable
          testID="save-habit-button"
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text variant="cardTitle" style={styles.saveButtonText}>
            Save
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.screenPadding,
      paddingBottom: spacing["5xl"],
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing["2xl"],
    },
    closeButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    placeholder: {
      width: 44,
    },
    section: {
      marginBottom: spacing["2xl"],
    },
    label: {
      marginBottom: spacing.md,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.base,
      borderWidth: 1,
      borderColor: colors.stroke,
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: "400",
    },
    toggleContainer: {
      flexDirection: "row",
      gap: spacing.md,
    },
    toggleOption: {
      flex: 1,
      padding: spacing.base,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.stroke,
      alignItems: "center",
      justifyContent: "center",
    },
    toggleOptionActive: {
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.primary,
    },
    toggleText: {
      color: colors.textSecondary,
    },
    toggleTextActive: {
      color: colors.textPrimary,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: radius.lg,
      padding: spacing.base,
      alignItems: "center",
      justifyContent: "center",
      marginTop: spacing["2xl"],
    },
    saveButtonText: {
      color: colors.textPrimary,
      fontWeight: "600",
    },
  });

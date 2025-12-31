import React, { useMemo } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useHabitsStore } from "@/src/features/habits/store/habitsStore";
import {
  getHabitCount,
  getWeeklyHabitCount,
} from "@/src/features/habits/model/selectors";
import { addDays, getWeekStartISO, formatDateISO } from "@/src/lib/date";
import { useColors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import {
  ScreenTitle,
  CardTitle,
  CardSubtitle,
  Text,
} from "@/src/components/ui/Text";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function HabitDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { habits, entries } = useHabitsStore();

  const habit = habits.find((h) => h.id === params.id);
  const styles = getStyles(colors);

  if (!habit) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.content}>
          <Text variant="cardTitle">Habit not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get last 14 days
  const last14Days = useMemo(() => {
    const days: string[] = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(formatDateISO(date));
    }
    return days;
  }, []);

  // Get weekly total for weekly habits
  const weeklyTotal = useMemo(() => {
    if (habit.cadence === "daily") return null;
    const today = new Date();
    const weekStart = getWeekStartISO(today);
    return getWeeklyHabitCount(habit.id, weekStart, entries);
  }, [habit, entries]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <IconSymbol
              name="chevron.left"
              size={20}
              color={colors.textPrimary}
            />
          </Pressable>
          <ScreenTitle>{habit.name}</ScreenTitle>
          <View style={styles.placeholder} />
        </View>

        {/* Weekly Total (for weekly habits) */}
        {habit.cadence === "weekly" && weeklyTotal !== null && (
          <View style={styles.section}>
            <CardSubtitle style={styles.sectionLabel}>This Week</CardSubtitle>
            <Text variant="screenTitle" style={styles.weeklyTotal}>
              {weeklyTotal} / {habit.goal}
            </Text>
          </View>
        )}

        {/* Last 14 Days */}
        <View style={styles.section}>
          <CardSubtitle style={styles.sectionLabel}>Last 14 Days</CardSubtitle>
          {last14Days.map((dateISO) => {
            const count = getHabitCount(habit.id, dateISO, entries);
            const date = new Date(dateISO + "T00:00:00");
            const dayName = date.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const dayNumber = date.getDate();
            const month = date.toLocaleDateString("en-US", { month: "short" });

            return (
              <View key={dateISO} style={styles.dayRow}>
                <View style={styles.dayInfo}>
                  <Text variant="cardTitle">{dayName}</Text>
                  <CardSubtitle>
                    {month} {dayNumber}
                  </CardSubtitle>
                </View>
                <View style={styles.dayCount}>
                  <Text variant="cardTitle">{count}</Text>
                </View>
              </View>
            );
          })}
        </View>
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
    sectionLabel: {
      marginBottom: spacing.base,
    },
    weeklyTotal: {
      fontSize: 48,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    dayRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: colors.stroke,
    },
    dayInfo: {
      flex: 1,
    },
    dayCount: {
      alignItems: "flex-end",
    },
  });

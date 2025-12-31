import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHabitsStore } from '@/src/features/habits/store/habitsStore';
import { HabitCard } from '@/src/features/habits/components/HabitCard';
import { getHabitProgress, getHabitCount, getWeeklyHabitCount } from '@/src/features/habits/model/selectors';
import { getWeekStartISO, todayISO } from '@/src/lib/date';
import { ScreenTitle } from '@/src/components/ui/Text';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

export default function HistoryScreen() {
  const router = useRouter();
  const { habits, entries, selectedDate } = useHabitsStore();
  const visibleHabits = habits.filter((h) => !h.archived);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ScreenTitle>History</ScreenTitle>
        </View>

        <View style={styles.habitsContainer}>
          {visibleHabits.map((habit) => {
            const progress = getHabitProgress(habit, selectedDate, entries);
            let count: number;
            if (habit.cadence === 'daily') {
              count = getHabitCount(habit.id, selectedDate, entries);
            } else {
              const weekStart = getWeekStartISO(selectedDate);
              count = getWeeklyHabitCount(habit.id, weekStart, entries);
            }
            return (
              <HabitCard
                key={habit.id}
                id={habit.id}
                name={habit.name}
                goal={habit.goal}
                cadence={habit.cadence}
                polarity={habit.polarity}
                progress={progress}
                count={count}
                onPress={() => router.push(`/habit/${habit.id}` as any)}
                onIncrement={() => {}}
                onDecrement={() => {}}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
    marginBottom: spacing.base,
  },
  habitsContainer: {
    paddingHorizontal: spacing.screenPadding,
  },
});


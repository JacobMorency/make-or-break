import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHabitsStore } from '@/src/features/habits/store/habitsStore';
import { useRouter as useRouterExpo } from 'expo-router';
import { getHabitProgress, getHabitCount, getOverallProgress, getWeeklyHabitCount } from '@/src/features/habits/model/selectors';
import { getWeekdayIndex, addDays, todayISO, getWeekStartISO } from '@/src/lib/date';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import { radius } from '@/src/theme/radius';
import { ScreenTitle, SectionTitle, Text } from '@/src/components/ui/Text';
import { Ring } from '@/src/components/ui/Ring';
import { WeekdaySelector } from '@/src/features/habits/components/WeekdaySelector';
import { HabitCard } from '@/src/features/habits/components/HabitCard';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
  const router = useRouter();
  const { habits, entries, selectedDate, setSelectedDate, incrementHabit, decrementHabit, archiveHabit } = useHabitsStore();
  const [isEditMode, setIsEditMode] = useState(false);

  // Calculate selected date from weekday index
  const selectedDayIndex = useMemo(() => {
    return getWeekdayIndex(selectedDate);
  }, [selectedDate]);

  const handleWeekdaySelect = (index: number) => {
    const today = todayISO();
    const todayIndex = getWeekdayIndex(today);
    const diff = index - todayIndex;
    const newDate = addDays(today, diff);
    setSelectedDate(newDate);
  };

  // Filter and separate habits
  const visibleHabits = habits.filter((h) => !h.archived);
  const dailyHabits = visibleHabits.filter((h) => h.cadence === 'daily');
  const weeklyHabits = visibleHabits.filter((h) => h.cadence === 'weekly');

  // Calculate overall progress
  const overallProgress = getOverallProgress(habits, selectedDate, entries);
  const overallProgressPercent = Math.round(overallProgress * 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Controls */}
        <View style={styles.topControls}>
          <Pressable
            style={styles.editButton}
            onPress={() => setIsEditMode(!isEditMode)}
          >
            <Text variant="cardTitle" style={styles.editButtonText}>
              Edit
            </Text>
          </Pressable>
          <Pressable
            style={styles.addButton}
            onPress={() => router.push('/modal/habit-edit' as any)}
          >
            <IconSymbol name="plus" size={18} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Weekday Selector */}
        <View style={styles.weekdayContainer}>
          <WeekdaySelector
            selectedIndex={selectedDayIndex}
            onSelect={handleWeekdaySelect}
          />
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <ScreenTitle>Today</ScreenTitle>
        </View>

        {/* Main Progress Ring */}
        <View style={styles.ringContainer}>
          <Ring
            size={220}
            strokeWidth={14}
            progress={overallProgress}
            trackColor={colors.strokeLight}
            progressColor={colors.progress}
          />
          <View style={styles.ringLabel}>
            <Text variant="progressValue" style={styles.progressNumber}>
              {overallProgressPercent}
            </Text>
            <Text variant="progressPercent" style={styles.progressPercent}>
              %
            </Text>
          </View>
        </View>

        {/* Daily Habits */}
        <View style={styles.habitsContainer}>
          {dailyHabits.map((habit) => {
            const progress = getHabitProgress(habit, selectedDate, entries);
            const count = getHabitCount(habit.id, selectedDate, entries);
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
                isEditMode={isEditMode}
                onIncrement={() => incrementHabit(habit.id, selectedDate)}
                onDecrement={() => decrementHabit(habit.id, selectedDate)}
                onArchive={() => archiveHabit(habit.id)}
                onEdit={() => router.push(`/modal/habit-edit?id=${habit.id}` as any)}
                onPress={() => router.push(`/habit/${habit.id}` as any)}
              />
            );
          })}
        </View>

        {/* Weekly Goals Section */}
        <View style={styles.sectionContainer}>
          <SectionTitle>Weekly goals</SectionTitle>
        </View>

        {/* Weekly Habits */}
        <View style={styles.habitsContainer}>
          {weeklyHabits.map((habit) => {
            const progress = getHabitProgress(habit, selectedDate, entries);
            // For weekly habits, show the weekly count
            const weekStart = getWeekStartISO(selectedDate);
            const count = getWeeklyHabitCount(habit.id, weekStart, entries);
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
                isEditMode={isEditMode}
                onIncrement={() => incrementHabit(habit.id, selectedDate)}
                onDecrement={() => decrementHabit(habit.id, selectedDate)}
                onArchive={() => archiveHabit(habit.id)}
                onEdit={() => router.push(`/modal/habit-edit?id=${habit.id}` as any)}
                onPress={() => router.push(`/habit/${habit.id}` as any)}
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
    paddingBottom: 100, // Space for bottom nav
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
    height: 44,
    gap: spacing.md,
  },
  editButton: {
    height: 44,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayContainer: {
    marginTop: spacing.sm,
  },
  titleContainer: {
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.md + 2, // 18pt
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['2xl'],
    marginBottom: spacing['2xl'],
    position: 'relative',
  },
  ringLabel: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  progressNumber: {
    fontSize: 56,
    fontWeight: '700',
    lineHeight: 64,
    color: colors.textPrimary,
  },
  progressPercent: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  habitsContainer: {
    paddingHorizontal: spacing.screenPadding,
  },
  sectionContainer: {
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing['2xl'] - 2, // 26pt
    marginBottom: spacing.base,
  },
});

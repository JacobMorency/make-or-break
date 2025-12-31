import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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
  const [selectedDayIndex, setSelectedDayIndex] = useState(2); // Wednesday for now
  const [isEditMode, setIsEditMode] = useState(false);

  // Mock data for skeleton
  const dailyHabits = [
    { id: '1', name: 'Drink water', goal: 8, cadence: 'daily' as const, polarity: 'build' as const, progress: 0, count: 0 },
    { id: '2', name: 'Go to the gym', goal: 6, cadence: 'daily' as const, polarity: 'build' as const, progress: 0, count: 0 },
  ];

  const weeklyHabits = [
    { id: '3', name: 'Work on Side Projects', goal: 4, cadence: 'weekly' as const, polarity: 'build' as const, progress: 0, count: 0 },
  ];

  const overallProgress = 0; // Will be calculated later

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
            onPress={() => router.push('/modal/habit-edit')}
          >
            <IconSymbol name="plus" size={18} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Weekday Selector */}
        <View style={styles.weekdayContainer}>
          <WeekdaySelector
            selectedIndex={selectedDayIndex}
            onSelect={setSelectedDayIndex}
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
              0
            </Text>
            <Text variant="progressPercent" style={styles.progressPercent}>
              %
            </Text>
          </View>
        </View>

        {/* Daily Habits */}
        <View style={styles.habitsContainer}>
          {dailyHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              name={habit.name}
              goal={habit.goal}
              cadence={habit.cadence}
              polarity={habit.polarity}
              progress={habit.progress}
              count={habit.count}
              onIncrement={() => {}}
              onDecrement={() => {}}
            />
          ))}
        </View>

        {/* Weekly Goals Section */}
        <View style={styles.sectionContainer}>
          <SectionTitle>Weekly goals</SectionTitle>
        </View>

        {/* Weekly Habits */}
        <View style={styles.habitsContainer}>
          {weeklyHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              name={habit.name}
              goal={habit.goal}
              cadence={habit.cadence}
              polarity={habit.polarity}
              progress={habit.progress}
              count={habit.count}
              onIncrement={() => {}}
              onDecrement={() => {}}
            />
          ))}
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

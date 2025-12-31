import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import { Text } from '@/src/components/ui/Text';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface WeekdaySelectorProps {
  selectedIndex: number; // 0-6, where 0 is Monday
  onSelect: (index: number) => void;
}

export function WeekdaySelector({ selectedIndex, onSelect }: WeekdaySelectorProps) {
  return (
    <View style={styles.container}>
      {WEEKDAYS.map((day, index) => {
        const isSelected = index === selectedIndex;
        const isPast = index <= selectedIndex; // Show circle for past/current days
        
        return (
          <Pressable
            key={index}
            style={styles.dayContainer}
            onPress={() => onSelect(index)}
            hitSlop={8}
          >
            <View style={styles.dayContent}>
              {isPast ? (
                <View style={[styles.circle, isSelected && styles.circleSelected]}>
                  <Text
                    variant="weekday"
                    style={[styles.dayText, isSelected && styles.dayTextSelected]}
                  >
                    {day}
                  </Text>
                </View>
              ) : (
                <Text variant="weekday" style={styles.dayText}>
                  {day}
                </Text>
              )}
              {isSelected && <View style={styles.dot} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    height: 44,
  },
  dayContainer: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.stroke,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleSelected: {
    // Keep same styling, but text color changes
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 16,
    color: colors.textTertiary,
  },
  dayTextSelected: {
    color: colors.accentOrange,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accentOrange,
    marginTop: 10,
  },
});


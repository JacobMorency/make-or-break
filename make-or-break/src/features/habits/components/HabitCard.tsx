import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '@/src/components/ui/Card';
import { CardTitle, CardSubtitle } from '@/src/components/ui/Text';
import { MiniRingButton } from './MiniRingButton';
import { spacing } from '@/src/theme/spacing';
import { colors } from '@/src/theme/colors';

interface HabitCardProps {
  name: string;
  goal: number;
  cadence: 'daily' | 'weekly';
  polarity: 'build' | 'break';
  progress: number; // 0-1
  count: number;
  onPress?: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function HabitCard({
  name,
  goal,
  cadence,
  polarity,
  progress,
  count,
  onPress,
  onIncrement,
  onDecrement,
}: HabitCardProps) {
  const subtitle = cadence === 'daily' 
    ? `Goal: ${goal} / day`
    : `Goal: ${goal} / week`;
  
  const subtitleWithPolarity = polarity === 'break' 
    ? `${subtitle} (wins)`
    : subtitle;

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle} />
        </View>
        <View style={styles.textContainer}>
          <CardTitle>{name}</CardTitle>
          <CardSubtitle>{subtitleWithPolarity}</CardSubtitle>
        </View>
        <View style={styles.ringContainer}>
          <MiniRingButton
            progress={progress}
            count={count}
            goal={goal}
            onPress={onIncrement}
            onLongPress={onDecrement}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.cardSpacing,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#151518',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  ringContainer: {
    marginLeft: spacing.md,
  },
});


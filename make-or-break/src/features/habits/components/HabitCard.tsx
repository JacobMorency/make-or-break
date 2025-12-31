import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Card } from '@/src/components/ui/Card';
import { CardTitle, CardSubtitle, Text } from '@/src/components/ui/Text';
import { MiniRingButton } from './MiniRingButton';
import { spacing } from '@/src/theme/spacing';
import { useColors } from '@/src/theme/colors';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface HabitCardProps {
  id: string;
  name: string;
  goal: number;
  cadence: 'daily' | 'weekly';
  polarity: 'build' | 'break';
  progress: number; // 0-1
  count: number;
  isEditMode?: boolean;
  onPress?: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onArchive?: () => void;
  onEdit?: () => void;
}

export function HabitCard({
  id,
  name,
  goal,
  cadence,
  polarity,
  progress,
  count,
  isEditMode = false,
  onPress,
  onIncrement,
  onDecrement,
  onArchive,
  onEdit,
}: HabitCardProps) {
  const colors = useColors();
  const styles = getStyles(colors);
  const subtitle = cadence === 'daily' 
    ? `Goal: ${goal} / day`
    : `Goal: ${goal} / week`;
  
  const subtitleWithPolarity = polarity === 'break' 
    ? `${subtitle} (wins)`
    : subtitle;

  return (
    <Card onPress={!isEditMode ? onPress : undefined} style={styles.card}>
      <View style={styles.content}>
        {isEditMode && (
          <Pressable
            style={styles.archiveButton}
            onPress={onArchive}
            hitSlop={8}
          >
            <IconSymbol name="trash.fill" size={18} color={colors.textSecondary} />
          </Pressable>
        )}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle} />
        </View>
        <View style={styles.textContainer}>
          <CardTitle>{name}</CardTitle>
          <CardSubtitle>{subtitleWithPolarity}</CardSubtitle>
        </View>
        {!isEditMode && (
          <View style={styles.ringContainer}>
            <MiniRingButton
              progress={progress}
              count={count}
              goal={goal}
              onPress={onIncrement}
              onLongPress={onDecrement}
            />
          </View>
        )}
        {isEditMode && (
          <Pressable
            style={styles.editButton}
            onPress={onEdit}
            hitSlop={8}
          >
            <Text variant="cardSubtitle" style={styles.editButtonText}>
              Edit
            </Text>
          </Pressable>
        )}
      </View>
    </Card>
  );
}

const getStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  card: {
    marginBottom: spacing.cardSpacing,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  archiveButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceSecondary,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  ringContainer: {
    marginLeft: spacing.md,
  },
  editButton: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    marginLeft: spacing.md,
  },
  editButtonText: {
    color: colors.primary,
  },
});


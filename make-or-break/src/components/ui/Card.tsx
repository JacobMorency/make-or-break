import React from 'react';
import { View, ViewProps, StyleSheet, Pressable, PressableProps } from 'react-native';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import { radius } from '@/src/theme/radius';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 86,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  pressable: {
    flex: 1,
  },
});

export function Card({ children, style, onPress, ...props }: CardProps) {
  const content = (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.pressable}>
        {content}
      </Pressable>
    );
  }

  return content;
}


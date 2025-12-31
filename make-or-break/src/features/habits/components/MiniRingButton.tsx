import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ring } from '@/src/components/ui/Ring';
import { Text } from '@/src/components/ui/Text';
import { useColors } from '@/src/theme/colors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface MiniRingButtonProps {
  progress: number; // 0-1
  count: number;
  goal: number;
  onPress: () => void;
  onLongPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MiniRingButton({
  progress,
  count,
  goal,
  onPress,
  onLongPress,
}: MiniRingButtonProps) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 90 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 140 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress();
  };

  return (
    <AnimatedPressable
      testID="mini-ring-button"
      style={[styles.container, animatedStyle]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={8}
    >
      <View style={styles.ringContainer}>
        <Ring
          size={46}
          strokeWidth={5}
          progress={progress}
          trackColor={colors.stroke}
          progressColor={colors.progress}
        />
        <View style={styles.countContainer}>
          <Text
            variant="cardTitle"
            style={[styles.countText, { color: colors.textPrimary }]}
          >
            {count}
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringContainer: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  countContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 18,
    fontWeight: '600',
  },
});


import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ring } from '@/src/components/ui/Ring';
import { Text } from '@/src/components/ui/Text';
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

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={8}
    >
      <View style={styles.ringContainer}>
        <Ring
          size={46}
          strokeWidth={5}
          progress={progress}
          trackColor="#2C2C2E"
          progressColor="#FFFFFF"
        />
        <View style={styles.countContainer}>
          <Text
            variant="cardTitle"
            style={styles.countText}
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
    color: '#FFFFFF',
  },
});


import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/src/theme/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface RingProps {
  size: number;
  strokeWidth: number;
  progress: number; // 0-1
  showTrack?: boolean;
  trackColor?: string;
  progressColor?: string;
  startAngle?: number; // degrees, default 90 (top)
}

export function Ring({
  size,
  strokeWidth,
  progress,
  showTrack = true,
  trackColor = colors.stroke,
  progressColor = colors.progress,
  startAngle = 90,
}: RingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: size > 100 ? 650 : 320, // Main ring: 650ms, mini: 320ms
    });
  }, [progress, size]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - animatedProgress.value);
    return {
      strokeDashoffset,
    };
  });


  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {showTrack && (
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        )}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          transform={`rotate(${startAngle} ${center} ${center})`}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});


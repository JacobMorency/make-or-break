/**
 * Border radius system
 */

export const radius = {
  sm: 20,
  md: 22,
  lg: 24,
  xl: 28,
  '2xl': 38,
  full: 9999, // For perfect circles
} as const;

export type RadiusKey = keyof typeof radius;


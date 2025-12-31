/**
 * Spacing system based on 4pt grid
 */

const baseUnit = 4;

export const spacing = {
  xs: baseUnit, // 4pt
  sm: baseUnit * 2, // 8pt
  md: baseUnit * 3, // 12pt
  base: baseUnit * 4, // 16pt
  lg: baseUnit * 5, // 20pt
  xl: baseUnit * 6, // 24pt
  '2xl': baseUnit * 7, // 28pt
  '3xl': baseUnit * 8, // 32pt
  '4xl': baseUnit * 9, // 36pt
  '5xl': baseUnit * 11, // 44pt
  '6xl': baseUnit * 13, // 52pt
  '7xl': baseUnit * 19, // 76pt
  '8xl': baseUnit * 55, // 220pt

  // Specific measurements from design
  screenPadding: baseUnit * 5, // 20pt
  cardSpacing: baseUnit * 4, // 16pt
  weekdaySpacing: baseUnit * 4.5, // 18pt (approximate)
} as const;

export type SpacingKey = keyof typeof spacing;


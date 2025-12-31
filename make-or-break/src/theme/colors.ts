/**
 * Design system colors
 * Based on ultra-minimal dark theme with specific accent colors
 */

export const colors = {
  // Base
  background: '#000000',
  surface: '#1C1C1E',
  surfaceSecondary: '#2A2A2E',
  stroke: '#2C2C2E',
  strokeLight: '#3A3A3C',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B8',
  textTertiary: '#6C6C70',

  // Accents
  accentOrange: '#FF5812', // Selected day indicator
  accentIndigo: '#7575F4', // Active tab

  // Progress (neutral white, not accent)
  progress: '#FFFFFF',

  // Icon colors (for habit icons)
  iconWater: '#88D4F5',
  iconGym: '#2E7BFF',
  iconSideProject: '#A79CFF',
} as const;

export type ColorKey = keyof typeof colors;


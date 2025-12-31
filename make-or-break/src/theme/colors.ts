/**
 * Design system colors with light/dark theme support
 * Primary color: #3b82f6
 */

import { useColorScheme } from "@/hooks/use-color-scheme";

const lightColors = {
  // Base
  background: "#FFFFFF",
  surface: "#F3F4F6",
  surfaceSecondary: "#E5E7EB",
  stroke: "#D1D5DB",
  strokeLight: "#9CA3AF",

  // Text
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",

  // Accents
  primary: "#3b82f6",
  accentOrange: "#3b82f6", // Selected day indicator (using primary)

  // Progress
  progress: "#3b82f6", // Using primary color

  // Icon colors (for habit icons)
  iconWater: "#0EA5E9",
  iconGym: "#3b82f6",
  iconSideProject: "#8B5CF6",
} as const;

const darkColors = {
  // Base
  background: "#000000",
  surface: "#1C1C1E",
  surfaceSecondary: "#2A2A2E",
  stroke: "#2C2C2E",
  strokeLight: "#3A3A3C",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "#B3B3B8",
  textTertiary: "#6C6C70",

  // Accents
  primary: "#3b82f6",
  accentOrange: "#3b82f6", // Selected day indicator (using primary)

  // Progress
  progress: "#3b82f6", // Using primary color

  // Icon colors (for habit icons)
  iconWater: "#88D4F5",
  iconGym: "#3b82f6",
  iconSideProject: "#A79CFF",
} as const;

export type ColorScheme = "light" | "dark";

export function getColors(theme: ColorScheme) {
  return theme === "light" ? lightColors : darkColors;
}

export function useColors() {
  const colorScheme = useColorScheme();
  return getColors(colorScheme ?? "dark");
}

// Export types
export type Colors = typeof lightColors;
export type ColorKey = keyof Colors;

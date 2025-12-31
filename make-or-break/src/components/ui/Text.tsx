import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";
import { useColors } from "@/src/theme/colors";

type TextVariant =
  | "screenTitle"
  | "sectionTitle"
  | "cardTitle"
  | "cardSubtitle"
  | "weekday"
  | "progressValue"
  | "progressPercent"
  | "tabLabel";

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  children: React.ReactNode;
}

const getStyles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    screenTitle: {
      fontSize: 34,
      fontWeight: "700",
      lineHeight: 40,
      letterSpacing: 0.4,
      color: colors.textPrimary,
    },
    sectionTitle: {
      fontSize: 28,
      fontWeight: "700",
      lineHeight: 34,
      letterSpacing: 0.2,
      color: colors.textPrimary,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "600",
      lineHeight: 24,
      letterSpacing: 0.2,
      color: colors.textPrimary,
    },
    cardSubtitle: {
      fontSize: 14,
      fontWeight: "400",
      lineHeight: 18,
      color: colors.textSecondary,
    },
    weekday: {
      fontSize: 14,
      fontWeight: "500",
      lineHeight: 16,
      color: colors.textTertiary,
    },
    weekdaySelected: {
      color: colors.primary,
    },
    progressValue: {
      fontSize: 56,
      fontWeight: "700",
      lineHeight: 64,
      color: colors.textPrimary,
    },
    progressPercent: {
      fontSize: 26,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: "600",
      lineHeight: 14,
      color: colors.textSecondary,
    },
    tabLabelActive: {
      color: colors.primary,
    },
  });

export function Text({
  variant = "cardTitle",
  style,
  children,
  ...props
}: TextProps) {
  const colors = useColors();
  const styles = getStyles(colors);
  return (
    <RNText style={[styles[variant], style]} {...props}>
      {children}
    </RNText>
  );
}

// Export specific text components for convenience
export function ScreenTitle({
  style,
  children,
  ...props
}: Omit<TextProps, "variant">) {
  return (
    <Text variant="screenTitle" style={style} {...props}>
      {children}
    </Text>
  );
}

export function SectionTitle({
  style,
  children,
  ...props
}: Omit<TextProps, "variant">) {
  return (
    <Text variant="sectionTitle" style={style} {...props}>
      {children}
    </Text>
  );
}

export function CardTitle({
  style,
  children,
  ...props
}: Omit<TextProps, "variant">) {
  return (
    <Text variant="cardTitle" style={style} {...props}>
      {children}
    </Text>
  );
}

export function CardSubtitle({
  style,
  children,
  ...props
}: Omit<TextProps, "variant">) {
  return (
    <Text variant="cardSubtitle" style={style} {...props}>
      {children}
    </Text>
  );
}

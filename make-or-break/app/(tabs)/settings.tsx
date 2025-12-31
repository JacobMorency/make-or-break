import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenTitle, CardSubtitle } from "@/src/components/ui/Text";
import { useColors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";

export default function SettingsScreen() {
  const colors = useColors();
  const styles = getStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <ScreenTitle>Settings</ScreenTitle>
        <CardSubtitle style={styles.placeholder}>Sync coming soon</CardSubtitle>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.screenPadding,
      paddingTop: spacing.lg,
    },
    placeholder: {
      marginTop: spacing.base,
    },
  });

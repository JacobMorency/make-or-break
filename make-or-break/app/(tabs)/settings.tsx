import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenTitle, CardSubtitle } from '@/src/components/ui/Text';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <ScreenTitle>Settings</ScreenTitle>
        <CardSubtitle style={styles.placeholder}>
          Sync coming soon
        </CardSubtitle>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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


// import { Tabs } from 'expo-router';
import React from "react";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf={"house.fill"} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="history">
        <Label>History</Label>
        <Icon sf={"chart.bar.fill"} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

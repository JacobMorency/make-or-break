import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: [
          getTabBarStyles(colors).tabBar,
          {
            paddingBottom: Math.max(insets.bottom, 8),
            height: 60 + Math.max(insets.bottom - 8, 0),
          },
        ],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: getTabBarStyles(colors).tabLabel,
        tabBarItemStyle: getTabBarStyles(colors).tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={22} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={22} name="chart.bar.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={22} name="gearshape.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const getTabBarStyles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.stroke,
      paddingTop: 8,
      paddingHorizontal: 0,
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: "600",
      marginTop: 4,
    },
    tabItem: {
      paddingHorizontal: 4,
    },
  });

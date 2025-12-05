import {
  NativeTabs,
  Icon,
  Label,
  Badge,
} from "expo-router/unstable-native-tabs";

import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf={"house.fill"} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="history">
        <Label>History</Label>
        <Icon sf={""} />
      </NativeTabs.Trigger>
    </NativeTabs>

    // <Tabs>
    //   <Tabs.Screen name="index" />
    // </Tabs>
  );
}

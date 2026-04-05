import { HapticTab } from "@/components/haptic-tab";
import NewReportTab from "@/components/new-report-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePushToken } from "@/hooks/use-notification";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  usePushToken();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          tabBarStyle: {
            backgroundColor: "#fff",
            // backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            tabBarItemStyle: {
              paddingRight: "10%",
            },
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="document" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            title: "Notification",
            tabBarItemStyle: {
              paddingLeft: "10%",
            },
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="bell" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.fill" color={color} />
            ),
          }}
        />
      </Tabs>
      <NewReportTab />
    </>
  );
}

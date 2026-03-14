import {
  NotificationCard,
  NotificationCardProps,
} from "@/components/notification-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NotificationItem = NotificationCardProps & { id: string };

// TODO: Replace with real data from API
const RECENT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "location",
    title: "New report in your area",
    description: "A new incident has been reported near your current location.",
    timeAgo: "2m ago",
  },
  {
    id: "2",
    type: "report",
    title: "Your report was analyzed",
    description:
      "The authorities have reviewed your recent submission regarding street lighting.",
    timeAgo: "1h ago",
  },
  {
    id: "3",
    type: "comment",
    title: "Someone commented on your post",
    description:
      '"I noticed this too, thanks for sharing! I hope it gets fixed soon."',
    timeAgo: "3h ago",
  },
];

const EARLIER_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "4",
    type: "verified",
    title: "Account verified",
    description:
      "Your identity has been verified. You can now submit official reports.",
    timeAgo: "Yesterday",
    isEarlier: true,
  },
];

export default function NotificationScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <ThemedText type="title" style={styles.header}>
        Notifications
      </ThemedText>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Recent notifications */}
        {RECENT_NOTIFICATIONS.map((notification) => (
          <NotificationCard key={notification.id} {...notification} />
        ))}

        {/* Earlier section */}
        {EARLIER_NOTIFICATIONS.length > 0 && (
          <>
            <ThemedText style={styles.sectionLabel}>EARLIER</ThemedText>
            {EARLIER_NOTIFICATIONS.map((notification) => (
              <NotificationCard key={notification.id} {...notification} />
            ))}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8B9A7E",
    letterSpacing: 1,
    marginTop: 8,
  },
});

import { primaryColor } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { format, formatDistanceToNow } from "date-fns";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";

export type NotificationType =
  | "location"
  | "report"
  | "ratings"
  | "comments"
  | "verified"
  | "info";

type NotificationIconConfig = {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
};

const ICON_MAP: Record<NotificationType, NotificationIconConfig> = {
  location: { name: "location-on" },
  report: { name: "assignment" },
  ratings: { name: "star" },
  comments: { name: "chat-bubble-outline" },
  verified: { name: "verified-user" },
  info: { name: "info-outline" },
};

export type NotificationCardProps = {
  code: NotificationType;
  title: string;
  content: string;
  date_created: string;
  isEarlier?: boolean;
  data: {
    screen: string;
    params: Record<string, string>;
  };
};

export function NotificationCard({
  code,
  title,
  content,
  date_created,
  isEarlier = false,
  data,
}: NotificationCardProps) {
  const iconConfig = ICON_MAP[code];

  return (
    <Link
      asChild
      href={{
        pathname: (data?.screen as any) ?? null,
        params: data?.params ?? null,
      }}
    >
      <TouchableOpacity style={styles.card}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={iconConfig.name}
            size={22}
            color={primaryColor}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <ThemedText
              type="defaultSemiBold"
              style={styles.title}
              numberOfLines={2}
            >
              {title}
            </ThemedText>
            <ThemedText style={styles.timeAgo}>
              {isEarlier
                ? format(date_created, "dd MMM yyyy")
                : formatDistanceToNow(date_created)}
            </ThemedText>
          </View>
          <ThemedText style={styles.description}>{content}</ThemedText>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 14,
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#14341610",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    flex: 1,
  },
  timeAgo: {
    fontSize: 13,
    lineHeight: 20,
    color: "#8B9A7E",
    flexShrink: 0,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#687076",
  },
});

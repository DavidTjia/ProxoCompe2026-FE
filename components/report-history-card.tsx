import { primaryColor } from "@/constants/theme";
import { Report } from "@/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

type Props = {
  report: Report;
  onDetailsPress?: (report: Report) => void;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function ReportHistoryCard({ report, onDetailsPress }: Props) {
  const isPublished = report.status === "PUBLISHED";

  return (
    <View style={styles.card}>
      {/* Top row: image + info + score */}
      <View style={styles.topRow}>
        {/* Thumbnail */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: report.image }}
            style={styles.image}
            contentFit="cover"
          />
        </View>

        {/* Info */}
        <View style={styles.info}>
          <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={2}>
            {report.title}
          </ThemedText>
          <ThemedText style={styles.date}>
            {formatDate(report.created_at)} • {formatTime(report.created_at)}
          </ThemedText>
          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={16} color="#D4A017" />
            <ThemedText style={styles.ratingText}>{report.rating}</ThemedText>
          </View>
        </View>

        {/* Score */}
        <View style={styles.scoreColumn}>
          <ThemedText style={styles.scoreValue}>
            {report.pollution_score.toFixed(1)}
          </ThemedText>
          <ThemedText style={styles.scoreLabel}>SCORE</ThemedText>
        </View>
      </View>

      {/* Bottom row: status badge + details link */}
      <View style={styles.bottomRow}>
        <View
          style={[
            styles.statusBadge,
            isPublished ? styles.publishedBadge : styles.draftBadge,
          ]}
        >
          <ThemedText
            style={[
              styles.statusText,
              isPublished ? styles.publishedText : styles.draftText,
            ]}
          >
            {report.status}
          </ThemedText>
        </View>

        <Pressable
          style={styles.detailsBtn}
          onPress={() => onDetailsPress?.(report)}
        >
          <ThemedText style={styles.detailsText}>Details</ThemedText>
          <MaterialIcons name="chevron-right" size={18} color="#687076" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#E0E0E0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
  },
  date: {
    fontSize: 13,
    color: "#687076",
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 13,
    color: "#687076",
  },
  scoreColumn: {
    alignItems: "flex-end",
    gap: 0,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: "700",
    color: primaryColor,
    lineHeight: 28,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8B9A7E",
    letterSpacing: 0.5,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  publishedBadge: {
    backgroundColor: "#D4EDDA",
  },
  draftBadge: {
    backgroundColor: "#E8E8E8",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  publishedText: {
    color: primaryColor,
  },
  draftText: {
    color: "#687076",
  },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  detailsText: {
    fontSize: 14,
    color: "#687076",
    fontWeight: "500",
  },
});

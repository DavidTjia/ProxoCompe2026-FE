import { primaryColor } from "@/constants/theme";
import { Report } from "@/types";
import {
  getPollutionStatus,
  reportPrivacyStatus,
} from "@/utils/status-mapping";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Color from "color";
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
  const pollutionStatus = getPollutionStatus(
    Number(report.pollution_score || 0),
  );
  const privacyStatus = reportPrivacyStatus[report.privacy];

  return (
    <Pressable style={styles.card} onPress={() => onDetailsPress?.(report)}>
      {/* Top row: image + info + score */}
      <View style={styles.topRow}>
        {/* Thumbnail */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: `${process.env.EXPO_PUBLIC_BASE_API_URL}/assets/${report.photo}`,
            }}
            style={styles.image}
            contentFit="cover"
          />
        </View>

        {/* Info */}
        <View style={styles.info}>
          <ThemedText
            type="defaultSemiBold"
            style={styles.title}
            numberOfLines={2}
          >
            {report.ai_summary}
          </ThemedText>
          <ThemedText style={styles.date}>
            {formatDate(report.date_created)} •{" "}
            {formatTime(report.date_created)}
          </ThemedText>
          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={16} color="#D4A017" />
            <ThemedText style={styles.ratingText}>
              {Number(report.avg_rating).toFixed(1) || 0}
            </ThemedText>
          </View>
        </View>

        {/* Score */}
        <View style={styles.scoreColumn}>
          <ThemedText
            style={[styles.scoreValue, { color: pollutionStatus.color }]}
          >
            {Number(report.pollution_score).toFixed(1)}
          </ThemedText>
          <ThemedText style={styles.scoreLabel}>SCORE</ThemedText>
        </View>
      </View>

      {/* Bottom row: status badge + details link */}
      <View style={styles.bottomRow}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: Color(privacyStatus.color).lighten(2).hex() },
          ]}
        >
          <ThemedText
            style={[styles.statusText, { color: privacyStatus.color }]}
          >
            {privacyStatus.label}
          </ThemedText>
        </View>

        <View style={styles.detailsBtn}>
          <ThemedText style={styles.detailsText}>Details</ThemedText>
          <MaterialIcons name="chevron-right" size={18} color="#687076" />
        </View>
      </View>
    </Pressable>
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
    flex: 1,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    color: primaryColor,
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
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  detailsText: {
    fontSize: 14,
    color: primaryColor,
    fontWeight: "500",
  },
});

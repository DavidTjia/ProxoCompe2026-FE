import { primaryColor } from "@/constants/theme";
import { Report } from "@/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

type Props = {
  report: Report;
  onCardPress?: (report: Report) => void;
  onCommentPress?: (report: Report) => void;
  onReportPress?: (report: Report) => void;
};

const SEVERITY_CONFIG = {
  CRITICAL: {
    color: "#E53935",
    backgroundColor: "#FFCDD2",
    icon: "warning" as const,
  },
  MODERATE: {
    color: "#F57C00",
    backgroundColor: "#FFE0B2",
    icon: "error-outline" as const,
  },
  LOW: {
    color: "#43A047",
    backgroundColor: "#C8E6C9",
    icon: "check-circle-outline" as const,
  },
};

export function CommunityFeedCard({
  report,
  onCardPress,
  onCommentPress,
  onReportPress,
}: Props) {
  const severity = report.severity ?? "LOW";
  const config = SEVERITY_CONFIG[severity];

  return (
    <Pressable style={styles.card} onPress={() => onCardPress?.(report)}>
      {/* Image with overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: report.image }}
          style={styles.image}
          contentFit="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={styles.imageOverlay}
        />

        {/* Severity badge */}
        <View
          style={[
            styles.severityBadge,
            { backgroundColor: config.backgroundColor },
          ]}
        >
          <MaterialIcons name={config.icon} size={14} color={config.color} />
          <ThemedText style={[styles.severityText, { color: config.color }]}>
            {severity}
          </ThemedText>
        </View>

        {/* Score badge */}
        <View style={styles.scoreBadge}>
          <ThemedText style={styles.scoreLabel}>SCORE</ThemedText>
          <ThemedText style={styles.scoreValue}>
            {report.pollution_score.toFixed(1)}
          </ThemedText>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <MaterialIcons name="place" size={14} color="#FFFFFF" />
          <ThemedText style={styles.locationText} numberOfLines={1}>
            {report.location_name ?? "Unknown Location"}
          </ThemedText>
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <ThemedText style={styles.description} numberOfLines={2}>
          {report.description}
        </ThemedText>
      </View>

      {/* Action row */}
      <View style={styles.actionRow}>
        <View style={styles.ratingPill}>
          <MaterialIcons name="star" size={16} color="#D4A017" />
          <ThemedText style={styles.ratingText}>
            {report.rating.toFixed(1)}
          </ThemedText>
        </View>

        <Pressable
          style={styles.actionPill}
          onPress={() => onCommentPress?.(report)}
        >
          <MaterialIcons
            name="chat-bubble-outline"
            size={14}
            color="#555"
          />
          <ThemedText style={styles.actionText}>Comment</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.actionPill, styles.reportPill]}
          onPress={() => onReportPress?.(report)}
        >
          <MaterialIcons name="report-problem" size={14} color={primaryColor} />
          <ThemedText style={[styles.actionText, { color: primaryColor }]}>
            Report
          </ThemedText>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // Image section
  imageContainer: {
    height: 180,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },

  // Severity badge (top-left)
  severityBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  severityText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // Score badge (bottom-right of image)
  scoreBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 50,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "#8B9A7E",
    letterSpacing: 0.5,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: "800",
    color: primaryColor,
    lineHeight: 24,
  },

  // Location (bottom-left of image)
  locationRow: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  locationText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "500",
  },

  // Description
  descriptionContainer: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: "#444",
  },

  // Actions
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 8,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F5E5A0",
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8B7000",
  },
  actionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  reportPill: {
    backgroundColor: "#E8F5E9",
    borderColor: "#C8E6C9",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#555",
  },
});

import { primaryColor } from "@/constants/theme";
import { Report } from "@/types";
import { getPollutionStatus } from "@/utils/status-mapping";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Color from "color";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { reverseGeocodeAsync } from "expo-location";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";
import { IconSymbol } from "./ui/icon-symbol";

type Props = {
  report: Report;
  onCardPress?: (report: Report) => void;
  onCommentPress?: (report: Report) => void;
  onReportPress?: (report: Report) => void;
};

export function CommunityFeedCard({
  report,
  onCardPress,
  onCommentPress,
  onReportPress,
}: Props) {
  const pollutionStatus = getPollutionStatus(
    Number(report?.pollution_score || 0),
  );
  const [address, setAddress] = useState("");

  const getAddress = async () => {
    try {
      const { latitude, longitude } = report;
      const address = await reverseGeocodeAsync({
        latitude: Number(latitude),
        longitude: Number(longitude),
      });

      setAddress(address?.[0]?.formattedAddress || "");
    } catch (error) {
      console.log("error address", error);
    }
  };

  useEffect(() => {
    console.log("ss :", pollutionStatus);
    getAddress();
  }, []);

  return (
    <Pressable style={styles.card} onPress={() => onCardPress?.(report)}>
      {/* Image with overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: `${process.env.EXPO_PUBLIC_BASE_API_URL}/assets/${report.photo}`,
          }}
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
            {
              backgroundColor: Color(pollutionStatus.color).lighten(0.5).hex(),
            },
          ]}
        >
          <IconSymbol
            iconSet="material-community"
            name={pollutionStatus.iconName}
            size={14}
            color={pollutionStatus.color}
          />
          <ThemedText
            style={[styles.severityText, { color: pollutionStatus.color }]}
          >
            {pollutionStatus.level}
          </ThemedText>
        </View>

        {/* Score badge */}
        <View style={styles.scoreBadge}>
          <ThemedText style={styles.scoreLabel}>SCORE</ThemedText>
          <ThemedText
            style={[
              styles.scoreValue,
              {
                color: pollutionStatus.color,
              },
            ]}
          >
            {Number(report.pollution_score || 0).toFixed(1)}
          </ThemedText>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <MaterialIcons name="place" size={14} color="#FFFFFF" />
          <ThemedText style={styles.locationText} numberOfLines={1}>
            {address ?? "Unknown Location"}
          </ThemedText>
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <ThemedText style={styles.description} numberOfLines={2}>
          {report.ai_summary}
        </ThemedText>
      </View>

      {/* Action row */}
      <View style={styles.actionRow}>
        <View style={styles.ratingPill}>
          <MaterialIcons name="star" size={16} color="#D4A017" />
          <ThemedText style={styles.ratingText}>
            {Number(report.avg_rating || 0).toFixed(1)}
          </ThemedText>
        </View>

        <Pressable
          style={styles.actionPill}
          onPress={() => onCommentPress?.(report)}
        >
          <MaterialIcons name="chat-bubble-outline" size={14} color="#555" />
          <ThemedText style={styles.actionText}>Comment</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.actionPill, styles.reportPill]}
          onPress={() => onReportPress?.(report)}
        >
          <IconSymbol
            name="exclamationmark.circle"
            iconSet="material-community"
            size={14}
            color={primaryColor}
          />
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
    maxWidth: "70%",
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

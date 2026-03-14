import { ThemedText } from "@/components/themed-text";
import { primaryColor } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SEVERITY_CONFIG = {
  CRITICAL: {
    color: "#E53935",
    backgroundColor: "#FFCDD2",
    icon: "warning" as const,
    label: "Critical",
  },
  MODERATE: {
    color: "#F57C00",
    backgroundColor: "#FFE0B2",
    icon: "error-outline" as const,
    label: "Moderate",
  },
  LOW: {
    color: "#43A047",
    backgroundColor: "#C8E6C9",
    icon: "check-circle-outline" as const,
    label: "Low",
  },
};

export default function ReportDetailModal() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id: string;
    image: string;
    title: string;
    description: string;
    pollution_score: string;
    rating: string;
    location_name: string;
    severity: string;
    ai_summary: string;
    created_at: string;
    latitude: string;
    longitude: string;
  }>();

  const severity = (params.severity ?? "LOW") as keyof typeof SEVERITY_CONFIG;
  const config = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.LOW;
  const score = parseFloat(params.pollution_score ?? "0");
  const rating = parseFloat(params.rating ?? "0");

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── Hero Image ── */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: params.image }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "transparent", "rgba(0,0,0,0.6)"]}
            style={styles.imageOverlay}
          />

          {/* Back button */}
          <Pressable
            style={[styles.backButton, { top: insets.top + 8 }]}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={22} color="#FFF" />
          </Pressable>

          {/* Severity badge */}
          <View
            style={[
              styles.severityBadge,
              { backgroundColor: config.backgroundColor, top: insets.top + 8 },
            ]}
          >
            <MaterialIcons name={config.icon} size={14} color={config.color} />
            <ThemedText style={[styles.severityText, { color: config.color }]}>
              {config.label}
            </ThemedText>
          </View>

          {/* Location overlay */}
          <View style={styles.locationOverlay}>
            <MaterialIcons name="place" size={16} color="#FFF" />
            <ThemedText style={styles.locationText}>
              {params.location_name ?? "Unknown Location"}
            </ThemedText>
          </View>
        </View>

        {/* ── Content ── */}
        <View style={styles.content}>
          {/* Title row */}
          <View style={styles.titleRow}>
            <ThemedText style={styles.title} numberOfLines={2}>
              {params.title}
            </ThemedText>
            <View style={styles.scoreBadge}>
              <ThemedText style={styles.scoreLabel}>SCORE</ThemedText>
              <ThemedText style={styles.scoreValue}>
                {score.toFixed(1)}
              </ThemedText>
            </View>
          </View>

          {/* Meta row */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialIcons name="schedule" size={14} color="#888" />
              <ThemedText style={styles.metaText}>
                {params.created_at
                  ? `${formatDate(params.created_at)} • ${formatTime(params.created_at)}`
                  : "Unknown date"}
              </ThemedText>
            </View>
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={18} color="#D4A017" />
            <ThemedText style={styles.ratingValue}>
              {rating.toFixed(1)}
            </ThemedText>
            <ThemedText style={styles.ratingLabel}>community rating</ThemedText>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <ThemedText style={styles.sectionTitle}>Description</ThemedText>
          <ThemedText style={styles.descriptionText}>
            {params.description}
          </ThemedText>

          {/* AI Summary */}
          {params.ai_summary ? (
            <>
              <View style={styles.aiCard}>
                <View style={styles.aiHeader}>
                  <MaterialIcons
                    name="auto-awesome"
                    size={16}
                    color={primaryColor}
                  />
                  <ThemedText style={styles.aiTitle}>AI Analysis</ThemedText>
                </View>
                <ThemedText style={styles.aiText}>
                  {params.ai_summary}
                </ThemedText>
              </View>
            </>
          ) : null}

          {/* Location Details */}
          <ThemedText style={styles.sectionTitle}>Location</ThemedText>
          <View style={styles.locationCard}>
            <MaterialIcons name="place" size={20} color={primaryColor} />
            <View style={styles.locationDetails}>
              <ThemedText style={styles.locationName}>
                {params.location_name ?? "Unknown Location"}
              </ThemedText>
              <ThemedText style={styles.coordinates}>
                {params.latitude}, {params.longitude}
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom Action Bar ── */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable style={styles.commentButton}>
          <MaterialIcons name="chat-bubble-outline" size={18} color={primaryColor} />
          <ThemedText style={styles.commentButtonText}>Comment</ThemedText>
        </Pressable>
        <Pressable style={styles.reportButton}>
          <MaterialIcons name="report-problem" size={18} color="#FFF" />
          <ThemedText style={styles.reportButtonText}>Report Issue</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E8D3",
  },

  // Hero image
  imageContainer: {
    height: 280,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: "absolute",
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  severityBadge: {
    position: "absolute",
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  severityText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  locationOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // Content
  content: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: "#11181C",
    lineHeight: 28,
  },
  scoreBadge: {
    backgroundColor: "#F0F7F0",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D4EDDA",
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "#8B9A7E",
    letterSpacing: 0.5,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "800",
    color: primaryColor,
    lineHeight: 28,
  },

  metaRow: {
    marginTop: 10,
    gap: 6,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: "#888",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  ratingValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#8B7000",
  },
  ratingLabel: {
    fontSize: 13,
    color: "#AAA",
  },

  divider: {
    height: 1,
    backgroundColor: "#ECECEC",
    marginVertical: 18,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
    marginBottom: 18,
  },

  // AI card
  aiCard: {
    backgroundColor: "#F0F7F0",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#D4EDDA",
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: primaryColor,
  },
  aiText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444",
  },

  // Location card
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
    marginBottom: 20,
  },
  locationDetails: {
    flex: 1,
    gap: 2,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  coordinates: {
    fontSize: 12,
    color: "#999",
  },

  // Bottom bar
  bottomBar: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
  },
  commentButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: primaryColor,
    backgroundColor: "#FFF",
  },
  commentButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: primaryColor,
  },
  reportButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: primaryColor,
  },
  reportButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
  },
});

import {
  CommunityFeedCard,
} from "@/components/community-feed-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  TopRegionsCard,
  RegionData,
} from "@/components/top-regions-card";
import { primaryColor } from "@/constants/theme";
import { Report } from "@/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Mock Data ──────────────────────────────────────────────

const MOCK_REGIONS: RegionData[] = [
  { name: "North District", score: 8.2 },
  { name: "East Riverside", score: 7.4 },
  { name: "West Industrial", score: 6.8 },
];

const MOCK_FEED_REPORTS: Report[] = [
  {
    id: "f1",
    image:
      "https://images.unsplash.com/photo-1526749837599-b4eba9fd855e?w=600",
    title: "Chemical Odor Alert",
    description:
      "Significant chemical odor detected near the main factory outlet. Visibility is reduced by...",
    latitude: -6.2,
    longitude: 106.8,
    pollution_score: 5.0,
    rating: 4.5,
    status: "PUBLISHED",
    created_at: "2023-10-24T10:45:00Z",
    ai_summary: "Chemical odor detected near factory.",
    privacy: "PUBLIC",
    location_name: "Old Industrial Zone",
    severity: "CRITICAL",
  },
  {
    id: "f2",
    image:
      "https://images.unsplash.com/photo-1493673272479-a20888bcee10?w=600",
    title: "River Accumulation",
    description:
      "Plastic accumulation near the river bend. Needs immediate cleanup before the upcoming rain.",
    latitude: -6.2,
    longitude: 106.8,
    pollution_score: 2.8,
    rating: 4.5,
    status: "PUBLISHED",
    created_at: "2023-10-20T14:30:00Z",
    ai_summary: "Plastic accumulation near river bend.",
    privacy: "PUBLIC",
    location_name: "Green Valley Creek",
    severity: "MODERATE",
  },
];

// ── Component ──────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const totalReports = 14; // TODO: fetch from API

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero Header ── */}
        <LinearGradient
          colors={[primaryColor, "#1B4B1E", "#2A5C2E"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroGradient, { paddingTop: insets.top + 16 }]}
        >
          {/* Greeting row */}
          <View style={styles.greetingRow}>
            <Image
              source={require("@/assets/images/profile-placeholder.png")}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.greetingBubble}>
              <ThemedText style={styles.greetingText}>Hello, User</ThemedText>
            </View>
            <View style={{ flex: 1 }} />
            <Pressable>
              <MaterialIcons
                name="more-vert"
                size={22}
                color="rgba(255,255,255,0.7)"
              />
            </Pressable>
          </View>

          {/* Report count card */}
          <View style={styles.reportCountCard}>
            <View style={styles.reportLabelRow}>
              <MaterialIcons
                name="description"
                size={14}
                color="rgba(255,255,255,0.7)"
              />
              <ThemedText style={styles.reportLabel}>REPORTS</ThemedText>
            </View>
            <ThemedText style={styles.reportCount}>{totalReports}</ThemedText>
          </View>
        </LinearGradient>

        {/* ── Top 10 Regions ── */}
        <View style={styles.section}>
          <TopRegionsCard
            regions={MOCK_REGIONS}
            onViewFullAnalysis={() => {
              // TODO: navigate to full analysis
              console.log("View full analysis");
            }}
          />
        </View>

        {/* ── Community Feed ── */}
        <View style={styles.section}>
          <View style={styles.feedHeader}>
            <ThemedText style={styles.feedTitle}>Community Feed</ThemedText>
            <Pressable>
              <ThemedText style={styles.feedFilter}>Most Recent</ThemedText>
            </Pressable>
          </View>

          {MOCK_FEED_REPORTS.map((report) => (
            <CommunityFeedCard
              key={report.id}
              report={report}
              onCommentPress={(r) =>
                console.log("Comment on:", r.id)
              }
              onReportPress={(r) =>
                console.log("Report:", r.id)
              }
            />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

// ── Styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Hero
  heroGradient: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  greetingBubble: {
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  greetingText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  reportCountCard: {
    backgroundColor: "rgba(0,0,0,0.20)",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  reportLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  reportLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1,
  },
  reportCount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 38,
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 14,
  },

  // Feed header
  feedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#11181C",
  },
  feedFilter: {
    fontSize: 13,
    fontWeight: "500",
    color: "#687076",
  },
});

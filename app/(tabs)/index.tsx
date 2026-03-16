import { CommentBottomSheet } from "@/components/comment-bottom-sheet";
import { CommunityFeedCard } from "@/components/community-feed-card";
import { RatingBottomSheet } from "@/components/rating-bottom-sheet";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { RegionData, TopRegionsCard } from "@/components/top-regions-card";
import { primaryColor } from "@/constants/theme";
import { useInfiniteReports, useReportStats } from "@/hooks/use-report";
import { Report, User } from "@/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { getItemAsync } from "expo-secure-store";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Mock Data ──────────────────────────────────────────────

const MOCK_REGIONS: RegionData[] = [
  { name: "North District", score: 8.2 },
  { name: "East Riverside", score: 7.4 },
  { name: "West Industrial", score: 6.8 },
];

// ── Component ──────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | null>(null);

  const [selectedReportId, setSelectedReportId] = useState<string>("");
  const commentSheetRef = useRef<BottomSheet>(null);
  const ratingSheetRef = useRef<BottomSheet>(null);

  const {
    data: reportStats,
    isLoading: isReportStatsLoading,
    refetch: reportStatsRefetch,
    error: reportStatsError,
  } = useReportStats({
    user_created: user?.id,
    enabled: !!user?.id,
  });
  const {
    data,
    fetchNextPage,
    isLoading,
    refetch,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    error,
  } = useInfiniteReports({ privacy: "PUBLIC" });

  const allReports = data?.pages.flatMap((page) => page.data) || [];
  const totalReports = reportStats?.count.id || 0;

  function handleCardPress(report: Report & { user_created?: User }) {
    const { user_created, ...rest } = report;
    router.push({
      pathname: "/report-detail",
      params: {
        ...rest,
        username: user_created?.username,
      },
    });
  }

  const getUser = async () => {
    const user = await getItemAsync("user");

    if (user) {
      setUser(JSON.parse(user));
    }

    return null;
  };

  useFocusEffect(() => {
    getUser();
  });

  const avatar = user?.avatar
    ? { uri: `${process.env.EXPO_PUBLIC_BASE_API_URL}/assets/${user.avatar}` }
    : require("@/assets/images/avatar-placeholder.png");

  // ── Render Header (Hero + Regions) ───────────────────────
  const renderHeader = () => (
    <View>
      {/* ── Hero Header ── */}
      <LinearGradient
        colors={["#1A3D1C", "#143416", "#0A1B0B", "#0A1B0B"]}
        locations={[0, 0.3, 0.7, 1]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.heroGradient, { paddingTop: insets.top + 16 }]}
      >
        {/* Greeting row */}
        <View style={styles.greetingRow}>
          <Image source={avatar} style={styles.avatar} contentFit="cover" />
          <View style={styles.greetingBubble}>
            <ThemedText style={styles.greetingText}>
              Hello, {user?.username || "User"}
            </ThemedText>
          </View>
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
            console.log("View full analysis");
          }}
        />
      </View>

      {/* ── Community Feed Header ── */}
      <View style={[styles.section, { marginBottom: 8 }]}>
        <View style={styles.feedHeader}>
          <ThemedText style={styles.feedTitle}>Community Feed</ThemedText>
          <Pressable>
            <ThemedText style={styles.feedFilter}>Most Recent</ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );

  // ── Render Footer (Load More) ────────────────────────────
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={primaryColor} />
      </View>
    );
  };

  // ── Render Item ──────────────────────────────────────────
  const renderItem: ListRenderItem<Report> = ({ item }) => (
    <View style={{ paddingHorizontal: 16 }}>
      <CommunityFeedCard
        report={item}
        onCardPress={handleCardPress}
        onCommentPress={(r) => {
          setSelectedReportId(r.id);
          commentSheetRef.current?.snapToIndex(0);
        }}
        onRatingPress={(r) => {
          setSelectedReportId(r.id);
          ratingSheetRef.current?.snapToIndex(0);
        }}
        onReportPress={(r) => console.log("Report:", r.id)}
      />
    </View>
  );

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={primaryColor} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={allReports}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={primaryColor}
            colors={[primaryColor]}
          />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
      />

      <CommentBottomSheet reportId={selectedReportId} ref={commentSheetRef} />
      <RatingBottomSheet reportId={selectedReportId} ref={ratingSheetRef} />
    </ThemedView>
  );
}

// ── Styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 16,
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

  // Footer loader
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

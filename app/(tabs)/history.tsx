import { ReportHistoryCard } from "@/components/report-history-card";
import { ReportSummaryCard } from "@/components/report-summary-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { primaryColor } from "@/constants/theme";
import { useInfiniteReports, useReportStats } from "@/hooks/use-report";
import { Report } from "@/types";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const {
    data: reportStats,
    isLoading: isReportStatsLoading,
    error: reportStatsError,
  } = useReportStats();
  const {
    data,
    fetchNextPage,
    isLoading,
    refetch,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    error,
  } = useInfiniteReports();

  if (error || reportStatsError) {
    Alert.alert(
      "Error fetching reports",
      error?.message || reportStatsError?.message,
    );
  }

  const allReports = data?.pages.flatMap((page) => page.data) || [];
  const totalReports = data?.pages[0]?.meta?.total_count || 0;
  const averageScore = Number(reportStats?.avg?.pollution_score || 0);

  const handleDetailsPress = (report: Report) => {
    router.push({
      pathname: "/report-detail",
      params: {
        id: report.id,
        image: report.photo,
        description: report.description,
        pollution_score: String(report.pollution_score),
        rating: String(report.avg_rating),
        ai_summary: report.ai_summary,
        created_at: report.date_created,
        latitude: String(report.latitude),
        longitude: String(report.longitude),
      },
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Header */}
      <ThemedText type="title">Report History</ThemedText>

      {/* Summary stats */}
      <ReportSummaryCard
        totalReports={totalReports}
        averageScore={averageScore}
      />
    </View>
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Report cards */}
      <FlatList
        data={allReports}
        contentContainerStyle={styles.contentContainer}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              color={primaryColor}
              style={styles.footerLoader}
            />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={primaryColor} //IOS spinner color
            colors={[primaryColor]} //Android spinner color
          />
        }
        // ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <ReportHistoryCard
            report={item}
            onDetailsPress={handleDetailsPress}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  contentContainer: {
    paddingBottom: 32,
    gap: 12,
  },
  footerLoader: {
    paddingVertical: 20,
  },
});

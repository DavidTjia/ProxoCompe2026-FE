import { ReportHistoryCard } from "@/components/report-history-card";
import { ReportSummaryCard } from "@/components/report-summary-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Report } from "@/types";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// TODO: Replace with real data from API (useInfiniteReports)
const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1526749837599-b4eba9fd855e?w=400",
    title: "Heavy Smog Detected",
    description: "Heavy smog detected near main road",
    latitude: -6.2,
    longitude: 106.8,
    pollution_score: 7.6,
    rating: 4.5,
    status: "PUBLISHED",
    created_at: "2023-10-24T10:45:00Z",
    ai_summary: "Heavy smog detected in the area.",
    privacy: "PUBLIC",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",
    title: "Vehicle Emissions",
    description: "High vehicle emissions at intersection",
    latitude: -6.2,
    longitude: 106.8,
    pollution_score: 6.0,
    rating: 4.5,
    status: "PUBLISHED",
    created_at: "2023-10-15T08:30:00Z",
    ai_summary: "Vehicle emission levels above normal.",
    privacy: "PUBLIC",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1493673272479-a20888bcee10?w=400",
    title: "Open Waste Burning",
    description: "Open waste burning near residential area",
    latitude: -6.2,
    longitude: 106.8,
    pollution_score: 8.2,
    rating: 0,
    status: "DRAFT",
    created_at: "2023-10-12T18:00:00Z",
    ai_summary: "Open waste burning detected.",
    privacy: "ONLY_ME",
  },
];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();

  const totalReports = MOCK_REPORTS.length;

  const averageScore = useMemo(() => {
    if (MOCK_REPORTS.length === 0) return 0;
    const sum = MOCK_REPORTS.reduce((acc, r) => acc + r.pollution_score, 0);
    return sum / MOCK_REPORTS.length;
  }, []);

  const handleDetailsPress = (report: Report) => {
    router.push({
      pathname: "/report-detail",
      params: {
        id: report.id,
        image: report.image,
        title: report.title,
        description: report.description,
        pollution_score: String(report.pollution_score),
        rating: String(report.rating),
        location_name: report.location_name ?? "",
        severity: report.severity ?? "LOW",
        ai_summary: report.ai_summary,
        created_at: report.created_at,
        latitude: String(report.latitude),
        longitude: String(report.longitude),
      },
    });
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <ThemedText type="title" style={styles.header}>
        Report History
      </ThemedText>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary stats */}
        <ReportSummaryCard
          totalReports={totalReports}
          averageScore={averageScore}
        />

        {/* Report cards */}
        {MOCK_REPORTS.map((report) => (
          <ReportHistoryCard
            key={report.id}
            report={report}
            onDetailsPress={handleDetailsPress}
          />
        ))}
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
    fontStyle: "italic",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
});

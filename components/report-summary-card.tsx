import { primaryColor } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

type Props = {
  totalReports: number;
  averageScore: number;
};

export function ReportSummaryCard({ totalReports, averageScore }: Props) {
  return (
    <View style={styles.container}>
      {/* Total Reports */}
      <View style={styles.stat}>
        <ThemedText style={styles.label}>Total Reports</ThemedText>
        <ThemedText style={styles.value}>{totalReports}</ThemedText>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Avg Score */}
      <View style={styles.stat}>
        <ThemedText style={styles.label}>Avg. Score</ThemedText>
        <ThemedText style={styles.value}>{averageScore.toFixed(1)}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: primaryColor,
    borderRadius: 20,
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
  value: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 42,
  },
  divider: {
    width: 1,
    height: "70%",
    backgroundColor: "rgba(255,255,255,0.25)",
    marginHorizontal: 16,
  },
});

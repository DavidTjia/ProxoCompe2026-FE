import { primaryColor } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

export type RegionData = {
  name: string;
  score: number;
};

type Props = {
  regions: RegionData[];
  onViewFullAnalysis?: () => void;
};

const BAR_COLORS = ["#2E7D32", "#43A047", "#66BB6A", "#81C784", "#A5D6A7"];

function getBarColor(index: number): string {
  return BAR_COLORS[Math.min(index, BAR_COLORS.length - 1)];
}

function getBarWidth(score: number, maxScore: number): number {
  return Math.max(10, (score / maxScore) * 100);
}

export function TopRegionsCard({ regions, onViewFullAnalysis }: Props) {
  const maxScore = Math.max(...regions.map((r) => r.score), 1);
  const displayRegions = regions.slice(0, 3);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Top 10 Regions</ThemedText>
        <Pressable onPress={onViewFullAnalysis}>
          <MaterialIcons name="north-east" size={18} color={primaryColor} />
        </Pressable>
      </View>

      {/* Region rows */}
      {displayRegions.map((region, index) => (
        <View key={region.name} style={styles.regionRow}>
          <View style={styles.regionInfo}>
            <ThemedText style={styles.regionName}>{region.name}</ThemedText>
            <ThemedText style={styles.regionScore}>
              PS {region.score.toFixed(1)}
            </ThemedText>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${getBarWidth(region.score, maxScore)}%`,
                  backgroundColor: getBarColor(index),
                },
              ]}
            />
          </View>
        </View>
      ))}

      {/* View Full Analysis */}
      <Pressable style={styles.viewAllRow} onPress={onViewFullAnalysis}>
        <ThemedText style={styles.viewAllText}>View Full Analysis</ThemedText>
        <MaterialIcons name="chevron-right" size={18} color={primaryColor} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#11181C",
  },

  regionRow: {
    marginBottom: 14,
  },
  regionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  regionName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  regionScore: {
    fontSize: 13,
    fontWeight: "600",
    color: primaryColor,
  },

  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E8E8E8",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
  },

  viewAllRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    gap: 2,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: primaryColor,
  },
});

import { primaryColor } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "./themed-text";

export type RegionData = {
  province: string;
  avg: {
    pollution_score: number;
  };
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

function RegionRow({
  region,
  index,
  maxScore,
}: {
  region: RegionData;
  index: number;
  maxScore: number;
}) {
  return (
    <View style={styles.regionRow}>
      <View style={styles.regionInfo}>
        <ThemedText style={styles.regionName}>{region.province}</ThemedText>
        <ThemedText style={styles.regionScore}>
          PS {Number(region.avg.pollution_score).toFixed(1)}
        </ThemedText>
      </View>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              width: `${getBarWidth(region.avg.pollution_score, maxScore)}%`,
              backgroundColor: getBarColor(index),
            },
          ]}
        />
      </View>
    </View>
  );
}

export function TopRegionsCard({ regions, onViewFullAnalysis }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [extraHeight, setExtraHeight] = useState(0);

  const maxScore = Math.max(...regions.map((r) => r.avg.pollution_score), 1);

  const top3Regions = regions.slice(0, 3);
  const restRegions = regions.slice(3, 10);

  const accordionStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(isExpanded ? extraHeight : 0, { duration: 300 }),
    };
  });

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <ThemedText style={styles.title}>Top 10 Regions</ThemedText>
          <Pressable
            onPress={() =>
              Alert.alert(
                "Top Regions",
                "This is a list of the most frequently reported areas, sorted by severity.",
              )
            }
          >
            <MaterialIcons name="info-outline" size={20} color="#687076" />
          </Pressable>
        </View>
      </View>

      {/* Region rows */}
      {regions.length === 0 ? (
        <ThemedText style={styles.emptyText}>No Data Available Yet</ThemedText>
      ) : (
        <View>
          {top3Regions.map((region, index) => (
            <RegionRow
              key={region.province}
              region={region}
              index={index}
              maxScore={maxScore}
            />
          ))}

          <Animated.View style={[accordionStyle, { overflow: "hidden" }]}>
            <View
              style={{ position: "absolute", top: 0, left: 0, right: 0 }}
              onLayout={(e) => {
                const h = e.nativeEvent.layout.height;
                if (h > 0 && extraHeight !== h) setExtraHeight(h);
              }}
            >
              {restRegions.map((region, index) => (
                <RegionRow
                  key={region.province}
                  region={region}
                  index={index + 3}
                  maxScore={maxScore}
                />
              ))}
            </View>
          </Animated.View>
        </View>
      )}

      {regions.length > 3 && (
        <Pressable
          style={styles.viewAllRow}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <ThemedText style={styles.viewAllText}>
            View {isExpanded ? "Less" : "More"}
          </ThemedText>
          <MaterialIcons
            name={isExpanded ? "expand-less" : "expand-more"}
            size={20}
            color={primaryColor}
          />
        </Pressable>
      )}
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

  emptyText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
});

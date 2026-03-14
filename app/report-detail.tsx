import HeaderCst from "@/components/header-cst";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { primaryColor } from "@/constants/theme";
import { Image } from "expo-image";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportDetailScreen() {
  const latitude = 1.4166462762303433;
  const longitude = 124.98807019370982;

  const photo = require("@/assets/images/upload-img-placeholder.png");

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <HeaderCst title="Report Details" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* PHOTO */}
        <View style={styles.imageContainer}>
          <Image source={photo} style={styles.image} contentFit="cover" />

          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>HIGH URGENCY</ThemedText>
          </View>
        </View>

        {/* TITLE */}
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <ThemedText type="title">Riverbank Plastic Pollution</ThemedText>

            <ThemedText style={styles.location}>
              📍 Eastwood River Park, Sector 4
            </ThemedText>

            <ThemedText style={styles.reported}>
              Reported by Alex G • 2 hours ago
            </ThemedText>
          </View>

          <View style={styles.score}>
            <ThemedText style={styles.scoreLabel}>SCORE</ThemedText>
            <ThemedText style={styles.scoreNumber}>8.4</ThemedText>
          </View>
        </View>

        {/* AI SUMMARY */}
        <View style={styles.aiBox}>
          <View style={styles.aiHeader}>
            <IconSymbol name="sparkles" size={18} color={primaryColor} />
            <ThemedText style={styles.aiTitle}>AI ANALYSIS SUMMARY</ThemedText>
          </View>

          <ThemedText style={styles.aiText}>
            Multiple instances of non-biodegradable synthetic waste detected.
            This accumulation poses a significant risk to local aquatic fauna
            and may cause drainage blockage if not addressed before the rainy
            season. Estimated volume: 1.2 cubic meters.
          </ThemedText>
        </View>

        {/* DESCRIPTION */}
        <View>
          <ThemedText type="subtitle">Detailed Description</ThemedText>

          <ThemedText style={styles.description}>
            Found a massive pile of discarded plastic bottles, industrial
            packaging, and old fishing nets near the northern bridge of Eastwood
            River. The water seems to have been washed up during the high tide
            last night. The smell of stagnant water is starting to become
            noticeable.
          </ThemedText>
        </View>

        {/* LOCATION */}
        <View>
          <ThemedText type="subtitle">Location</ThemedText>

          <View style={styles.mapContainer}>
            <MapView
              style={{ flex: 1 }}
              mapType="standard"
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker coordinate={{ latitude, longitude }} />
            </MapView>
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn}>
            <IconSymbol name="star" size={20} color={primaryColor} />
            <ThemedText>Rate</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <IconSymbol name="bubble.left" size={20} color={primaryColor} />
            <ThemedText>Comment</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <IconSymbol name="exclamationmark.circle" size={20} color="red" />
            <ThemedText style={{ color: "red" }}>Report</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3E8D3",
  },

  container: {
    padding: 16,
    gap: 20,
  },

  imageContainer: {
    borderRadius: 20,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 220,
  },

  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#E53935",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    color: "white",
    fontSize: 12,
  },

  titleRow: {
    flexDirection: "row",
    gap: 12,
  },

  location: {
    marginTop: 4,
    color: "#6B7B6B",
  },

  reported: {
    color: "#6B7B6B",
    fontSize: 12,
  },

  score: {
    backgroundColor: primaryColor,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  scoreLabel: {
    fontSize: 10,
    color: "white",
  },

  scoreNumber: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  aiBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: primaryColor,
    borderRadius: 12,
    padding: 12,
  },

  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },

  aiTitle: {
    fontWeight: "bold",
  },

  aiText: {
    fontSize: 13,
    color: "#4B5563",
  },

  description: {
    marginTop: 6,
    color: "#374151",
  },

  mapContainer: {
    marginTop: 8,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  actionBtn: {
    flex: 1,
    backgroundColor: "#E5E5E5",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    gap: 4,
  },
});

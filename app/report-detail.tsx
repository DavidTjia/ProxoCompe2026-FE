import { CommentBottomSheet } from "@/components/comment-bottom-sheet";
import HeaderCst from "@/components/header-cst";
import { RatingBottomSheet } from "@/components/rating-bottom-sheet";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { primaryColor } from "@/constants/theme";
import { useDeleteReport } from "@/hooks/use-report";
import { Report, User } from "@/types";
import { getPollutionStatus } from "@/utils/status-mapping";
import BottomSheet from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { reverseGeocodeAsync } from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getItemAsync } from "expo-secure-store";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReportDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Report>();
  const [user, setUser] = useState<User | null>(null);
  const { mutate: deleteReport } = useDeleteReport();
  const router = useRouter();

  const ratingSheetRef = useRef<BottomSheet>(null);
  const commentSheetRef = useRef<BottomSheet>(null);

  const pollutionStatus = getPollutionStatus(
    Number(params.pollution_score || 0),
  );
  const [address, setAddress] = useState("");

  const isUserReport = user?.id === params.user_id;

  const getAddress = useCallback(async () => {
    try {
      const { latitude, longitude } = params;
      const address = await reverseGeocodeAsync({
        latitude: Number(latitude),
        longitude: Number(longitude),
      });

      setAddress(address?.[0]?.formattedAddress || "");
    } catch (error) {
      console.log("error address", error);
    }
  }, [params]);

  const getUser = async () => {
    const user = await getItemAsync("user");

    if (user) {
      setUser(JSON.parse(user));
    }

    return null;
  };

  useEffect(() => {
    getAddress();
    getUser();
  }, [getAddress]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteReport(params.id as string, {
              onSuccess: () => {
                router.back();
              },
            });
          },
        },
      ],
    );
  };

  const handleOpenRating = useCallback(() => {
    ratingSheetRef.current?.snapToIndex(0);
  }, []);

  const handleOpenComments = useCallback(() => {
    commentSheetRef.current?.snapToIndex(0);
  }, []);

  return (
    <ThemedView
      style={[
        styles.safeArea,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.headerContainer}>
        <HeaderCst title="Report Detail" />
        {isUserReport && (
          <TouchableOpacity
            style={styles.headerDeleteBtn}
            onPress={handleDelete}
          >
            <IconSymbol name="trash" size={22} color="red" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* PHOTO */}
        <View style={styles.imageContainer}>
          <Image
            source={`${process.env.EXPO_PUBLIC_BASE_API_URL}/assets/${params.photo}`}
            style={styles.image}
            contentFit="contain"
          />

          <View
            style={[
              styles.badge,
              {
                backgroundColor: pollutionStatus.color,
              },
            ]}
          >
            <ThemedText style={styles.badgeText}>
              {pollutionStatus.level}
            </ThemedText>
          </View>
        </View>

        {/* TITLE */}
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            {/* <ThemedText type="title"></ThemedText> */}

            <ThemedText style={styles.location}>📍 {address}</ThemedText>

            <ThemedText style={styles.reported}>
              Reported by {params.username} • 2 hours ago
            </ThemedText>
            
            <ThemedText style={styles.reported}>
              ⭐ {Number(params.avg_rating || 0).toFixed(1)} Average Rating
            </ThemedText>
          </View>

          <View
            style={[styles.score, { backgroundColor: pollutionStatus.color }]}
          >
            <ThemedText style={styles.scoreLabel}>SCORE</ThemedText>
            <ThemedText style={styles.scoreNumber}>
              {Number(params.pollution_score).toFixed(1)}
            </ThemedText>
          </View>
        </View>

        {/* AI SUMMARY */}
        <View style={styles.aiBox}>
          <View style={styles.aiHeader}>
            <IconSymbol name="sparkles" size={18} color={primaryColor} />
            <ThemedText style={styles.aiTitle}>AI ANALYSIS SUMMARY</ThemedText>
          </View>

          <ThemedText style={styles.aiText}>{params.ai_summary}</ThemedText>
        </View>

        {/* DESCRIPTION */}
        <View>
          <ThemedText type="subtitle">Detailed Description</ThemedText>

          <ThemedText style={styles.description}>
            {params.description}
          </ThemedText>
        </View>

        {/* LOCATION */}
        <View>
          <ThemedText type="subtitle">Location</ThemedText>

          <View style={styles.mapContainer}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: Number(params.latitude),
                longitude: Number(params.longitude),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: Number(params.latitude),
                  longitude: Number(params.longitude),
                }}
              />
            </MapView>
          </View>
        </View>

        {/* ACTION BUTTONS */}
        {params.privacy === "PUBLIC" && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleOpenRating}
            >
              <IconSymbol name="star" size={20} color={primaryColor} />
              <ThemedText>Rate</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleOpenComments}
            >
              <IconSymbol name="bubble.left" size={20} color={primaryColor} />
              <ThemedText>Comment</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <IconSymbol
                iconSet="material-community"
                name="exclamationmark.circle"
                size={20}
                color="red"
              />
              <ThemedText style={{ color: "red" }}>Report</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sheets */}
      <RatingBottomSheet ref={ratingSheetRef} reportId={params.id as string} />
      <CommentBottomSheet
        ref={commentSheetRef}
        reportId={params.id as string}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 20,
  },
  imageContainer: {
    borderRadius: 24,
    overflow: "hidden",
    aspectRatio: 16 / 9,
    backgroundColor: "gray",
  },
  image: {
    width: "100%",
    flex: 1,
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#4f4f4f",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    textTransform: "capitalize",
  },

  titleRow: {
    alignItems: "flex-start",
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
    width: "100%",
    aspectRatio: 16 / 9,
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

  headerContainer: {
    position: "relative",
  },

  headerDeleteBtn: {
    padding: 8,
    position: "absolute",
    right: 16,
    top: 12,
    borderRadius: 20,
    zIndex: 10,
  },
});

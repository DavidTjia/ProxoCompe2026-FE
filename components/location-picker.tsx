import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Region } from "react-native-maps";

type Props = {
  onSelect: (data: {
    latitude: number;
    longitude: number;
    address: string;
    district: string | null;
    city: string | null;
    province: string | null;
  }) => void;
};

export default function LocationPicker({ onSelect }: Props) {
  const [region, setRegion] = useState<Region>({
    latitude: -6.2,
    longitude: 106.8,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // GENERIC RETRY FUNCTION
  const retryAsync = async <T,>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000,
  ): Promise<T> => {
    try {
      return await fn();
    } catch (err) {
      if (retries <= 0) throw err;
      await new Promise((res) => setTimeout(res, delay));
      return retryAsync(fn, retries - 1, delay);
    }
  };

  // GET ADDRESS (WITH RETRY)
  const getAddress = async (lat: number, lng: number) => {
    try {
      const res = await retryAsync(() =>
        Location.reverseGeocodeAsync({ latitude: lat, longitude: lng }),
      );
      if (res.length > 0) {
        const addr = `${res[0].street || ""}, ${res[0].city || ""}`;
        setAddress(addr);
        setDistrict(res[0].district || null);
        setCity(res[0].subregion || res[0].city || null);
        setProvince(res[0].region || null);
      }
    } catch (err) {
      console.log("reverseGeocode error:", err);
      setAddress("Failed to get address");
      setDistrict(null);
      setCity(null);
      setProvince(null);
    }
  };

  // SEARCH LOCATION
  const handleSearch = async () => {
    if (!search) return;
    Keyboard.dismiss();
    setLoading(true);
    try {
      const result = await retryAsync(() => Location.geocodeAsync(search));
      if (result.length > 0) {
        const { latitude, longitude } = result[0];
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        getAddress(latitude, longitude);
      } else {
        Alert.alert("Not Found", "Location not found.");
      }
    } catch (err) {
      console.log("geocode error:", err);
      Alert.alert("Error", "Failed to search location. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // CHECK GPS ENABLED
  const checkGPS = async () => {
    const enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      Alert.alert(
        "GPS Off",
        "Please turn on your GPS / Location Services to continue.",
        [{ text: "OK" }],
      );
      return false;
    }
    return true;
  };

  // CURRENT LOCATION (WITH FULL HANDLING)
  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const gpsEnabled = await checkGPS();
      if (!gpsEnabled) return;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }
      const loc = await retryAsync(() => Location.getCurrentPositionAsync({}));
      const newRegion = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      getAddress(newRegion.latitude, newRegion.longitude);
    } catch (err) {
      console.log("location error:", err);
      Alert.alert("Error", "Failed to get current location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pin Location</Text>
        <Text style={styles.headerSub}>Move the map to adjust your pin</Text>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchIcon}>
          <Text style={styles.searchIconText}>S</Text>
        </View>
        <TextInput
          placeholder="Search place... (e.g. Papua)"
          placeholderTextColor="#6B7280"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          style={styles.searchInput}
        />
        {loading && (
          <ActivityIndicator
            size="small"
            color="#4ADE80"
            style={styles.loader}
          />
        )}
      </View>

      {/* MAP AREA */}
      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          region={region}
          onRegionChangeComplete={(r) => {
            setRegion(r);
            getAddress(r.latitude, r.longitude);
          }}
        />

        {/* PIN CENTERED */}
        <View style={styles.pinWrapper} pointerEvents="none">
          <View style={styles.pinOuter}>
            <View style={styles.pinInner} />
          </View>
          <View style={styles.pinShadow} />
        </View>

        {/* CURRENT LOCATION BUTTON */}
        <TouchableOpacity style={styles.gpsBtn} onPress={getCurrentLocation}>
          <Text style={styles.gpsBtnText}>GPS</Text>
        </TouchableOpacity>
      </View>

      {/* ADDRESS CARD */}
      <View style={styles.addressCard}>
        <View style={styles.addressDot} />
        <View style={styles.addressTextWrapper}>
          <Text style={styles.addressLabel}>Selected Address</Text>
          <Text style={styles.addressValue} numberOfLines={2}>
            {loading
              ? "Fetching address..."
              : address || "Move map to detect address"}
          </Text>
        </View>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.retryBtn} onPress={getCurrentLocation}>
          <Text style={styles.retryBtnText}>Use My Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() =>
            onSelect({
              latitude: region.latitude,
              longitude: region.longitude,
              address,
              district,
              city,
              province,
            })
          }
        >
          <Text style={styles.confirmBtnText}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  // HEADER
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F8FAFC",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },

  // SEARCH
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#1E293B",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#4ADE80",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  searchIconText: {
    color: "#0F172A",
    fontWeight: "900",
    fontSize: 13,
  },
  searchInput: {
    flex: 1,
    color: "#F1F5F9",
    fontSize: 14,
    fontWeight: "500",
  },
  loader: {
    marginLeft: 8,
  },

  // MAP
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  // PIN
  pinWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  pinOuter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4ADE80",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -4,
    shadowColor: "#4ADE80",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  pinInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#0F172A",
  },
  pinShadow: {
    width: 12,
    height: 4,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  // GPS BUTTON
  gpsBtn: {
    position: "absolute",
    bottom: 14,
    right: 14,
    backgroundColor: "#1E293B",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  gpsBtnText: {
    color: "#4ADE80",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1,
  },

  // ADDRESS CARD
  addressCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#1E293B",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 12,
  },
  addressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4ADE80",
    marginTop: 4,
  },
  addressTextWrapper: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  addressValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E2E8F0",
    lineHeight: 20,
  },

  // ACTIONS
  actions: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
  },
  retryBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#1E293B",
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  retryBtnText: {
    color: "#94A3B8",
    fontWeight: "700",
    fontSize: 13,
  },
  confirmBtn: {
    flex: 2,
    paddingVertical: 14,
    backgroundColor: "#4ADE80",
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#4ADE80",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  confirmBtnText: {
    color: "#0F172A",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.3,
  },
});

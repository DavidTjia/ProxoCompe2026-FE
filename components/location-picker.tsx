import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
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
  const [search, setSearch] = useState("");

  // ✅ GET ADDRESS
  const getAddress = async (lat: number, lng: number) => {
    const res = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });

    if (res.length > 0) {
      const addr = `${res[0].street || ""}, ${res[0].city || ""}`;
      setAddress(addr);
    }
  };

  // ✅ SEARCH LOCATION (FIXED POSITION)
  const handleSearch = async () => {
    if (!search) return;

    Keyboard.dismiss(); // ✅ tutup keyboard setelah search

    try {
      const result = await Location.geocodeAsync(search);

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
      }
    } catch (err) {
      console.log("geocode error", err);
    }
  };

  // ✅ CURRENT LOCATION
  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const loc = await Location.getCurrentPositionAsync({});
    const newRegion = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setRegion(newRegion);
    getAddress(newRegion.latitude, newRegion.longitude);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* 🔍 SEARCH */}
      <View style={{ padding: 10, gap: 8 }}>
        <TextInput
          placeholder="Search location... (e.g. Papua)"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch} // ✅ tekan enter langsung search
          returnKeyType="search" // ✅ ubah tombol keyboard jadi "Search"
          style={{
            backgroundColor: "#eee",
            padding: 10,
            borderRadius: 10,
          }}
        />
      </View>

      <Text style={styles.address}>{address || "Loading..."}</Text>

      <MapView
        style={{ flex: 1 }}
        region={region}
        onRegionChangeComplete={(r) => {
          setRegion(r);
          getAddress(r.latitude, r.longitude);
        }}
      />

      {/* PIN */}
      <View style={styles.pin}>
        <Text style={{ fontSize: 30 }}>📍</Text>
      </View>

      {/* BUTTON */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={getCurrentLocation}>
          <Text>Use Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.confirm]}
          onPress={() =>
            onSelect({
              latitude: region.latitude,
              longitude: region.longitude,
              address,
            })
          }
        >
          <Text style={{ color: "#fff" }}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  address: {
    padding: 10,
    fontWeight: "600",
  },
  pin: {
    position: "absolute",
    top: "45%",
    left: "50%",
    marginLeft: -15,
  },
  actions: {
    padding: 10,
    gap: 10,
  },
  btn: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 10,
    alignItems: "center",
  },
  confirm: {
    backgroundColor: "green",
  },
});

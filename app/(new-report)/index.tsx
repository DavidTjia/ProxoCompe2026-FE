import ButtonCst from "@/components/button-cst";
import FullscreenLoader from "@/components/fullscreen-loader";
import HeaderCst from "@/components/header-cst";
import LocationPicker from "@/components/location-picker";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, primaryColor } from "@/constants/theme";
import { ReportForm, reportSchema } from "@/forms";
import { useLocationStore } from "@/hooks/use-location-store";
import { analyzePollution } from "@/utils/gemini-ai";
import { openCamera, openGallery } from "@/utils/image-picker";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function NewReportScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);
  const [locationName, setLocationName] = useState("");
  const [base64, setBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      photo: "",
      description: "",
      latitude: 0,
      longitude: 0,
      district: null,
      city: null,
      province: null,
    },
  });

  const photo = watch("photo");
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const { location, status, fetchLocation } = useLocationStore();

  useEffect(() => {
    if (status === "idle") {
      fetchLocation();
    }
  }, [status]);

  useEffect(() => {
    if (status === "success" && location) {
      if (latitude === 0 && longitude === 0) {
        setValue("latitude", location.latitude, { shouldValidate: true });
        setValue("longitude", location.longitude, { shouldValidate: true });
        setValue("district", location.district);
        setValue("city", location.city);
        setValue("province", location.province);
        setLocationName(location.address);
      }
    }
  }, [status, location]);

  const handleCamera = async () => {
    const res = await openCamera();
    if (res) {
      setValue("photo", res.uri, { shouldValidate: true });
      setBase64(res.base64 || "");
    }
    sheetRef.current?.close();
  };

  const handleGallery = async () => {
    const res = await openGallery();
    if (res) {
      setValue("photo", res.uri, { shouldValidate: true });
      setBase64(res.base64 || "");
    }
    sheetRef.current?.close();
  };

  const pickImage = () => {
    sheetRef.current?.expand();
  };

  const onSubmit = handleSubmit(async (data) => {
    const { photo, ...payload } = data;

    try {
      setLoading(true);
      const aiResponse = await analyzePollution(
        JSON.stringify(payload),
        base64,
      );

      router.replace({
        pathname: "/result",
        params: {
          ...data,
          aiResponse,
        },
      });
    } catch (err) {
      console.log("error analyze pollution :", err);
    } finally {
      setLoading(false);
    }
    //Sementara pake dummy for hemat token kwokowkwo :p
    // const aiResponse = `{"pollutionScore":0,"summary":"DATA INVALID: Description is gibberish and image shows no discernible pollution. Cannot perform environmental analysis."}`;
  });

  return (
    <>
      {loading && <FullscreenLoader />}
      {/* header */}
      <SafeAreaView edges={["top"]}>
        <HeaderCst title="Post Report" />
      </SafeAreaView>
      {/* content */}
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
      >
        <View>
          <ThemedText type="title">Submit Pollution Report</ThemedText>
          <ThemedText type="small" style={{ color: primaryColor + "70" }}>
            Help your community stay clean and healthy.
          </ThemedText>
        </View>

        <View style={{ gap: 12 }}>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Polution Photo
          </ThemedText>

          {/* PHOTO */}
          {photo ? (
            <View style={styles.imgContainer}>
              <Pressable
                onPress={() => {
                  setValue("photo", "");
                  setBase64("");
                }}
                style={styles.imgXBtn}
              >
                <IconSymbol
                  name="x.circle.fill"
                  size={24}
                  color={primaryColor}
                />
              </Pressable>
              <Image
                source={{ uri: photo }}
                contentFit="contain"
                style={{ width: "100%", flex: 1 }}
              />
            </View>
          ) : (
            <Pressable onPress={pickImage} style={styles.imgContainer}>
              <Image
                source={require("@/assets/images/upload-img-placeholder.png")}
                contentFit="contain"
                style={{ width: "100%", flex: 1 }}
              />
              <View style={styles.imgPlaceholder}>
                <IconSymbol
                  name="photo.badge.plus"
                  size={40}
                  color={primaryColor}
                />
                <ThemedText style={{ color: primaryColor }}>
                  Tap to take photo
                </ThemedText>
              </View>
            </Pressable>
          )}
          {errors.photo && (
            <ThemedText style={{ color: "red" }}>
              {errors.photo.message}
            </ThemedText>
          )}
        </View>

        {/* DESCRIPTION */}
        <View style={{ gap: 12 }}>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Description
          </ThemedText>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                multiline
                numberOfLines={5}
                placeholder="Describe the pollution problem... e.g., Oil spill in the creek, illegal dumping on the sidewalk."
                value={value}
                onChangeText={onChange}
                style={[
                  styles.textarea,
                  {
                    color: Colors[colorScheme ?? "light"].text,
                    // backgroundColor: Colors[colorScheme ?? "light"].background,
                    backgroundColor: "white",
                  },
                ]}
              />
            )}
          />

          {errors.description && (
            <ThemedText style={{ color: "red" }}>
              {errors.description.message}
            </ThemedText>
          )}
        </View>

        {/* LOCATION */}
        <View style={{ gap: 12 }}>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Location
          </ThemedText>

          <View style={styles.locationContainer}>
            <View style={styles.circle}>
              <IconSymbol name="location" size={22} color={primaryColor} />
            </View>

            <View style={{ flex: 1 }}>
              {status === "loading" ? (
                <ThemedText>Locating...</ThemedText>
              ) : status === "error" ? (
                <View>
                  <ThemedText style={{ color: "red" }}>Location Error</ThemedText>
                </View>
              ) : (
                <ThemedText numberOfLines={2}>
                  {`📍 ${locationName}` || "Location unavailable"}
                </ThemedText>
              )}
            </View>

            {status === "error" ? (
              <ButtonCst label="Retry" onPress={fetchLocation} />
            ) : (
              <ButtonCst label="Change" onPress={() => setShowMapPicker(true)} />
            )}
          </View>

          {(errors.latitude || errors.longitude) && (
            <ThemedText style={{ color: "red" }}>
              Location is required
            </ThemedText>
          )}
        </View>

        {/* MAP */}
        <View style={styles.mapContainer}>
          {latitude != 0 && longitude != 0 && (
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: latitude,
                  longitude: longitude,
                }}
              />
            </MapView>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <LinearGradient
        colors={["#fff", "#F3E8D3"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }} //bottom to top
        style={[styles.footer, { paddingBottom: insets.bottom }]}
      >
        <ButtonCst onPress={onSubmit} style={styles.submitBtn}>
          <IconSymbol name="sparkles" size={22} color="white" />
          <ThemedText style={styles.submitBtnText}>Analyze Report</ThemedText>
        </ButtonCst>
      </LinearGradient>

      {showMapPicker && (
        <Modal animationType="slide">
          <SafeAreaView style={{ flex: 1 }}>
            <LocationPicker
              onSelect={({ latitude, longitude, address, district, city, province }) => {
                setValue("latitude", latitude, { shouldValidate: true });
                setValue("longitude", longitude, { shouldValidate: true });
                setValue("district", district);
                setValue("city", city);
                setValue("province", province);

                setLocationName(address);
                setShowMapPicker(false);
              }}
            />
          </SafeAreaView>
        </Modal>
      )}

      <BottomSheet
        ref={sheetRef}
        index={-1} // -1 is closed, 0 is open
        enablePanDownToClose
        // backdropComponent={renderBackdrop}
      >
        <BottomSheetView
          style={[styles.sheetContainer, { paddingBottom: insets.bottom }]}
        >
          <TouchableOpacity style={styles.option} onPress={handleCamera}>
            <IconSymbol
              name="camera"
              size={22}
              color={Colors[colorScheme ?? "light"].text}
            />
            <ThemedText>Take Photo</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={handleGallery}>
            <IconSymbol
              name="photo"
              size={22}
              color={Colors[colorScheme ?? "light"].text}
            />
            <ThemedText>Choose from Gallery</ThemedText>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingVertical: 8,
    gap: 24,
  },
  subtitle: {
    fontWeight: "semibold",
  },
  imgContainer: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "gray",
    aspectRatio: 16 / 9,
    justifyContent: "center",
    alignItems: "center",
  },
  imgPlaceholder: {
    position: "absolute",
    alignItems: "center",
    gap: 4,
  },
  imgXBtn: {
    zIndex: 1,
    position: "absolute",
    top: 10,
    right: 10,
  },
  textarea: {
    borderRadius: 24,
    padding: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
  locationContainer: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  mapContainer: {
    aspectRatio: 16 / 9,
    width: "100%",
    overflow: "hidden",
    borderRadius: 24,
    backgroundColor: "#E2E8F0",
  },
  circle: {
    borderRadius: "50%",
    backgroundColor: "#14341610",
    padding: 10,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetContainer: {
    padding: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  footer: {
    padding: 24,
    paddingVertical: 8,
  },
  submitBtn: {
    backgroundColor: primaryColor,
    paddingVertical: 16,
    justifyContent: "center",
  },
  submitBtnText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});

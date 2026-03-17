import HeaderCst from "@/components/header-cst";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useUpdateUser } from "@/hooks/use-user";
import { User } from "@/types";
import { openCamera, openGallery } from "@/utils/image-picker";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { router } from "expo-router";
import { getItemAsync } from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);

  const [user, setUser] = useState<User | null>(null);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const { mutate: updateUser, isPending } = useUpdateUser();

  const handleCamera = async () => {
    const res = await openCamera();
    if (res) setImage(res.uri);
    sheetRef.current?.close();
  };

  const handleGallery = async () => {
    const res = await openGallery();
    if (res) setImage(res.uri);
    sheetRef.current?.close();
  };

  const pickImage = () => {
    sheetRef.current?.expand();
  };

  const handleSave = () => {
    if (!name || !email) {
      Alert.alert("Error", "Username and email cannot be empty");
      return;
    }

    const payload: any = {
      username: name,
      email: email,
      phone: phone,
    };

    if (image !== user?.avatar) payload.avatar = image;

    updateUser(
      {
        data: payload,
      },
      {
        onSuccess: () => {
          ToastAndroid.show("Profile updated successfully", ToastAndroid.SHORT);
          router.back();
        },
        onError: (err: any) => {
          console.log("UPDATE ERROR:", err);
          console.log("UPDATE ERROR DATA:", err?.response?.data);

          Alert.alert(
            "Error",
            err?.response?.data?.errors?.[0]?.message ||
              "Failed to update profile",
          );
        },
      },
    );
  };

  const getUser = async () => {
    const res = await getItemAsync("user");
    if (res) {
      const user = JSON.parse(res);

      setUser(user);
      setName(user.username);
      setEmail(user.email);
      setPhone(user.phone);
      setImage(user.avatar || "");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <HeaderCst title="Edit Profile" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* AVATAR */}
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          <Image
            source={
              image
                ? {
                    uri:
                      user?.avatar == image
                        ? `${process.env.EXPO_PUBLIC_BASE_API_URL}/assets/${image}`
                        : image,
                  }
                : require("@/assets/images/avatar-placeholder.png")
            }
            style={styles.avatar}
            contentFit="cover"
          />
        </TouchableOpacity>

        {/* FORM */}
        <View style={styles.form}>
          <View>
            <ThemedText style={styles.label}>Username</ThemedText>
            <View style={styles.inputContainer}>
              <TextInput
                value={name}
                placeholder="Safe earth..."
                onChangeText={setName}
                style={styles.input}
              />
              <IconSymbol
                iconSet="material-community"
                name="pencil"
                size={18}
                color="#777"
              />
            </View>
          </View>

          <View>
            <ThemedText style={styles.label}>Email</ThemedText>
            <View style={styles.inputContainer}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="safeearth@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
              <IconSymbol
                iconSet="material-community"
                name="pencil"
                size={18}
                color="#777"
              />
            </View>
          </View>

          <View>
            <ThemedText style={styles.label}>Phone Number</ThemedText>
            <View style={styles.inputContainer}>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+62123..."
                keyboardType="phone-pad"
                style={styles.input}
              />
              <IconSymbol
                iconSet="material-community"
                name="pencil"
                size={18}
                color="#777"
              />
            </View>
          </View>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={[styles.saveBtn, isPending && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={isPending}
        >
          <ThemedText style={styles.saveText}>
            {isPending ? "Saving..." : "Save Changes"}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>

      {/* IMAGE PICKER */}
      <BottomSheet ref={sheetRef} index={-1} enablePanDownToClose>
        <BottomSheetView
          style={[styles.sheetContainer, { paddingBottom: insets.bottom }]}
        >
          <TouchableOpacity style={styles.option} onPress={handleCamera}>
            <IconSymbol name="camera" size={22} color="black" />
            <ThemedText>Take Photo</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={handleGallery}>
            <IconSymbol name="photo" size={22} color="black" />
            <ThemedText>Choose from Gallery</ThemedText>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3E8D3",
  },
  container: {
    padding: 20,
    gap: 22,
  },
  avatarContainer: {
    alignSelf: "center",
    marginVertical: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#ffffff",
  },
  form: {
    gap: 18,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
  },
  saveBtn: {
    backgroundColor: "#0F3D1F",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "white",
    fontSize: 16,
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
});

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useReportStats } from "@/hooks/use-report";
import { useGetUser, useLogout } from "@/hooks/use-user";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [preview, setPreview] = useState(false);
  const { data: user, error } = useGetUser();
  const { data: reportStats } = useReportStats({
    user_created: user?.id,
    enabled: !!user?.id,
  });
  const { mutate } = useLogout();

  if (error) {
    Alert.alert("Error Profile", error.message);
  }

  const avatar = user?.avatar
    ? { uri: `${process.env.EXPO_PUBLIC_BASE_API_URL}/assets/${user.avatar}` }
    : require("@/assets/images/avatar-placeholder.png");

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        router.replace("/(auth)/signin");
      },
      onError: (error) => {
        Alert.alert("Error logout", error.message);
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <Text style={styles.header}>Profile</Text>

        {/* PROFILE */}
        <View style={styles.profileCard}>
          <Pressable onPress={() => setPreview(true)}>
            <Image source={avatar} style={styles.avatar} contentFit="cover" />
          </Pressable>

          <Text style={styles.name}>{user?.username ?? "User"}</Text>
          <Text style={styles.member}>Member since Oct 2023</Text>
        </View>

        {/* REPORT CARD */}
        <View style={styles.reportCard}>
          <View style={styles.reportRow}>
            <IconSymbol name="doc.text" size={18} color="#143416" />
            <Text style={styles.reportTitle}>REPORTS</Text>
          </View>

          <Text style={styles.reportNumber}>{reportStats?.count.id}</Text>
        </View>

        {/* ACCOUNT SETTINGS */}
        <Text style={styles.section}>ACCOUNT SETTINGS</Text>

        {/* EDIT PROFILE */}
        <TouchableOpacity
          style={styles.menu}
          onPress={() => router.push("/edit-profile")}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconCircle}>
              <IconSymbol name="person" size={18} color="#143416" />
            </View>

            <Text style={styles.menuText}>Edit Profile</Text>
          </View>

          <IconSymbol name="chevron.right" size={18} color="#888" />
        </TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <View style={styles.menuLeft}>
            <View style={styles.logoutCircle}>
              <IconSymbol name="arrow.right.square" size={18} color="red" />
            </View>

            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>

        {/* IMAGE PREVIEW */}
        <Modal visible={preview} transparent>
          <Pressable
            style={styles.previewContainer}
            onPress={() => setPreview(false)}
          >
            <Image source={avatar} style={styles.previewImage} />
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E6DCC8",
  },

  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#143416",
  },

  profileCard: {
    alignItems: "center",
    marginBottom: 25,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#EDEDED",
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
    color: "#143416",
  },

  member: {
    color: "#6B7B6B",
    marginTop: 3,
  },

  reportCard: {
    backgroundColor: "#E9E9E9",
    padding: 20,
    borderRadius: 22,
    marginBottom: 25,
  },

  reportRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  reportTitle: {
    color: "#143416",
    fontSize: 12,
    letterSpacing: 1,
  },

  reportNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
    color: "#143416",
    marginLeft: 2,
  },

  section: {
    color: "#6B7B6B",
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 12,
  },

  menu: {
    backgroundColor: "#E6DCC8",
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#c6c6c6",
    alignItems: "center",
    justifyContent: "center",
  },

  logoutCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },

  menuText: {
    fontSize: 16,
    color: "#143416",
  },

  logout: {
    marginTop: 8,
  },

  logoutText: {
    fontSize: 16,
    color: "red",
  },

  previewContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },

  previewImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
});

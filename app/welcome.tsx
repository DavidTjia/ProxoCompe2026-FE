import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/splash-icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>TilikKota</Text>

      {/* Sign In */}
      <TouchableOpacity
        style={styles.signinBtn}
        onPress={() => router.push("/(auth)/signin")}
      >
        <Text style={styles.signinText}>Sign In</Text>
      </TouchableOpacity>

      {/* Sign Up */}
      <TouchableOpacity
        style={styles.signupBtn}
        onPress={() => router.push("/(auth)/signup")}
      >
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Guest */}
      <TouchableOpacity>
        <Text style={styles.guest}>Continue as Guest →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6DCC8",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  logo: {
    width: 200,
    height: 200,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1C3D2F",
    marginBottom: 40,
  },

  signinBtn: {
    width: "100%",
    backgroundColor: "#0F3D1F",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
  },

  signinText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  signupBtn: {
    width: "100%",
    backgroundColor: "#8FAF78",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },

  signupText: {
    color: "#1C3D2F",
    fontSize: 16,
    fontWeight: "600",
  },

  guest: {
    color: "#1C3D2F",
    fontSize: 14,
  },
});

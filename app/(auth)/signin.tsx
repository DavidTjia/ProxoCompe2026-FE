import { ThemedView } from "@/components/themed-view";
import { useLogin } from "@/hooks/use-user";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useLogin();

  const handleLogin = () => {
    // validate
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    mutate(
      { email, password },
      {
        onSuccess: () => {
          router.replace("/(tabs)");
        },
        onError: (error) => {
          Alert.alert("Login Failed", error.message);
        },
      },
    );
  };

  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     Alert.alert("Error", "Please enter email and password");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const params = new URLSearchParams({
  //       "filter[email][_eq]": email,
  //       // "filter[password][_eq]": password,
  //       limit: "1",
  //     });

  //     const res = await fetch(
  //       `${process.env.EXPO_PUBLIC_BASE_API_URL}/items/users?${params.toString()}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${process.env.EXPO_PUBLIC_BASE_API_KEY}`,
  //         },
  //       },
  //     );

  //     const data = await res.json();
  //     console.log("LOGIN RESPONSE", data);
  //     if (res.status === 200) {
  //       console.log("LOGIN SUCCESS", data);

  //       router.replace("/(tabs)");
  //     } else {
  //       Alert.alert("Login Failed", "Email or password is incorrect");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     Alert.alert("Error", "Cannot connect to server");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <ThemedView
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1C3D2F" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Welcome Back</Text>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/splash-icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>TilikKota</Text>
          </View>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            placeholderTextColor="#8FA897"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>

          <View style={styles.passwordBox}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#8FA897"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#8FA897"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgot}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.button}
            disabled={isPending}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>
              {isPending ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          {/* Sign Up */}
          <View style={styles.bottomText}>
            <Text style={{ color: "#1C3D2F" }}>Don't have an account? </Text>

            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text style={styles.signup}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  wrapper: {
    padding: 24,
  },

  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    color: "#1C3D2F",
    marginTop: 10,
  },

  logoContainer: {
    alignItems: "center",
    marginVertical: 16,
  },

  logo: {
    width: 150,
    height: 150,
  },

  logoText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C3D2F",
    marginTop: 5,
  },

  label: {
    fontSize: 14,
    color: "#1C3D2F",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F5F5F5",
    padding: 14,
    borderRadius: 24,
    marginBottom: 18,
  },

  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingHorizontal: 14,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 14,
  },

  forgot: {
    alignItems: "flex-end",
    marginTop: 8,
    marginBottom: 30,
    marginRight: 4,
  },

  forgotText: {
    color: "#1C3D2F",
    fontSize: 13,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#143416",
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  bottomText: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  signup: {
    color: "#143416",
    fontWeight: "600",
  },
});

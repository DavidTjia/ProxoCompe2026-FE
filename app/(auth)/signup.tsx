import { ThemedView } from "@/components/themed-view";
import { useRegister } from "@/hooks/use-user";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  const { mutate, isPending, error } = useRegister();

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password does not match");
      return;
    }

    if (!agree) {
      Alert.alert("Error", "You must agree to Terms");
      return;
    }
    // console.log("Signing up with:", { username, email, password });

    mutate(
      { email, password, username },
      {
        onSuccess: () => {
          ToastAndroid.show("Account created successfully", ToastAndroid.SHORT);
          router.replace("/(auth)/signin");
        },
        onError: (error) => {
          Alert.alert("Error Signup", error.message);
        },
      },
    );
    // try {
    //   const res = await fetch(
    //     `${process.env.EXPO_PUBLIC_BASE_API_URL}/items/users`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${process.env.EXPO_PUBLIC_BASE_API_KEY}`,
    //       },
    //       body: JSON.stringify({
    //         email: email,
    //         password: password,
    //         username: username,
    //       }),
    //     },
    //   );

    //   const data = await res.json();

    //   if (res.status === 200 || res.status === 201) {
    //     Alert.alert("Success", "Account created successfully");

    //     router.replace("/(auth)/signin");
    //   } else {
    //     Alert.alert("Signup Failed", data?.errors?.[0]?.message || "Error");
    //   }
    // } catch (error) {
    //   console.log(error);
    //   Alert.alert("Error", "Cannot connect to server");
    // }
  };

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
          <Text style={styles.topTitle}>Sign Up</Text>
          <Text style={styles.mainTitle}>Create Account</Text>

          {/* Full Name */}
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#8FA897"
            value={username}
            onChangeText={setUsername}
          />

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            placeholderTextColor="#8FA897"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Create a password"
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

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm your password"
              placeholderTextColor="#8FA897"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#8FA897"
              />
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <View style={styles.termsRow}>
            <Checkbox
              value={agree}
              onValueChange={setAgree}
              color={agree ? "#89A978" : undefined}
            />

            <Text style={styles.termsText}>
              {" "}
              I agree to the <Text style={styles.link}>
                Terms of Service
              </Text>{" "}
              and <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <View style={styles.bottomText}>
            <Text style={{ color: "#1C3D2F" }}>Already have an account? </Text>

            <TouchableOpacity onPress={() => router.push("/(auth)/signin")}>
              <Text style={styles.signIn}>Sign In</Text>
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

  topTitle: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "#1C3D2F",
  },

  mainTitle: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    color: "#1C3D2F",
    marginBottom: 30,
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
    marginBottom: 18,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 14,
  },

  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  termsText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 13,
    color: "#1C3D2F",
  },

  link: {
    color: "#89A978",
  },

  button: {
    backgroundColor: "#143416",
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 18,
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

  signIn: {
    color: "#143416",
    fontWeight: "600",
  },
});

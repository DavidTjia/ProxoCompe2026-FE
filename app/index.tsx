import { ThemedText } from "@/components/themed-text";
import { primaryColor } from "@/constants/theme";
import { useRouter } from "expo-router";
import { getItemAsync } from "expo-secure-store";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

const AppScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const user = await getItemAsync("user");

      if (user) router.replace("/(tabs)");
      else router.replace("/welcome");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/splash-icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <ThemedText type="title" style={styles.title}>
        TilikKota
      </ThemedText>

      <ThemedText style={styles.subtitle}>For the Greater Future</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E8D3",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 200,
    height: 200,
  },

  title: {
    fontSize: 32,
    color: primaryColor,
    marginTop: 10,
  },

  subtitle: {
    color: "#7C9A8B",
    marginTop: 10,
  },
});

export default AppScreen;

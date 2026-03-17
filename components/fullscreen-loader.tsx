import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function FullscreenLoader() {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000050",
    zIndex: 999,
  },
});

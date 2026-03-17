import { primaryColor } from "@/constants/theme";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "./ui/icon-symbol";

const NewReportTab = () => {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      onPress={() => router.push("/(new-report)")}
      style={[styles.container, { bottom: insets.bottom + 12 }]}
    >
      <IconSymbol name="plus" size={32} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: primaryColor,
    padding: 8,
    borderRadius: "50%",
  },
});

export default NewReportTab;

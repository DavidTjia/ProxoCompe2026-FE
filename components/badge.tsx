import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type Props = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const Badge = ({ children, style }: Props) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    backgroundColor: "#14341610",
    borderWidth: 1,
    borderColor: "#14341630",
    gap: 8,
  },
});

export default Badge;

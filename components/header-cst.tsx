import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";

type Props = {
  title: string;
  onBackPress?: () => void;
};

const HeaderCst = ({ title, onBackPress }: Props) => {
  //   const router = useRouter();
  const colorScheme = useColorScheme();
  return (
    <ThemedView style={styles.container}>
      <Pressable onPress={() => onBackPress || router.back()}>
        <IconSymbol
          name="chevron.left"
          size={32}
          color={Colors[colorScheme ?? "light"].text}
        />
      </Pressable>

      <ThemedText style={styles.title} type="subtitle" numberOfLines={1}>
        {title}
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  title: {
    // flex: 1,
    fontSize: 18,
  },
});

export default HeaderCst;

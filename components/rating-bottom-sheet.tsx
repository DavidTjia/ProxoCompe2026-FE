import { primaryColor, secondaryColor } from "@/constants/theme";
import { useCreateRating } from "@/hooks/use-rating";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  reportId: string;
  onSubmitSuccess?: () => void;
};

const STAR_LABELS = ["Terrible", "Poor", "Okay", "Good", "Excellent"];

const RatingBottomSheetInner = forwardRef<BottomSheet, Props>(
  ({ reportId, onSubmitSuccess }, ref) => {
    const [selectedRating, setSelectedRating] = useState(0);
    const snapPoints = useMemo(() => ["45%"], []);
    const { mutate: createRating, isPending } = useCreateRating();

    const handleSubmit = useCallback(() => {
      if (selectedRating === 0) return;

      createRating(
        { report_id: reportId, rating_value: selectedRating },
        {
          onSuccess: () => {
            setSelectedRating(0);
            onSubmitSuccess?.();
            (ref as React.RefObject<BottomSheet>)?.current?.close();
          },
        },
      );
    }, [selectedRating, reportId, createRating, onSubmitSuccess, ref]);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Rate This Report</Text>
            <Text style={styles.subtitle}>
              How would you rate the quality of this report?
            </Text>
          </View>

          {/* Stars */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => setSelectedRating(star)}
                style={styles.starButton}
              >
                <MaterialIcons
                  name={star <= selectedRating ? "star" : "star-outline"}
                  size={44}
                  color={star <= selectedRating ? "#D4A017" : "#CACACA"}
                />
              </Pressable>
            ))}
          </View>

          {/* Label */}
          <Text style={styles.ratingLabel}>
            {selectedRating > 0
              ? STAR_LABELS[selectedRating - 1]
              : "Tap a star to rate"}
          </Text>

          {/* Submit */}
          <Pressable
            style={[
              styles.submitBtn,
              selectedRating === 0 && styles.submitBtnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isPending || selectedRating === 0}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitText}>Submit Rating</Text>
            )}
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

RatingBottomSheetInner.displayName = "RatingBottomSheet";
export const RatingBottomSheet = RatingBottomSheetInner;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  handleIndicator: {
    backgroundColor: "#D1D5DB",
    width: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: primaryColor,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  starsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: secondaryColor,
    marginBottom: 24,
    minHeight: 22,
  },
  submitBtn: {
    backgroundColor: primaryColor,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

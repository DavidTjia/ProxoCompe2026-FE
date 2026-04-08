import { primaryColor } from "@/constants/theme";
import { useCreateReportAbuse } from "@/hooks/use-report-abuse";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";

export type ReportReason =
  | "spam"
  | "misinformation"
  | "inappropriate"
  | "duplicate"
  | "other";

const REPORT_REASONS: {
  key: ReportReason;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    key: "spam",
    label: "Spam",
    description: "Irrelevant or repetitive content",
    icon: "block",
  },
  {
    key: "misinformation",
    label: "Misinformation",
    description: "False or misleading information",
    icon: "info-outline",
  },
  {
    key: "inappropriate",
    label: "Inappropriate",
    description: "Offensive or harmful content",
    icon: "warning",
  },
  {
    key: "duplicate",
    label: "Duplicate",
    description: "Already reported by someone else",
    icon: "content-copy",
  },
  {
    key: "other",
    label: "Other",
    description: "Something else entirely",
    icon: "more-horiz",
  },
];

type Props = {
  reportId: string;
};

const ReportPostBottomSheetInner = forwardRef<BottomSheet, Props>(
  ({ reportId }, ref) => {
    const [selectedReason, setSelectedReason] = useState<ReportReason | null>(
      null,
    );
    const snapPoints = useMemo(() => ["65%"], []);

    const { mutate: createAbuse, isPending } = useCreateReportAbuse();

    const handleClose = useCallback(() => {
      (ref as React.RefObject<BottomSheet>)?.current?.close();
      setSelectedReason(null);
    }, [ref]);

    const handleSubmit = useCallback(() => {
      if (!selectedReason) return;

      createAbuse(
        { report_id: reportId, reason: selectedReason },
        {
          onSuccess: () => {
            ToastAndroid.show(
              "Report submitted. Thank you!",
              ToastAndroid.SHORT,
            );
            handleClose();
          },
          onError: () => {
            ToastAndroid.show(
              "Failed to submit report. Try again.",
              ToastAndroid.SHORT,
            );
          },
        },
      );
    }, [selectedReason, reportId, createAbuse, handleClose]);

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
            <View style={styles.headerIcon}>
              <MaterialIcons name="flag" size={22} color="#E53935" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Report Post</Text>
              <Text style={styles.subtitle}>
                Why are you reporting this post?
              </Text>
            </View>
          </View>

          {/* Reason options */}
          <View style={styles.optionsList}>
            {REPORT_REASONS.map((reason) => {
              const isSelected = selectedReason === reason.key;
              return (
                <Pressable
                  key={reason.key}
                  style={[
                    styles.optionItem,
                    isSelected && styles.optionItemSelected,
                  ]}
                  onPress={() => setSelectedReason(reason.key)}
                >
                  <View
                    style={[
                      styles.optionIconContainer,
                      isSelected && styles.optionIconContainerSelected,
                    ]}
                  >
                    <MaterialIcons
                      name={reason.icon as any}
                      size={18}
                      color={isSelected ? "#fff" : "#6B7280"}
                    />
                  </View>
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.optionLabelSelected,
                      ]}
                    >
                      {reason.label}
                    </Text>
                    <Text style={styles.optionDescription}>
                      {reason.description}
                    </Text>
                  </View>
                  {isSelected && (
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color={primaryColor}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[
                styles.submitBtn,
                (!selectedReason || isPending) && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!selectedReason || isPending}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialIcons name="flag" size={16} color="#fff" />
                  <Text style={styles.submitText}>Submit Report</Text>
                </>
              )}
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

ReportPostBottomSheetInner.displayName = "ReportPostBottomSheet";
export const ReportPostBottomSheet = ReportPostBottomSheetInner;

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
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    marginBottom: 12,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFEBEE",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
  },

  // Options
  optionsList: {
    gap: 8,
    flex: 1,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
  },
  optionItemSelected: {
    borderColor: primaryColor,
    backgroundColor: "#F0F7F0",
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  optionIconContainerSelected: {
    backgroundColor: primaryColor,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 1,
  },
  optionLabelSelected: {
    color: primaryColor,
  },
  optionDescription: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  // Actions
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },
  submitBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#E53935",
  },
  submitBtnDisabled: {
    opacity: 0.45,
  },
  submitText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

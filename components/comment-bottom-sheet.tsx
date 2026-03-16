import { primaryColor } from "@/constants/theme";
import { useCommentsByReport, useCreateComment } from "@/hooks/use-comment";
import { Comment } from "@/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
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
};

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function CommentItem({ comment }: { comment: Comment }) {
  const user =
    typeof comment.user_created === "object" ? comment.user_created : null;
  const username = user?.username || "Anonymous";
  const avatarUri = user?.avatar
    ? `${process.env.EXPO_PUBLIC_BASE_API_URL}/assets/${user.avatar}`
    : null;

  return (
    <View style={styles.commentItem}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatar}
            contentFit="cover"
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <MaterialIcons name="person" size={18} color="#9CA3AF" />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUsername}>{username}</Text>
          <Text style={styles.commentTime}>
            {formatTimeAgo(comment.date_created)}
          </Text>
        </View>
        <Text style={styles.commentText}>{comment.content}</Text>
      </View>
    </View>
  );
}

const CommentBottomSheetInner = forwardRef<BottomSheet, Props>(
  ({ reportId }, ref) => {
    const [commentText, setCommentText] = useState("");
    const snapPoints = useMemo(() => ["60%", "90%"], []);

    const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
    } = useCommentsByReport(reportId);

    const { mutate: createComment, isPending: isSubmitting } =
      useCreateComment();

    const allComments = data?.pages.flatMap((page) => page.data) || [];

    const handleSubmit = useCallback(() => {
      const trimmed = commentText.trim();
      if (!trimmed) return;

      createComment(
        { report_id: reportId, content: trimmed },
        {
          onSuccess: () => {
            setCommentText("");
          },
        },
      );
    }, [commentText, reportId, createComment]);

    const renderComment = useCallback(
      ({ item }: { item: Comment }) => <CommentItem comment={item} />,
      [],
    );

    const renderEmpty = useCallback(() => {
      if (isLoading) {
        return (
          <View style={styles.emptyContainer}>
            <ActivityIndicator color={primaryColor} size="large" />
          </View>
        );
      }
      return (
        <View style={styles.emptyContainer}>
          <MaterialIcons
            name="chat-bubble-outline"
            size={48}
            color="#D1D5DB"
          />
          <Text style={styles.emptyTitle}>No comments yet</Text>
          <Text style={styles.emptySubtitle}>
            Be the first to share your thoughts!
          </Text>
        </View>
      );
    }, [isLoading]);

    const renderFooter = useCallback(() => {
      if (!isFetchingNextPage) return null;
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator color={primaryColor} size="small" />
        </View>
      );
    }, [isFetchingNextPage]);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        {/* Header */}
        <BottomSheetView style={styles.headerContainer}>
          <Text style={styles.title}>Comments</Text>
          <Text style={styles.commentCount}>
            {data?.pages[0]?.meta?.total_count || 0} comments
          </Text>
        </BottomSheetView>

        {/* Comments list */}
        <BottomSheetFlatList
          data={allComments}
          keyExtractor={(item: Comment) => item.id}
          renderItem={renderComment}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.3}
        />

        {/* Input bar */}
        <BottomSheetView style={styles.inputBar}>
          <BottomSheetTextInput
            style={styles.textInput}
            placeholder="Write a comment..."
            placeholderTextColor="#9CA3AF"
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
          <Pressable
            style={[
              styles.sendBtn,
              (!commentText.trim() || isSubmitting) && styles.sendBtnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!commentText.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <MaterialIcons name="send" size={20} color="#FFFFFF" />
            )}
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

CommentBottomSheetInner.displayName = "CommentBottomSheet";
export const CommentBottomSheet = CommentBottomSheetInner;

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

  // Header
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: primaryColor,
  },
  commentCount: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexGrow: 1,
  },

  // Comment item
  commentItem: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  avatarContainer: {
    width: 36,
    height: 36,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 3,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  commentTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },

  // Empty state
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  // Footer
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },

  // Input bar
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 10,
    backgroundColor: "#FFFFFF",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    color: "#1F2937",
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: primaryColor,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});

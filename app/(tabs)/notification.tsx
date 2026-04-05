import {
  NotificationCard,
  NotificationCardProps,
} from "@/components/notification-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useInfiniteNotification } from "@/hooks/use-notification";
import { User } from "@/types";
import { getItemAsync } from "expo-secure-store";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NotificationItem = NotificationCardProps & { id: string };

export default function NotificationScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | null>(null);

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteNotification({
    enabled: !!user?.id,
    user_created: user?.id,
  });

  const handleGetUser = async () => {
    const user = await getItemAsync("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  // Flatten all notifications from paginated data
  const allNotifications = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  // Split into recent (top 3) and earlier (remaining)
  const { recentNotifications, earlierNotifications } = useMemo(() => {
    const recent = allNotifications.slice(0, 3);
    const earlier = allNotifications.slice(3);
    return { recentNotifications: recent, earlierNotifications: earlier };
  }, [allNotifications]);

  const renderEarlierItem: ListRenderItem<NotificationItem> = useCallback(
    ({ item }) => <NotificationCard {...item} isEarlier={true} />,
    [],
  );

  const keyExtractor = useCallback((item: NotificationItem) => item.id, []);

  const renderListHeader = useCallback(() => {
    if (recentNotifications.length === 0) return null;

    return (
      <View style={{ gap: 8 }}>
        <ThemedText style={styles.sectionLabel}>RECENT</ThemedText>
        {recentNotifications.map((notification) => (
          <NotificationCard key={notification.id} {...notification} />
        ))}

        {earlierNotifications.length > 0 && (
          <ThemedText style={[styles.sectionLabel, { marginTop: 16 }]}>
            EARLIER
          </ThemedText>
        )}
      </View>
    );
  }, [recentNotifications, earlierNotifications.length]);

  const renderListFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#8B9A7E" />
      </View>
    );
  }, [isFetchingNextPage]);

  const renderEmptyComponent = useCallback(() => {
    if (isLoading || allNotifications.length > 0) return null;

    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>No notifications yet</ThemedText>
      </View>
    );
  }, [isLoading]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isRefetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isRefetching, fetchNextPage]);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading && !data) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ThemedText type="title" style={styles.header}>
          Notifications
        </ThemedText>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#8B9A7E" />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedText type="title" style={styles.header}>
        Notifications
      </ThemedText>

      <FlatList
        data={earlierNotifications}
        renderItem={renderEarlierItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={[
          styles.listContent,
          earlierNotifications.length === 0 &&
            recentNotifications.length === 0 &&
            styles.emptyContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor="#8B9A7E"
            colors={["#8B9A7E"]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8B9A7E",
    letterSpacing: 1,
    marginBottom: 8,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: "#8B9A7E",
    fontWeight: "500",
  },
});

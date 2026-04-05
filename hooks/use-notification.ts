// hooks/usePushToken.js
import notificationApi from "@/services/endpoints/notification";
import { useInfiniteQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { queryKeys } from "./keys";

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

export function usePushToken() {
  useEffect(() => {
    async function register() {
      const pushToken = await SecureStore.getItemAsync("expo_push_token");
      const user = await SecureStore.getItemAsync("user");

      if (!user) {
        await SecureStore.deleteItemAsync("expo_push_token");
        return;
      }
      if (pushToken) return;
      if (!Device.isDevice) return;

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        handleRegistrationError(
          "Permission not granted to get push token for push notification!",
        );
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId:
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId,
      });

      try {
        await notificationApi.createPushToken({
          token: token.data,
          //   platform: Platform.OS,
          //   device_name: Device.modelName || "Unknown",
        });

        await SecureStore.setItemAsync("expo_push_token", token.data);
      } catch (error) {
        console.log("Error push token :", error);
      }
    }

    register();
  }, []);
}

export const useInfiniteNotification = ({
  limit = 10,
  user_created,
  enabled = true,
}: {
  limit?: number;
  user_created?: string;
  enabled?: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.notification.all,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await notificationApi.getNotifications({
        page: pageParam,
        limit,
        meta: "*",
        sort: "-date_created",
        "filter[user_id][_eq]": user_created || undefined,
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil((lastPage.meta?.total_count || 0) / limit);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
    enabled,
  });
};

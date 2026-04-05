import { ApiResponse, PaginatedResponse, PaginationParams } from "@/types";
import apiClient from "../api-client";

const notificationApi = {
  getNotifications: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<any>>("items/notification", { params }),
  createPushToken: (data: any) =>
    apiClient.post<ApiResponse<any>>("items/push_token", data),
  deletePushToken: (id: string) =>
    apiClient.delete<ApiResponse<any>>(`items/push_token/${id}`),
};

export default notificationApi;

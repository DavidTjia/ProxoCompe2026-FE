import {
  ApiResponse,
  CreateReportForm,
  CreateUserInput,
  PaginatedResponse,
  PaginationParams,
  Report,
  ReportStatsParams,
  User,
} from "@/types";
import apiClient from "../api-client";

const reportApi = {
  getReports: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Report>>("items/reports", { params }),

  getReportDetail: (id: string, params?: PaginationParams) =>
    apiClient.get<ApiResponse<Report & { user_created: User }>>(
      `items/reports/${id}`,
      { params },
    ),

  getReportStats: (params?: ReportStatsParams) =>
    apiClient.get<
      ApiResponse<{ avg: { pollution_score: string }; count: { id: number } }[]>
    >("items/reports", { params }),

  createReports: (data: CreateReportForm) =>
    apiClient.post<ApiResponse<Report>>("items/reports", data),

  updateUser: (id: string, data: Partial<CreateUserInput>) =>
    apiClient.put<ApiResponse<User>>(`/users/${id}`, data),

  deleteUser: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/users/${id}`),

  deleteReport: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/items/reports/${id}`),
};

export default reportApi;

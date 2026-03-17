import { ApiResponse, CreateUserInput, LoginResponse, User } from "@/types";
import { getItemAsync } from "expo-secure-store";
import apiClient from "../api-client";

const userApi = {
  getUser: () => apiClient.get<ApiResponse<User>>(`users/me`),
  updateUser: (data: Partial<CreateUserInput>) =>
    apiClient.patch<ApiResponse<User>>(`users/me`, data),
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<LoginResponse>>(`auth/login`, {
      email,
      password,
    }),
  register: (data: CreateUserInput & { role: string }) =>
    apiClient.post<ApiResponse<User>>(`users`, data),
  logout: async () =>
    apiClient.post<ApiResponse<User>>(`auth/logout`, {
      refresh_token: await getItemAsync("rf_token"),
    }),
  role: () =>
    apiClient.get("roles", {
      params: {
        fields: "id",
        "filter[name][_eq]": "Mobile apps",
        limit: 1,
      },
    }),
};

export default userApi;

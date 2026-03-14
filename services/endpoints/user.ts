import { ApiResponse, CreateUserInput, User } from "@/types";
import apiClient from "../api-client";

const userApi = {
  getUser: (id: string) =>
    apiClient.get<ApiResponse<User>>(`/items/users/${id}`),

  updateUser: (id: string, data: Partial<CreateUserInput>) =>
    apiClient.patch<ApiResponse<User>>(`/items/users/${id}`, {
      data,
    }),
};

export default userApi;

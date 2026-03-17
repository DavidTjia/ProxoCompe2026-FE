import {
  ApiResponse,
  Comment,
  CreateCommentInput,
  PaginatedResponse,
  PaginationParams,
} from "@/types";
import apiClient from "../api-client";

const commentApi = {
  getComments: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Comment>>("items/comments", { params }),

  createComment: (data: CreateCommentInput) =>
    apiClient.post<ApiResponse<Comment>>("items/comments", data),
};

export default commentApi;

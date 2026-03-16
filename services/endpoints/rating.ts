import {
  ApiResponse,
  CreateRatingInput,
  PaginatedResponse,
  PaginationParams,
  Rating,
} from "@/types";
import apiClient from "../api-client";

const ratingApi = {
  getRatings: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Rating>>("items/ratings", { params }),

  createRating: (data: CreateRatingInput) =>
    apiClient.post<ApiResponse<Rating>>("items/ratings", data),
};

export default ratingApi;

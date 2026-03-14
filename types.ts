export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  search?: string;
  meta?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total_count: number;
    filter_count: number;
  };
};

export type Report = {
  id: string;
  image: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  pollution_score: number;
  rating: number;
  status: "PUBLISHED" | "DRAFT";
  created_at: string;
  ai_summary: string;
  privacy: "PUBLIC" | "ONLY_ME";
  location_name?: string;
  severity?: "CRITICAL" | "MODERATE" | "LOW";
};

export type CreateReportForm = {
  photo: string;
  description: string;
  latitude: number;
  longitude: number;
  pollution_score: number;
  ai_summary: string;
  user_id: string;
  privacy?: "PUBLIC" | "ONLY_ME";
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
};

export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  meta?: string;
  [key: string]: string | number | boolean | undefined;
};

export type ReportStatsParams = {
  [key: string]: string | number | boolean | undefined;
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
  photo: string;
  description: string;
  latitude: string;
  longitude: string;
  pollution_score: string;
  avg_rating: string;
  date_created: string;
  ai_summary: string;
  privacy: "PUBLIC" | "ONLY_ME";
  username?: string;
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

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  created_at?: string;
};

export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
};

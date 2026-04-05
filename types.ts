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
  user_id?: string;
};

export type CreateReportForm = {
  photo: string;
  description: string;
  latitude: number;
  longitude: number;
  pollution_score: number;
  ai_summary: string;
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
  date_created?: string;
};

export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
};

export type Rating = {
  id: string;
  report_id: string;
  user_created: string;
  score: number;
  date_created: string;
};

export type CreateRatingInput = {
  report_id: string;
  rating_value: number;
};

export type Comment = {
  id: string;
  report_id: string;
  user_created: string | { username: string; avatar?: string };
  content: string;
  date_created: string;
};

export type CreateCommentInput = {
  report_id: string;
  content: string;
};

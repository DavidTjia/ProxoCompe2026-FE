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

export type ReportStatus = "PUBLISHED" | "DRAFT";

export type Report = {
  id: string;
  image: string;
  description: string;
  latitude: number;
  longitude: number;
  title: string;
  pollution_score: number;
  rating: number;
  status: ReportStatus;
  created_at: string;
  ai_summary: string;
  privacy: "PUBLIC" | "ONLY_ME";
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

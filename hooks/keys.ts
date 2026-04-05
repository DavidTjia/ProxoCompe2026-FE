export const queryKeys = {
  report: {
    all: ["report"] as const,
    lists: (filters?: Record<string, unknown>) =>
      [...queryKeys.report.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.report.all, "detail", id] as const,
  },
  rating: {
    all: ["rating"] as const,
    byReport: (reportId: string) =>
      [...queryKeys.rating.all, "report", reportId] as const,
  },
  comment: {
    all: ["comment"] as const,
    byReport: (reportId: string) =>
      [...queryKeys.comment.all, "report", reportId] as const,
  },
  notification: {
    all: ["notification"] as const,
    lists: (filters?: Record<string, unknown>) =>
      [...queryKeys.notification.all, "list", filters] as const,
  },
} as const;

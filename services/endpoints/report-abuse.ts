export type CreateReportAbuseInput = {
  report_id: string;
  reason: string;
};

export type ReportAbuse = {
  id: string;
  report_id: string;
  reason: string;
  date_created: string;
};

const reportAbuseApi = {
  createReportAbuse: (data: CreateReportAbuseInput) =>
    // apiClient.post<ApiResponse<ReportAbuse>>("items/report_abuses", data),
    Promise.resolve({
      data: {
        data: {
          id: "1",
          report_id: data.report_id,
          reason: data.reason,
          date_created: new Date().toISOString(),
        },
      },
    }),
};

export default reportAbuseApi;

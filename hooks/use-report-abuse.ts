import reportAbuseApi, {
  CreateReportAbuseInput,
} from "@/services/endpoints/report-abuse";
import { useMutation } from "@tanstack/react-query";

export const useCreateReportAbuse = () => {
  return useMutation({
    mutationFn: async (data: CreateReportAbuseInput) => {
      const res = await reportAbuseApi.createReportAbuse(data);
      return res.data.data;
    },
  });
};

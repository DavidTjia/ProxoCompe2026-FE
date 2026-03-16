import ratingApi from "@/services/endpoints/rating";
import { CreateRatingInput } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";

export const useRatingsByReport = (reportId: string) => {
  return useQuery({
    queryKey: queryKeys.rating.byReport(reportId),
    queryFn: async () => {
      const res = await ratingApi.getRatings({
        "filter[report_id][_eq]": reportId,
        sort: "-date_created",
      });
      return res.data.data;
    },
    enabled: !!reportId,
  });
};

export const useCreateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRatingInput) => {
      const res = await ratingApi.createRating(data);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rating.byReport(variables.report_id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.report.all });
    },
  });
};

export const useUpdateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateRatingInput> }) => {
      const res = await ratingApi.updateRating(id, data);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      if (variables.data.report_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.rating.byReport(variables.data.report_id),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.report.all });
    },
  });
};

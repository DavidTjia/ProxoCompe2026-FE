import masterApi from "@/services/endpoints/master";
import reportApi from "@/services/endpoints/report";
import { CreateReportForm } from "@/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "./keys";

export const useReportStats = () => {
  const user_id = "e629328d-6cd0-4597-8b85-6951989caaba";
  return useQuery({
    queryKey: ["reportStats", user_id],
    queryFn: async () => {
      const res = await reportApi.getReportStats({
        "aggregate[avg]": "pollution_score",
        "filter[user_id][_eq]": user_id,
      });

      return res.data.data[0];
    },
  });
};

// Infinite scroll
export const useInfiniteReports = (limit = 10) => {
  const user_id = "e629328d-6cd0-4597-8b85-6951989caaba";

  return useInfiniteQuery({
    queryKey: queryKeys.report.lists({ infinite: true, limit, user_id: "" }),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await reportApi.getReports({
        page: pageParam,
        limit,
        meta: "*",
        sort: "-date_created",
        "filter[user_id][_eq]": user_id,
        fields: "*,user_id.username",
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil((lastPage.meta?.total_count || 0) / limit);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReportForm) => {
      const { photo, ...rest } = data;

      const imgId = await masterApi.uploadImg(photo);
      const res = await reportApi.createReports({
        ...rest,
        photo: imgId.data.data.id,
      });

      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.report.all });
    },
  });
};

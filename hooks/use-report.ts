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
  const user_created = "9c484ff4-86f3-4df5-9d77-194c18e1da58";
  return useQuery({
    queryKey: ["reportStats", user_created],
    queryFn: async () => {
      const res = await reportApi.getReportStats({
        "aggregate[avg]": "pollution_score",
        "filter[user_created][_eq]": user_created,
      });

      return res.data.data[0];
    },
  });
};

// Infinite scroll
export const useInfiniteReports = ({
  limit = 10,
  user_created,
  privacy,
}: {
  limit?: number;
  user_created?: string;
  privacy?: "PUBLIC" | "ONLY_ME";
}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.report.lists({
      infinite: true,
      limit,
      user_created,
      privacy,
    }),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await reportApi.getReports({
        page: pageParam,
        limit,
        meta: "*",
        sort: "-date_created",
        "filter[user_created][_eq]": user_created,
        "filter[privacy][_eq]": privacy,
        fields: "*,user_created.username",
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

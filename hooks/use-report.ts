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

export const useReportStats = ({
  user_created,
  enabled = true,
}: {
  user_created?: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["reportStats", user_created],
    queryFn: async () => {
      const res = await reportApi.getReportStats({
        "aggregate[avg]": "pollution_score",
        "aggregate[count]": "id",
        "filter[user_created][_eq]": user_created,
      });

      return res.data.data[0];
    },
    enabled,
  });
};

// Infinite scroll
export const useInfiniteReports = ({
  limit = 10,
  user_created,
  privacy,
  enabled = true,
}: {
  limit?: number;
  user_created?: string;
  privacy?: "PUBLIC" | "ONLY_ME";
  enabled?: boolean;
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
        "filter[user_created][_eq]": user_created || undefined,
        "filter[privacy][_eq]": privacy || undefined,
        fields: "*,user_created.username,user_created.id",
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil((lastPage.meta?.total_count || 0) / limit);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
    enabled,
  });
};

export const useReportDetail = (id: string) =>
  useQuery({
    queryKey: ["reportDetail", id],
    queryFn: async () => {
      const res = await reportApi.getReportDetail(id, {
        fields: "*,user_created.username,user_created.id",
      });
      return res.data.data;
    },
    enabled: !!id,
  });

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

// Delete a report
export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await reportApi.deleteReport(id);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.report.all });
    },
  });
};

export const useTopRegion = () =>
  useQuery({
    queryKey: ["topRegion"],
    queryFn: async () => {
      const res = await masterApi.getTopRegion();
      return res.data.data;
    },
  });

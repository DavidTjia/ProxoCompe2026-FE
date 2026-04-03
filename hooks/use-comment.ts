import commentApi from "@/services/endpoints/comment";
import { CreateCommentInput } from "@/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "./keys";

export const useCommentsByReport = (reportId: string) => {
  return useInfiniteQuery({
    queryKey: queryKeys.comment.byReport(reportId),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await commentApi.getComments({
        "filter[report_id][_eq]": reportId,
        sort: "-date_created",
        fields: "*,user_created.username,user_created.avatar",
        page: pageParam,
        limit: 20,
        meta: "*",
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil((lastPage.meta?.filter_count || 0) / 20);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
    enabled: !!reportId,
    staleTime: 0,
    refetchOnMount: "always",
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommentInput) => {
      const res = await commentApi.createComment(data);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comment.byReport(variables.report_id),
      });
    },
  });
};

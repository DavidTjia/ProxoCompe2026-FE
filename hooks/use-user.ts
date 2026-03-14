import userApi from "@/services/endpoints/user";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await userApi.getUser(id);
      return res.data.data;
    },
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        username?: string;
        email?: string;
        phone?: string;
        profile_picture?: string;
      };
    }) => {
      const res = await userApi.updateUser(id, data);
      return res.data.data;
    },
  });
};

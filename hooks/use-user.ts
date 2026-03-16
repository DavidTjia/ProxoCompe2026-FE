import masterApi from "@/services/endpoints/master";
import userApi from "@/services/endpoints/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteItemAsync, setItemAsync } from "expo-secure-store";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await userApi.getUser();
      return res.data.data;
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await userApi.login(email, password);

      await setItemAsync("token", res.data.data.access_token);
      await setItemAsync(
        "rf_token",
        JSON.stringify(res.data.data.refresh_token),
      );

      const resUser = await userApi.getUser();
      await setItemAsync("user", JSON.stringify(resUser.data.data));

      return {
        success: true,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      username,
    }: {
      email: string;
      password: string;
      username: string;
    }) => {
      const resRole = await userApi.role();

      await userApi.register({
        email,
        password,
        username,
        role: resRole.data.data[0].id,
      });

      return {
        success: true,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await userApi.logout();
      await deleteItemAsync("token");
      await deleteItemAsync("rf_token");
      await deleteItemAsync("user");

      return {
        success: true,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
    }: {
      data: {
        username?: string;
        email?: string;
        phone?: string;
        avatar?: string;
      };
    }) => {
      if (data.avatar) {
        const resUpload = await masterApi.uploadImg(data.avatar);
        data.avatar = resUpload.data.data.id;
      }

      const res = await userApi.updateUser(data);
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setItemAsync("user", JSON.stringify(data));
    },
  });
};

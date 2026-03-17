import { ApiResponse } from "@/types";
import apiClient from "../api-client";

const masterApi = {
  uploadImg: async (uri: string) => {
    const formData = new FormData();

    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: uri.split("/").pop(),
    } as any);

    return apiClient.post<ApiResponse<{ id: string }>>("files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default masterApi;

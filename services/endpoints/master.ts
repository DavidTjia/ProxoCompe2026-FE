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

  getTopRegion: async () =>
    apiClient.get<ApiResponse<any>>("items/reports", {
      params: {
        // fields: "id,province,pollution_score",
        limit: 10,
        groupBy: "province",
        sort: "-avg.pollution_score",
        "aggregate[avg]": "pollution_score",
        "filter[province][_nnull]": true,
      },
    }),
};

export default masterApi;

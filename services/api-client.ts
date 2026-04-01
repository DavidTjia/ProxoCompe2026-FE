import axios from "axios";
import { router } from "expo-router";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { ToastAndroid } from "react-native";

const apiClient = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BASE_API_URL}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value: string | PromiseLike<string>) => void;
  reject: (reason?: any) => void;
}[] = [];

// failed queue list because of expired token
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

// Request interceptor
apiClient.interceptors.request.use(async (config) => {
  if (config.url === "auth/refresh") {
    return config;
  }

  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // console.log("request :", config);

  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // console.log("response :", response);
    return response;
  },
  async (error) => {
    // Log detail error
    console.log("❌ API Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      // Data sent to server
      requestData: error.config?.data,
      // Response from server
      responseData: error.response?.data,
      // Headers response
      responseHeaders: error.response?.headers,
    });

    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest) {
      if (originalRequest?.url?.startsWith("auth/")) {
        return Promise.reject({
          ...error,
          message: error.response?.data?.errors?.[0]?.message || error.message,
        });
      }

      if (originalRequest._retry) {
        //prevent infinite loop
        await deleteItemAsync("token");
        await deleteItemAsync("rf_token");
        await deleteItemAsync("user");

        ToastAndroid.show("Session expired", ToastAndroid.SHORT);
        router.replace("/(auth)/signin");

        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      // Mulai proses refresh token
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("refresh token");
        const refreshToken = await getItemAsync("rf_token");

        if (!refreshToken) {
          return Promise.reject({
            ...error,
            message: "Refresh token not found",
          });
        }

        // Hit endpoint refresh token
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_BASE_API_URL}/auth/refresh`,
          { refresh_token: refreshToken },
        );

        const { access_token, refresh_token } = response.data.data;

        // save token
        await setItemAsync("token", access_token);
        await setItemAsync("rf_token", refresh_token);

        // update default header
        apiClient.defaults.headers.common.Authorization = `Bearer ${access_token}`;

        // process pending queue request
        processQueue(null, access_token);

        // retry request original with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        // refresh token expired/invalid
        processQueue(refreshError, null);

        await deleteItemAsync("token");
        await deleteItemAsync("rf_token");
        await deleteItemAsync("user");

        ToastAndroid.show("Session expired", ToastAndroid.SHORT);
        router.replace("/(auth)/signin");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else if (error.response?.status === 403) {
      await deleteItemAsync("token");
      await deleteItemAsync("rf_token");
      await deleteItemAsync("user");
      ToastAndroid.show("Unauthorized", ToastAndroid.SHORT);
      router.replace("/(auth)/signin");
    }

    return Promise.reject({
      ...error,
      message: error.response?.data?.errors?.[0]?.message || error.message,
    });
  },
);

async function getToken(): Promise<string | null> {
  const token = await getItemAsync("token");
  return token;
}

export default apiClient;

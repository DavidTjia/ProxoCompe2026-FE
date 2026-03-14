import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BASE_API_URL}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // console.log("request :", config);

  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("error", error);
    if (error.response?.status === 401) {
      //TODO: Handle unauthorized
    }

    return Promise.reject(error);
  },
);

async function getToken(): Promise<string | null> {
  //TODO: Get accessToken
  return process.env.EXPO_PUBLIC_BASE_API_KEY || null;
}

export default apiClient;

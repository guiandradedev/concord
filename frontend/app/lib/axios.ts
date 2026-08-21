import axios from "axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "./auth-token";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? "";

    const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/refresh");

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post("/auth/refresh");
        const nextAccessToken = refreshResponse.data?.accessToken as string | undefined;

        if (nextAccessToken) {
          setAccessToken(nextAccessToken);
          originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
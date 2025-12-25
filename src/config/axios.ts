import axios from "axios";
import { API_URL } from "@/constants";

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-redirect on 401 for /auth/me endpoint (handled by auth store)
    const isAuthMeRequest = error.config?.url?.includes("/auth/me");

    if (error.response?.status === 401 && !isAuthMeRequest) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/auth/signin";
    }
    return Promise.reject(error);
  }
);

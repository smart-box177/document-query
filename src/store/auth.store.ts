import { create } from "zustand";
import { api } from "@/config/axios";
import { type IAuthUser } from "@/interface/user";
import { API_URL } from "@/constants";

interface AuthState {
  user: IAuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  signin: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  googleSignin: (code: string) => Promise<boolean>;
  verifyAccount: (userId: string) => Promise<void>;
  fetchMe: () => Promise<boolean>;
  logout: () => void;
  setAuth: (user: IAuthUser, accessToken: string, refreshToken: string) => void;
  clearError: () => void;
  initializeFromStorage: () => Promise<void>;
}

interface SignupData {
  email: string;
  username: string;
  password: string;
  firstname?: string;
  lastname?: string;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,

  signin: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/signin", { email, password });
      if (data.success) {
        set({
          user: data.data.user,
          accessToken: data.data.accessToken,
          refreshToken: data.data?.refreshToken,
          isLoading: false,
        });
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        return true;
      } else {
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Sign in failed",
        isLoading: false,
      });
      return false;
    }
  },

  signup: async (signupData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/signup", signupData);
      if (data.success) {
        set({ isLoading: false });
        return true;
      } else {
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Sign up failed",
        isLoading: false,
      });
      return false;
    }
  },

  googleSignin: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `${API_URL}/api/v1/auth/google-signin/callback?code=${code}`
      );
      const data = await response.json();

      if (data.success) {
        set({
          user: data.data.user,
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          isLoading: false,
        });
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        return true;
      } else {
        set({
          error: data.message || "Authentication failed",
          isLoading: false,
        });
        return false;
      }
    } catch (err: unknown) {
      console.error(err);
      set({
        error: "Failed to complete authentication",
        isLoading: false,
      });
      return false;
    }
  },

  verifyAccount: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/verify", { userId });
      if (data.success) {
        set({ isLoading: false });
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Verification failed",
        isLoading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    set({ user: null, accessToken: null, refreshToken: null });
  },

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, accessToken, refreshToken });
  },

  fetchMe: async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.log("no access token");
      return false;
    }
    
    set({ isLoading: true });
    try {
      const { data } = await api.get("/auth/me");
      if (data.success) {
        const user = data.data.user;
        console.log("request sent");
        localStorage.setItem("user", JSON.stringify(user));
        set({
          user,
          accessToken,
          refreshToken: localStorage.getItem("refreshToken"),
          isLoading: false,
        });
        return true;
      } else {
        // Token invalid, clear storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
        });
        return false;
      }
    } catch {
      // Token invalid or expired, clear storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
      });
      return false;
    }
  },

  initializeFromStorage: async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userStr = localStorage.getItem("user");

    if (accessToken && userStr) {
      try {
        const user = JSON.parse(userStr) as IAuthUser;
        set({ user, accessToken, refreshToken });

        // Optionally fetch fresh user data in background (don't block)
        useAuthStore
          .getState()
          .fetchMe()
          .catch(() => {
            // Silent fail - user data from storage is still valid
          });
      } catch {
        // Invalid stored data, clear everything
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }
  },

  clearError: () => set({ error: null }),
}));

import { create } from "zustand";
import { api } from "@/config/axios";
import type { IApplication } from "@/interface/application";

interface ApplicationState {
  applications: IApplication[];
  currentApplication: IApplication | null;
  isLoading: boolean;
  error: string | null;

  createApplication: (data: Partial<IApplication>) => Promise<boolean>;
  updateApplication: (id: string, data: Partial<IApplication>) => Promise<boolean>;
  reviewApplication: (id: string, status: "APPROVED" | "REJECTED" | "REVISION_REQUESTED", adminComments?: string) => Promise<boolean>;
  saveAsDraft: (data: Partial<IApplication>, id?: string) => Promise<boolean>;
  saveAndSubmit: (data: Partial<IApplication>, id?: string) => Promise<boolean>;
  fetchApplications: () => Promise<void>;
  fetchApplicationById: (id: string) => Promise<void>;
  deleteApplication: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentApplication: () => void;
}

export const useApplicationStore = create<ApplicationState>()((set) => ({
  applications: [],
  currentApplication: null,
  isLoading: false,
  error: null,

  createApplication: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/applications", data);
      if (response.data.success) {
        set((state) => ({
          applications: [response.data.data, ...state.applications],
          currentApplication: response.data.data,
          isLoading: false,
        }));
        return true;
      } else {
        set({ error: response.data.message, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to create application",
        isLoading: false,
      });
      return false;
    }
  },

  updateApplication: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/applications/${id}`, data);
      if (response.data.success) {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? response.data.data : app
          ),
          currentApplication:
            state.currentApplication?.id === id ? response.data.data : state.currentApplication,
          isLoading: false,
        }));
        return true;
      } else {
        set({ error: response.data.message, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to update application",
        isLoading: false,
      });
      return false;
    }
  },

  reviewApplication: async (id, status, adminComments) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/applications/${id}/review`, { status, adminComments });
      if (response.data.success) {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? response.data.data : app
          ),
          currentApplication:
            state.currentApplication?.id === id ? response.data.data : state.currentApplication,
          isLoading: false,
        }));
        return true;
      } else {
        set({ error: response.data.message, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to review application",
        isLoading: false,
      });
      return false;
    }
  },

  fetchApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/admin/applications");
      if (response.data.success) {
        set({ applications: response.data.data, isLoading: false });
      } else {
        set({ error: response.data.message, isLoading: false });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to fetch applications",
        isLoading: false,
      });
    }
  },

  fetchApplicationById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/applications/${id}`);
      if (response.data.success) {
        set({ currentApplication: response.data.data, isLoading: false });
      } else {
        set({ error: response.data.message, isLoading: false });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to fetch application",
        isLoading: false,
      });
    }
  },

  deleteApplication: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.delete(`/applications/${id}`);
      if (response.data.success) {
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
          currentApplication:
            state.currentApplication?.id === id ? null : state.currentApplication,
          isLoading: false,
        }));
        return true;
      } else {
        set({ error: response.data.message, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to delete application",
        isLoading: false,
      });
      return false;
    }
  },

  saveAsDraft: async (data, id) => {
    set({ isLoading: true, error: null });
    try {
      const response = id 
        ? await api.put(`/applications/${id}/draft`, data)
        : await api.post("/applications/draft", data);
      
      if (response.data.success) {
        set((state) => ({
          applications: id 
            ? state.applications.map((app) => app.id === id ? response.data.data : app)
            : [response.data.data, ...state.applications],
          currentApplication: response.data.data,
          isLoading: false,
        }));
        return true;
      } else {
        set({ error: response.data.message, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to save as draft",
        isLoading: false,
      });
      return false;
    }
  },

  saveAndSubmit: async (data, id) => {
    set({ isLoading: true, error: null });
    try {
      const response = id 
        ? await api.put(`/applications/${id}/submit`, data)
        : await api.post("/applications/submit", data);
      
      if (response.data.success) {
        set((state) => ({
          applications: id 
            ? state.applications.map((app) => app.id === id ? response.data.data : app)
            : [response.data.data, ...state.applications],
          currentApplication: response.data.data,
          isLoading: false,
        }));
        return true;
      } else {
        set({ error: response.data.message, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to submit application",
        isLoading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentApplication: () => set({ currentApplication: null }),
}));

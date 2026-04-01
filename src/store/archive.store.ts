import { create } from "zustand";
import { api } from "@/config/axios";

export interface ArchivedApplication {
  id: string;
  contractTitle?: string;
  operator?: string;
  contractorName?: string;
  contractNumber?: string;
  year?: string;
  contractValue?: number;
  archivedAt: string;
  archivedBy?: {
    _id: string;
    username: string;
    firstname?: string;
    lastname?: string;
  };
  sectionA?: {
    contractProjectTitle?: string;
    operatorOrProjectPromoter?: string;
    mainContractor?: string;
    contractProjectNumber?: string;
  };
}

interface ArchiveState {
  // User archive
  userArchive: ArchivedApplication[];
  userTotal: number;
  // Global archive (admin)
  globalArchive: ArchivedApplication[];
  globalTotal: number;
  
  isLoading: boolean;
  error: string | null;

  // User archive actions
  fetchUserArchive: () => Promise<void>;
  archiveForUser: (applicationId: string) => Promise<boolean>;
  restoreForUser: (applicationId: string) => Promise<boolean>;
  clearUserArchive: () => Promise<boolean>;
  isArchivedByUser: (applicationId: string) => boolean;

  // Global archive actions (admin)
  fetchGlobalArchive: () => Promise<void>;
  archiveGlobally: (applicationId: string) => Promise<boolean>;
  restoreGlobally: (applicationId: string) => Promise<boolean>;
  permanentlyDelete: (applicationId: string) => Promise<boolean>;
  emptyGlobalArchive: () => Promise<boolean>;

  clearError: () => void;
}

export const useArchiveStore = create<ArchiveState>()((set, get) => ({
  userArchive: [],
  userTotal: 0,
  globalArchive: [],
  globalTotal: 0,
  isLoading: false,
  error: null,

  // User archive actions
  fetchUserArchive: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/applications/archive/user");
      if (data.success) {
        set({
          userArchive: data.data.archived,
          userTotal: data.data.total,
          isLoading: false,
        });
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to fetch archive",
        isLoading: false,
      });
    }
  },

  archiveForUser: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`/applications/archive/user/${applicationId}`);
      if (data.success) {
        await get().fetchUserArchive();
        return true;
      } else {
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to archive application",
        isLoading: false,
      });
      return false;
    }
  },

  restoreForUser: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.delete(`/applications/archive/user/${applicationId}`);
      if (data.success) {
        set((state) => ({
          userArchive: state.userArchive.filter((a) => a.id !== applicationId),
          userTotal: state.userTotal - 1,
          isLoading: false,
        }));
        return true;
      } else {
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to restore application",
        isLoading: false,
      });
      return false;
    }
  },

  clearUserArchive: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.delete("/applications/archive/user");
      if (data.success) {
        set({ userArchive: [], userTotal: 0, isLoading: false });
        return true;
      } else {
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to clear archive",
        isLoading: false,
      });
      return false;
    }
  },

  isArchivedByUser: (applicationId: string) => {
    return get().userArchive.some((a) => a.id === applicationId);
  },

  // Global archive actions (admin)
  fetchGlobalArchive: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/applications/archive/global");
      if (data.success) {
        set({
          globalArchive: data.data.archived,
          globalTotal: data.data.total,
          isLoading: false,
        });
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to fetch global archive",
        isLoading: false,
      });
    }
  },

  archiveGlobally: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`/applications/archive/global/${applicationId}`);
      if (data.success) {
        await get().fetchGlobalArchive();
        return true;
      } else {
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to archive application globally",
        isLoading: false,
      });
      return false;
    }
  },

  restoreGlobally: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.delete(`/applications/archive/global/${applicationId}`);
      if (data.success) {
        set((state) => ({
          globalArchive: state.globalArchive.filter((a) => a.id !== applicationId),
          globalTotal: state.globalTotal - 1,
          isLoading: false,
        }));
        return true;
      } else {
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to restore application",
        isLoading: false,
      });
      return false;
    }
  },

  permanentlyDelete: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.delete(`/applications/archive/global/${applicationId}/permanent`);
      if (data.success) {
        set((state) => ({
          globalArchive: state.globalArchive.filter((a) => a.id !== applicationId),
          globalTotal: state.globalTotal - 1,
          isLoading: false,
        }));
        return true;
      } else {
        set({ error: data.message, isLoading: false });
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

  emptyGlobalArchive: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.delete("/applications/archive/global");
      if (data.success) {
        set({ globalArchive: [], globalTotal: 0, isLoading: false });
        return true;
      } else {
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to empty archive",
        isLoading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

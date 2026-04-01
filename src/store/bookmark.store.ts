import { create } from "zustand";
import { api } from "@/config/axios";

export interface BookmarkedApplication {
  id: string;
  contractTitle?: string;
  operator?: string;
  contractorName?: string;
  contractNumber?: string;
  year?: string;
  contractValue?: number;
  bookmarkedAt: string;
  sectionA?: {
    contractProjectTitle?: string;
    operatorOrProjectPromoter?: string;
    mainContractor?: string;
    contractProjectNumber?: string;
  };
}

interface BookmarkState {
  bookmarks: BookmarkedApplication[];
  total: number;
  isLoading: boolean;
  error: string | null;

  fetchBookmarks: () => Promise<void>;
  addBookmark: (applicationId: string) => Promise<boolean>;
  removeBookmark: (applicationId: string) => Promise<boolean>;
  clearAllBookmarks: () => Promise<boolean>;
  isBookmarked: (applicationId: string) => boolean;
  clearError: () => void;
}

export const useBookmarkStore = create<BookmarkState>()((set, get) => ({
  bookmarks: [],
  total: 0,
  isLoading: false,
  error: null,

  fetchBookmarks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/applications/bookmarks");
      if (data.success) {
        set({
          bookmarks: data.data.bookmarks,
          total: data.data.total,
          isLoading: false,
        });
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to fetch bookmarks",
        isLoading: false,
      });
    }
  },

  addBookmark: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`/applications/bookmarks/${applicationId}`);
      if (data.success) {
        await get().fetchBookmarks();
        return true;
      } else {
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to add bookmark",
        isLoading: false,
      });
      return false;
    }
  },

  removeBookmark: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.delete(`/applications/bookmarks/${applicationId}`);
      if (data.success) {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== applicationId),
          total: state.total - 1,
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
        error: error.response?.data?.message || "Failed to remove bookmark",
        isLoading: false,
      });
      return false;
    }
  },

  clearAllBookmarks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.delete("/applications/bookmarks");
      if (data.success) {
        set({ bookmarks: [], total: 0, isLoading: false });
        return true;
      } else {
        set({ error: data.message, isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      set({
        error: error.response?.data?.message || "Failed to clear bookmarks",
        isLoading: false,
      });
      return false;
    }
  },

  isBookmarked: (applicationId: string) => {
    return get().bookmarks.some((b) => b.id === applicationId);
  },

  clearError: () => set({ error: null }),
}));

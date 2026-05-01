import { create } from "zustand";
import api from "@/lib/api";

const useAnnouncementStore = create((set) => ({
  announcements: [],
  isLoading: false,

  fetchAnnouncements: async (workspaceId) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/workspaces/${workspaceId}/announcements`);
      set({ announcements: data, isLoading: false });
    } catch (_) {
      set({ isLoading: false });
    }
  },

  // Called from socket event: prepend new announcement to top
  addLiveAnnouncement: (announcement) => {
    set((state) => {
      const isPinned = announcement.isPinned;
      // Pinned go to top, others after pinned ones
      const pinned = state.announcements.filter((a) => a.isPinned);
      const unpinned = state.announcements.filter((a) => !a.isPinned);
      return {
        announcements: isPinned
          ? [announcement, ...pinned, ...unpinned]
          : [...pinned, announcement, ...unpinned],
      };
    });
  },

  // Called from socket: update reaction summary on an announcement
  liveUpdateReaction: ({ announcementId, action, emoji, userId }) => {
    set((state) => ({
      announcements: state.announcements.map((ann) => {
        if (ann.id !== announcementId) return ann;
        const reactions = { ...ann.reactions };
        if (action === "add") {
          if (!reactions[emoji]) reactions[emoji] = { count: 0, userReacted: false };
          reactions[emoji].count += 1;
        } else if (action === "remove") {
          if (reactions[emoji]) {
            reactions[emoji].count = Math.max(0, reactions[emoji].count - 1);
          }
        }
        return { ...ann, reactions };
      }),
    }));
  },

  createAnnouncement: async (workspaceId, payload) => {
    try {
      const { data } = await api.post(`/workspaces/${workspaceId}/announcements`, payload);
      return { success: true, announcement: data.announcement };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  addReaction: async (announcementId, emoji) => {
    // Optimistic update handled by socket event from server
    try {
      await api.post(`/announcements/${announcementId}/reactions`, { emoji });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  removeReaction: async (announcementId, emoji) => {
    try {
      await api.delete(`/announcements/${announcementId}/reactions`, { data: { emoji } });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },
}));

export default useAnnouncementStore;

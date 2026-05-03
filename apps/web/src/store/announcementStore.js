import { create } from "zustand";
import api from "@/lib/api";
import { toast } from "./toastStore";

const useAnnouncementStore = create((set, get) => ({
  announcements: [],
  isLoading: false,
  pendingIds: new Set(),

  fetchAnnouncements: async (workspaceId) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/workspaces/${workspaceId}/announcements`);
      set({ announcements: data, isLoading: false });
    } catch (_) {
      set({ isLoading: false });
    }
  },

  addLiveAnnouncement: (announcement) => {
    set((state) => {
      if (state.announcements.some((a) => a.id === announcement.id)) return state;
      const isPinned = announcement.isPinned;
      const pinned = state.announcements.filter((a) => a.isPinned);
      const unpinned = state.announcements.filter((a) => !a.isPinned);
      return {
        announcements: isPinned
          ? [announcement, ...pinned, ...unpinned]
          : [...pinned, announcement, ...unpinned],
      };
    });
  },

  liveUpdateComment: (announcementId, comment) => {
    set((state) => ({
      announcements: state.announcements.map((ann) => {
        if (ann.id !== announcementId) return ann;
        const comments = ann.comments ? [...ann.comments, comment] : [comment];
        // Prevent double counting if it's already there (e.g. from optimistic update)
        const isDuplicate = ann.comments?.some(c => c.id === comment.id);
        if (isDuplicate) return ann;
        
        return {
          ...ann,
          comments,
          _count: { ...ann._count, comments: (ann._count?.comments || 0) + 1 },
        };
      }),
    }));
  },

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
    const tempId = `temp_${Date.now()}`;
    const optimisticAnn = {
      id: tempId,
      ...payload,
      reactions: {},
      _count: { comments: 0 },
      createdAt: new Date().toISOString(),
      _optimistic: true,
    };

    set((state) => {
      const pinned = state.announcements.filter((a) => a.isPinned);
      const unpinned = state.announcements.filter((a) => !a.isPinned);
      return {
        announcements: optimisticAnn.isPinned
          ? [optimisticAnn, ...pinned, ...unpinned]
          : [...pinned, optimisticAnn, ...unpinned],
      };
    });

    try {
      const { data } = await api.post(`/workspaces/${workspaceId}/announcements`, payload);
      set((state) => ({
        announcements: state.announcements.map((a) => (a.id === tempId ? { ...data.announcement, _optimistic: false } : a)),
      }));
      toast.success("Announcement posted!");
      return { success: true, announcement: data.announcement };
    } catch (error) {
      set((state) => ({
        announcements: state.announcements.filter((a) => a.id !== tempId),
      }));
      toast.error(error.response?.data?.error || "Failed to post announcement.");
      return { success: false, error: error.response?.data?.error };
    }
  },

  addReaction: async (announcementId, emoji) => {
    const previousAnnouncements = [...get().announcements];
    
    set((state) => ({
      announcements: state.announcements.map((ann) => {
        if (ann.id !== announcementId) return ann;
        const reactions = { ...ann.reactions };
        if (!reactions[emoji]) reactions[emoji] = { count: 0, userReacted: false };
        if (reactions[emoji].userReacted) return ann;
        reactions[emoji] = { count: reactions[emoji].count + 1, userReacted: true };
        return { ...ann, reactions };
      }),
    }));

    try {
      await api.post(`/announcements/${announcementId}/reactions`, { emoji });
      return { success: true };
    } catch (error) {
      set({ announcements: previousAnnouncements });
      toast.error("Failed to add reaction.");
      return { success: false, error: error.response?.data?.error };
    }
  },

  removeReaction: async (announcementId, emoji) => {
    const previousAnnouncements = [...get().announcements];

    set((state) => ({
      announcements: state.announcements.map((ann) => {
        if (ann.id !== announcementId) return ann;
        const reactions = { ...ann.reactions };
        if (!reactions[emoji] || !reactions[emoji].userReacted) return ann;
        reactions[emoji] = { count: Math.max(0, reactions[emoji].count - 1), userReacted: false };
        return { ...ann, reactions };
      }),
    }));

    try {
      await api.delete(`/announcements/${announcementId}/reactions`, { data: { emoji } });
      return { success: true };
    } catch (error) {
      set({ announcements: previousAnnouncements });
      toast.error("Failed to remove reaction.");
      return { success: false, error: error.response?.data?.error };
    }
  },

  fetchComments: async (announcementId) => {
    try {
      const { data } = await api.get(`/announcements/${announcementId}`);
      set((state) => ({
        announcements: state.announcements.map((ann) =>
          ann.id === announcementId ? { ...ann, comments: data.comments || [] } : ann
        ),
      }));
      return data.comments || [];
    } catch (error) {
      console.error("fetchComments error:", error);
      return [];
    }
  },

  addComment: async (announcementId, content, parentId = null) => {
    const tempId = `temp_${Date.now()}`;
    const optimisticComment = {
      id: tempId,
      content,
      parentId,
      createdAt: new Date().toISOString(),
      _optimistic: true,
    };
    const previousAnnouncements = [...get().announcements];

    set((state) => ({
      announcements: state.announcements.map((ann) => {
        if (ann.id !== announcementId) return ann;
        const comments = ann.comments ? [...ann.comments, optimisticComment] : [optimisticComment];
        return {
          ...ann,
          comments,
          _count: { ...ann._count, comments: (ann._count?.comments || 0) + 1 },
        };
      }),
    }));

    try {
      const { data } = await api.post(`/announcements/${announcementId}/comments`, { content, parentId });
      set((state) => ({
        announcements: state.announcements.map((ann) => {
          if (ann.id !== announcementId) return ann;
          return {
            ...ann,
            comments: ann.comments?.map((c) => (c.id === tempId ? { ...data.comment, _optimistic: false } : c)),
          };
        }),
      }));
      return { success: true, comment: data.comment };
    } catch (error) {
      set({ announcements: previousAnnouncements });
      toast.error("Failed to add comment.");
      return { success: false, error: error.response?.data?.error };
    }
  },

  updateComment: async (announcementId, commentId, content) => {
    const previousAnnouncements = [...get().announcements];

    set((state) => ({
      announcements: state.announcements.map((ann) => {
        if (ann.id !== announcementId) return ann;
        return {
          ...ann,
          comments: ann.comments?.map((c) => (c.id === commentId ? { ...c, content } : c)),
        };
      }),
    }));

    try {
      const { data } = await api.put(`/announcements/${announcementId}/comments/${commentId}`, { content });
      set((state) => ({
        announcements: state.announcements.map((ann) => {
          if (ann.id !== announcementId) return ann;
          return {
            ...ann,
            comments: ann.comments?.map((c) => (c.id === commentId ? { ...c, content: data.comment.content } : c)),
          };
        }),
      }));
      return { success: true };
    } catch (error) {
      set({ announcements: previousAnnouncements });
      toast.error("Failed to update comment.");
      return { success: false, error: error.response?.data?.error };
    }
  },

  deleteComment: async (announcementId, commentId) => {
    const previousAnnouncements = [...get().announcements];

    set((state) => ({
      announcements: state.announcements.map((ann) => {
        if (ann.id !== announcementId) return ann;
        return {
          ...ann,
          comments: ann.comments?.filter((c) => c.id !== commentId),
          _count: { ...ann._count, comments: Math.max(0, (ann._count?.comments || 1) - 1) },
        };
      }),
    }));

    try {
      await api.delete(`/announcements/${announcementId}/comments/${commentId}`);
      toast.info("Comment deleted.");
      return { success: true };
    } catch (error) {
      set({ announcements: previousAnnouncements });
      toast.error("Failed to delete comment.");
      return { success: false, error: error.response?.data?.error };
    }
  },

  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/users/upload-attachment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Upload failed" };
    }
  },
}));

export default useAnnouncementStore;

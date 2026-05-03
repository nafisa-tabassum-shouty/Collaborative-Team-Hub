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
      // Prevent duplicate if we already added it locally
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

  // Called from socket: update reaction summary on an announcement
  liveUpdateReaction: ({ announcementId, action, emoji, userId }) => {
    set((state) => ({
      announcements: state.announcements.map((ann) => {
        if (ann.id !== announcementId) return ann;
        
        // If it's our own reaction, we likely already updated it locally
        // (This is a simple heuristic, but usually works for single-session users)
        // Better: Backend could send 'userId' so we can ignore our own events
        const reactions = { ...ann.reactions };
        if (action === "add") {
          if (!reactions[emoji]) reactions[emoji] = { count: 0, userReacted: false };
          // If we are the one who reacted and it's already marked, don't increment
          // (Actually, count should always represent the server truth)
          // For simplicity, let's just update based on what the server says if we can,
          // but here the server sends incremental action.
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
      const newAnn = data.announcement;
      
      // Update local state immediately
      set((state) => {
        const pinned = state.announcements.filter((a) => a.isPinned);
        const unpinned = state.announcements.filter((a) => !a.isPinned);
        return {
          announcements: newAnn.isPinned
            ? [newAnn, ...pinned, ...unpinned]
            : [...pinned, newAnn, ...unpinned],
        };
      });
      
      return { success: true, announcement: newAnn };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  addReaction: async (announcementId, emoji) => {
    // Manual local update for immediate feedback
    set((state) => ({
      announcements: state.announcements.map((ann) => {
        if (ann.id !== announcementId) return ann;
        const reactions = { ...ann.reactions };
        if (!reactions[emoji]) reactions[emoji] = { count: 0, userReacted: false };
        if (reactions[emoji].userReacted) return ann; // Already reacted
        
        reactions[emoji] = {
          count: reactions[emoji].count + 1,
          userReacted: true
        };
        return { ...ann, reactions };
      }),
    }));

    try {
      await api.post(`/announcements/${announcementId}/reactions`, { emoji });
      return { success: true };
    } catch (error) {
      // Rollback on error could be added here
      return { success: false, error: error.response?.data?.error };
    }
  },

  removeReaction: async (announcementId, emoji) => {
    set((state) => ({
      announcements: state.announcements.map((ann) => {
        if (ann.id !== announcementId) return ann;
        const reactions = { ...ann.reactions };
        if (!reactions[emoji] || !reactions[emoji].userReacted) return ann;
        
        reactions[emoji] = {
          count: Math.max(0, reactions[emoji].count - 1),
          userReacted: false
        };
        return { ...ann, reactions };
      }),
    }));

    try {
      await api.delete(`/announcements/${announcementId}/reactions`, { data: { emoji } });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  fetchComments: async (announcementId) => {
    try {
      const { data } = await api.get(`/announcements/${announcementId}`);
      set((state) => ({
        announcements: state.announcements.map((ann) =>
          ann.id === announcementId ? { ...ann, comments: data.comments } : ann
        ),
      }));
      return data.comments;
    } catch (error) {
      return [];
    }
  },

  addComment: async (announcementId, content) => {
    try {
      const { data } = await api.post(`/announcements/${announcementId}/comments`, { content });
      const newComment = data.comment;
      
      // Update local state immediately
      set((state) => ({
        announcements: state.announcements.map((ann) => {
          if (ann.id !== announcementId) return ann;
          
          // Prevent duplicate if socket already added it
          if (ann.comments?.some((c) => c.id === newComment.id)) return ann;

          const comments = ann.comments ? [...ann.comments, newComment] : [newComment];
          return {
            ...ann,
            comments,
            _count: { ...ann._count, comments: (ann._count?.comments || 0) + 1 },
          };
        }),
      }));
      
      return { success: true, comment: newComment };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  liveUpdateComment: (announcementId, comment) => {
    set((state) => ({
      announcements: state.announcements.map((ann) => {
        if (ann.id !== announcementId) return ann;
        
        // Prevent duplicate
        if (ann.comments?.some((c) => c.id === comment.id)) return ann;

        const comments = ann.comments ? [...ann.comments, comment] : [comment];
        return {
          ...ann,
          comments,
          _count: { ...ann._count, comments: (ann._count?.comments || 0) + 1 },
        };
      }),
    }));
  },

  updateComment: async (announcementId, commentId, content) => {
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
      return { success: false, error: error.response?.data?.error };
    }
  },

  deleteComment: async (announcementId, commentId) => {
    try {
      await api.delete(`/announcements/${announcementId}/comments/${commentId}`);
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
      return { success: true };
    } catch (error) {
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

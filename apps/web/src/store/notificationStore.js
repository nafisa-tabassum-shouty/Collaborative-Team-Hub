import { create } from "zustand";
import api from "@/lib/api";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  toasts: [],
  unreadCount: 0,
  total: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  
  fetchNotifications: async (page = 1, limit = 20, append = false) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/notifications?page=${page}&limit=${limit}`);
      
      set((state) => ({ 
        notifications: append ? [...state.notifications, ...data.notifications] : data.notifications, 
        unreadCount: data.unreadCount,
        total: data.total,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        isLoading: false
      }));
    } catch (err) {
      console.error("Fetch notifications error:", err);
      set({ isLoading: false });
    }
  },

  addLiveNotification: (notification) => {
    set((state) => {
      // Avoid duplicate in history
      if (state.notifications.some(n => n.id === notification.id)) return state;
      
      // Auto-remove toast after 5 seconds
      setTimeout(() => {
        get().removeToast(notification.id);
      }, 5000);

      return {
        notifications: [notification, ...state.notifications],
        toasts: [notification, ...state.toasts],
        unreadCount: state.unreadCount + 1,
        total: state.total + 1
      };
    });
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }));
  },

  markAsRead: async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (err) {
      console.error("Mark read error:", err);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.patch("/notifications/mark-all-read");
      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0
      }));
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  }
}));

export default useNotificationStore;

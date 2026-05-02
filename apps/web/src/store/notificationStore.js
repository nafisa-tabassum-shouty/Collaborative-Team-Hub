import { create } from "zustand";
import api from "@/lib/api";

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  
  fetchNotifications: async () => {
    try {
      const { data } = await api.get("/notifications");
      set({ 
        notifications: data, 
        unreadCount: data.filter(n => !n.isRead).length 
      });
    } catch (err) {
      console.error(err);
    }
  },

  addLiveNotification: (notification) => {
    set((state) => {
      // Avoid duplicate
      if (state.notifications.some(n => n.id === notification.id)) return state;
      return {
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    });
  },

  markAsRead: async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (err) {
      console.error(err);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  }
}));

export default useNotificationStore;

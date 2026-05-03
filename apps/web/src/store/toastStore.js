import { create } from "zustand";

const useToastStore = create((set) => ({
  toasts: [],

  addToast: ({ type = "info", title = "", message, duration = 4000 }) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, type, title, message, duration }],
    }));
    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

// Helper functions for easy usage
export const toast = {
  success: (message, title) => useToastStore.getState().addToast({ type: "success", message, title }),
  error:   (message, title = "Action Failed") => useToastStore.getState().addToast({ type: "error", message, title }),
  info:    (message, title) => useToastStore.getState().addToast({ type: "info", message, title }),
  warning: (message, title) => useToastStore.getState().addToast({ type: "warning", message, title }),
};

export default useToastStore;

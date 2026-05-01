import { create } from "zustand";
import api from "@/lib/api";

const useActionItemStore = create((set) => ({
  actionItems: [],
  isLoading: false,

  fetchActionItems: async (workspaceId) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/workspaces/${workspaceId}/action-items`);
      set({ actionItems: data, isLoading: false });
    } catch (_) {
      set({ isLoading: false });
    }
  },

  createActionItem: async (goalId, payload) => {
    try {
      const { data } = await api.post(`/goals/${goalId}/action-items`, payload);
      set((state) => ({ actionItems: [...state.actionItems, data.actionItem] }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  // Optimistic update: update local state first, then sync with server
  updateActionItem: async (id, payload) => {
    // Optimistically update
    set((state) => ({
      actionItems: state.actionItems.map((item) =>
        item.id === id ? { ...item, ...payload } : item
      ),
    }));
    try {
      const { data } = await api.put(`/action-items/${id}`, payload);
      set((state) => ({
        actionItems: state.actionItems.map((item) =>
          item.id === id ? { ...item, ...data.actionItem } : item
        ),
      }));
      return { success: true };
    } catch (error) {
      // Rollback not implemented for brevity; you can refetch on error
      return { success: false, error: error.response?.data?.error };
    }
  },

  // Called from socket events to live-update kanban board
  liveUpdateActionItem: (updatedItem) => {
    set((state) => ({
      actionItems: state.actionItems.map((item) =>
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      ),
    }));
  },

  deleteActionItem: async (id) => {
    try {
      await api.delete(`/action-items/${id}`);
      set((state) => ({ actionItems: state.actionItems.filter((item) => item.id !== id) }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  // Group by status for Kanban view
  getKanbanGroups: (state) => ({
    TODO: state.actionItems.filter((i) => i.status === "TODO"),
    IN_PROGRESS: state.actionItems.filter((i) => i.status === "IN_PROGRESS"),
    DONE: state.actionItems.filter((i) => i.status === "DONE"),
  }),
}));

export default useActionItemStore;

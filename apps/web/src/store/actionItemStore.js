import { create } from "zustand";
import api from "@/lib/api";
import { toast } from "./toastStore";

const useActionItemStore = create((set, get) => ({
  actionItems: [],
  isLoading: false,
  pendingIds: new Set(), // track in-flight requests to prevent duplicates

  fetchActionItems: async (workspaceId) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/workspaces/${workspaceId}/action-items`);
      set({ actionItems: data, isLoading: false });
    } catch (_) {
      set({ isLoading: false });
    }
  },

  // ─── CREATE (Optimistic) ─────────────────────────────────────────────────────
  createActionItem: async (goalId, payload) => {
    const tempId = `temp_${Date.now()}`;
    const optimisticItem = {
      id: tempId,
      ...payload,
      status: payload.status || "TODO",
      createdAt: new Date().toISOString(),
      _optimistic: true,
    };

    // 1. Immediately show in UI with a temp ID
    set((state) => ({ actionItems: [...state.actionItems, optimisticItem] }));

    try {
      const { data } = await api.post(`/goals/${goalId}/action-items`, payload);

      // 2. Replace temp item with real server data
      set((state) => ({
        actionItems: state.actionItems.map((item) =>
          item.id === tempId ? { ...data.actionItem, _optimistic: false } : item
        ),
      }));
      toast.success("Action item created!");
      return { success: true, actionItem: data.actionItem };
    } catch (error) {
      // 3. Rollback — remove the optimistic temp item
      set((state) => ({
        actionItems: state.actionItems.filter((item) => item.id !== tempId),
      }));
      const msg = error.response?.data?.error || "Failed to create action item.";
      toast.error(msg);
      return { success: false, error: msg };
    }
  },

  // ─── UPDATE (Optimistic) ─────────────────────────────────────────────────────
  updateActionItem: async (id, payload) => {
    // Prevent duplicate in-flight requests for the same item
    if (get().pendingIds.has(id)) return { success: false, error: "Request in progress" };

    const previousItems = [...get().actionItems];
    set((state) => ({ pendingIds: new Set([...state.pendingIds, id]) }));

    // 1. Apply change immediately in the UI
    set((state) => ({
      actionItems: state.actionItems.map((item) =>
        item.id === id ? { ...item, ...payload } : item
      ),
    }));

    try {
      const { data } = await api.put(`/action-items/${id}`, payload);

      // 2. Sync with server truth
      set((state) => ({
        actionItems: state.actionItems.map((item) =>
          item.id === id ? { ...item, ...data.actionItem } : item
        ),
      }));
      return { success: true };
    } catch (error) {
      // 3. Rollback to previous state
      set({ actionItems: previousItems });
      const msg = error.response?.data?.error || "Failed to update. Changes reverted.";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      set((state) => {
        const next = new Set(state.pendingIds);
        next.delete(id);
        return { pendingIds: next };
      });
    }
  },

  // ─── DELETE (Optimistic) ─────────────────────────────────────────────────────
  deleteActionItem: async (id) => {
    const previousItems = [...get().actionItems];

    // 1. Remove from UI immediately
    set((state) => ({
      actionItems: state.actionItems.filter((item) => item.id !== id),
    }));
    toast.info("Action item deleted.");

    try {
      await api.delete(`/action-items/${id}`);
      return { success: true };
    } catch (error) {
      // 2. Rollback — restore the deleted item
      set({ actionItems: previousItems });
      toast.error("Failed to delete. Item restored.");
      return { success: false, error: error.response?.data?.error };
    }
  },

  // ─── DRAG & DROP STATUS CHANGE (Optimistic) ──────────────────────────────────
  moveActionItem: async (id, newStatus) => {
    const previousItems = [...get().actionItems];

    // 1. Move card in UI instantly
    set((state) => ({
      actionItems: state.actionItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      ),
    }));

    try {
      await api.put(`/action-items/${id}`, { status: newStatus });
      return { success: true };
    } catch (error) {
      // 2. Move card BACK to original column
      set({ actionItems: previousItems });
      toast.error("Failed to move card. Reverted to original column.");
      return { success: false, error: error.response?.data?.error };
    }
  },

  // ─── SOCKET LIVE UPDATE ───────────────────────────────────────────────────────
  liveUpdateActionItem: (updatedItem) => {
    set((state) => ({
      actionItems: state.actionItems.map((item) =>
        item.id === updatedItem.id
          ? { ...item, ...updatedItem, _optimistic: false }
          : item
      ),
    }));
  },

  // ─── KANBAN GROUPING ──────────────────────────────────────────────────────────
  getKanbanGroups: (state) => ({
    TODO:        state.actionItems.filter((i) => i.status === "TODO"),
    IN_PROGRESS: state.actionItems.filter((i) => i.status === "IN_PROGRESS"),
    DONE:        state.actionItems.filter((i) => i.status === "DONE"),
  }),
}));

export default useActionItemStore;

import { create } from "zustand";
import api from "@/lib/api";

const useWorkspaceStore = create((set, get) => ({
  workspaces: [],
  activeWorkspace: null,
  members: [],
  onlineUsers: [],
  isLoading: false,

  fetchMembers: async (workspaceId) => {
    try {
      const { data } = await api.get(`/workspaces/${workspaceId}/members`);
      set({ members: data });
    } catch (_) {}
  },

  fetchWorkspaces: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get("/workspaces");
      set({ workspaces: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  setActiveWorkspace: (workspace) => {
    set({ activeWorkspace: workspace, members: [], onlineUsers: [] });
  },

  fetchWorkspaceById: async (id) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/workspaces/${id}`);
      set({ activeWorkspace: data, isLoading: false });
      return data;
    } catch (error) {
      set({ isLoading: false });
    }
  },

  createWorkspace: async (payload) => {
    try {
      const { data } = await api.post("/workspaces", payload);
      set((state) => ({ workspaces: [...state.workspaces, data.workspace] }));
      return { success: true, workspace: data.workspace };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  addOnlineUser: (user) => {
    set((state) => ({
      onlineUsers: state.onlineUsers.some((u) => u.id === user.id)
        ? state.onlineUsers
        : [...state.onlineUsers, user],
    }));
  },

  removeOnlineUser: (userId) => {
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((u) => u.id !== userId),
    }));
  },
}));

export default useWorkspaceStore;

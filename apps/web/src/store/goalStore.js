import { create } from "zustand";
import api from "@/lib/api";

const useGoalStore = create((set) => ({
  goals: [],
  activeGoal: null,
  isLoading: false,
  // Collaboration state
  collaborators: [],
  remoteCursors: {}, // { userId: { x, y } }
  liveDescription: "",

  setCollaborators: (users) => set({ collaborators: users }),
  setRemoteCursor: (userId, cursor) => set((state) => ({
    remoteCursors: { ...state.remoteCursors, [userId]: cursor }
  })),
  setLiveDescription: (content) => set({ liveDescription: content }),

  fetchGoals: async (workspaceId) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/workspaces/${workspaceId}/goals`);
      set({ goals: data, isLoading: false });
    } catch (_) {
      set({ isLoading: false });
    }
  },

  fetchGoalById: async (goalId) => {
    try {
      const { data } = await api.get(`/goals/${goalId}`);
      set({ 
        activeGoal: data,
        liveDescription: data.description || ""
      });
      return data;
    } catch (_) {}
  },

  createGoal: async (workspaceId, payload) => {
    try {
      const { data } = await api.post(`/workspaces/${workspaceId}/goals`, payload);
      set((state) => ({ goals: [data.goal, ...state.goals] }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  updateGoal: async (goalId, payload) => {
    try {
      const { data } = await api.put(`/goals/${goalId}`, payload);
      set((state) => ({
        goals: state.goals.map((g) => (g.id === goalId ? { ...g, ...data.goal } : g)),
        activeGoal: data.goal
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  deleteGoal: async (goalId) => {
    try {
      await api.delete(`/goals/${goalId}`);
      set((state) => ({ goals: state.goals.filter((g) => g.id !== goalId) }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },
}));

export default useGoalStore;

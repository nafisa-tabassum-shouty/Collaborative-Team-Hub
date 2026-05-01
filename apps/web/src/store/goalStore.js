import { create } from "zustand";
import api from "@/lib/api";
import useOfflineStore from "./offlineStore";

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
    const { isOnline, addToQueue } = useOfflineStore.getState();

    if (!isOnline) {
      // Offline implementation
      const tempId = `temp-${Date.now()}`;
      const optimisticGoal = { ...payload, id: tempId, status: "OPEN", createdAt: new Date().toISOString() };
      
      set((state) => ({ goals: [optimisticGoal, ...state.goals] }));
      
      addToQueue({
        action: "CREATE_GOAL",
        method: "POST",
        endpoint: `/workspaces/${workspaceId}/goals`,
        payload
      });

      return { success: true, offline: true };
    }

    try {
      const { data } = await api.post(`/workspaces/${workspaceId}/goals`, payload);
      set((state) => ({ goals: [data.goal, ...state.goals] }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  updateGoal: async (goalId, payload) => {
    const previousGoals = [...useGoalStore.getState().goals];
    const previousActive = useGoalStore.getState().activeGoal;

    // Optimistic Update
    set((state) => ({
      goals: state.goals.map((g) => (g.id === goalId ? { ...g, ...payload } : g)),
      activeGoal: state.activeGoal?.id === goalId ? { ...state.activeGoal, ...payload } : state.activeGoal
    }));

    try {
      const { data } = await api.put(`/goals/${goalId}`, payload);
      // Sync with server response
      set((state) => ({
        goals: state.goals.map((g) => (g.id === goalId ? { ...g, ...data.goal } : g)),
        activeGoal: data.goal
      }));
      return { success: true };
    } catch (error) {
      // Rollback on error
      set({ goals: previousGoals, activeGoal: previousActive });
      return { success: false, error: error.response?.data?.error || "Failed to update goal" };
    }
  },

  deleteGoal: async (goalId) => {
    const previousGoals = [...useGoalStore.getState().goals];

    // Optimistic Update
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== goalId)
    }));

    try {
      await api.delete(`/goals/${goalId}`);
      return { success: true };
    } catch (error) {
      // Rollback on error
      set({ goals: previousGoals });
      return { success: false, error: error.response?.data?.error || "Failed to delete goal" };
    }
  },

  // Milestone Actions
  addMilestone: async (goalId, payload) => {
    try {
      const { data } = await api.post(`/goals/${goalId}/milestones`, payload);
      set((state) => ({
        goals: state.goals.map((g) => {
          if (g.id !== goalId) return g;
          return {
            ...g,
            milestones: [...(g.milestones || []), data.milestone],
            _count: { ...g._count, milestones: (g._count?.milestones || 0) + 1 }
          };
        })
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  updateMilestone: async (goalId, milestoneId, payload) => {
    try {
      const { data } = await api.put(`/goals/${goalId}/milestones/${milestoneId}`, payload);
      set((state) => ({
        goals: state.goals.map((g) => {
          if (g.id !== goalId) return g;
          return {
            ...g,
            milestones: g.milestones.map((m) => (m.id === milestoneId ? data.milestone : m))
          };
        })
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  addGoalComment: async (goalId, content) => {
    try {
      const { data } = await api.post(`/goals/${goalId}/comments`, { content });
      return { success: true, comment: data.comment };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },
}));

export default useGoalStore;

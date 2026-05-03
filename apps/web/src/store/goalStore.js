import { create } from "zustand";
import api from "@/lib/api";
import { toast } from "./toastStore";

const useGoalStore = create((set, get) => ({
  goals: [],
  activeGoal: null,
  isLoading: false,
  pendingIds: new Set(),

  // Collaboration state
  collaborators: [],
  remoteCursors: {},
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
    const tempId = `temp_${Date.now()}`;
    const optimisticGoal = { 
      id: tempId, 
      ...payload, 
      status: "OPEN", 
      createdAt: new Date().toISOString(),
      milestones: [],
      _count: { milestones: 0 },
      _optimistic: true
    };
    
    set((state) => ({ goals: [optimisticGoal, ...state.goals] }));

    try {
      const { data } = await api.post(`/workspaces/${workspaceId}/goals`, payload);
      set((state) => ({ 
        goals: state.goals.map((g) => (g.id === tempId ? { ...data.goal, _optimistic: false } : g)) 
      }));
      toast.success("Goal created successfully!");
      return { success: true };
    } catch (error) {
      set((state) => ({ goals: state.goals.filter((g) => g.id !== tempId) }));
      toast.error(error.response?.data?.error || "Failed to create goal.");
      return { success: false, error: error.response?.data?.error };
    }
  },

  updateGoal: async (goalId, payload) => {
    const previousGoals = [...get().goals];
    const previousActive = get().activeGoal;

    set((state) => ({
      goals: state.goals.map((g) => (g.id === goalId ? { ...g, ...payload } : g)),
      activeGoal: state.activeGoal?.id === goalId ? { ...state.activeGoal, ...payload } : state.activeGoal
    }));

    try {
      const { data } = await api.put(`/goals/${goalId}`, payload);
      set((state) => ({
        goals: state.goals.map((g) => (g.id === goalId ? { ...g, ...data.goal } : g)),
        activeGoal: data.goal
      }));
      return { success: true };
    } catch (error) {
      set({ goals: previousGoals, activeGoal: previousActive });
      toast.error("Failed to update goal.");
      return { success: false, error: error.response?.data?.error || "Failed to update goal" };
    }
  },

  deleteGoal: async (goalId) => {
    const previousGoals = [...get().goals];

    set((state) => ({
      goals: state.goals.filter((g) => g.id !== goalId)
    }));
    toast.info("Goal deleted.");

    try {
      await api.delete(`/goals/${goalId}`);
      return { success: true };
    } catch (error) {
      set({ goals: previousGoals });
      toast.error("Failed to delete goal.");
      return { success: false, error: error.response?.data?.error || "Failed to delete goal" };
    }
  },

  addMilestone: async (goalId, payload) => {
    const tempId = `temp_${Date.now()}`;
    const optimisticMilestone = {
      id: tempId,
      ...payload,
      completed: false,
      createdAt: new Date().toISOString(),
      _optimistic: true
    };
    const previousGoals = [...get().goals];

    set((state) => ({
      goals: state.goals.map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          milestones: [...(g.milestones || []), optimisticMilestone],
          _count: { ...g._count, milestones: (g._count?.milestones || 0) + 1 }
        };
      })
    }));

    try {
      const { data } = await api.post(`/goals/${goalId}/milestones`, payload);
      set((state) => ({
        goals: state.goals.map((g) => {
          if (g.id !== goalId) return g;
          return {
            ...g,
            milestones: g.milestones.map((m) => (m.id === tempId ? { ...data.milestone, _optimistic: false } : m))
          };
        })
      }));
      return { success: true };
    } catch (error) {
      set({ goals: previousGoals });
      toast.error("Failed to add milestone.");
      return { success: false, error: error.response?.data?.error };
    }
  },

  updateMilestone: async (goalId, milestoneId, payload) => {
    const previousGoals = [...get().goals];

    set((state) => ({
      goals: state.goals.map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          milestones: g.milestones.map((m) => (m.id === milestoneId ? { ...m, ...payload } : m))
        };
      })
    }));

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
      set({ goals: previousGoals });
      toast.error("Failed to update milestone.");
      return { success: false, error: error.response?.data?.error };
    }
  },

  addGoalComment: async (goalId, content) => {
    try {
      const { data } = await api.post(`/goals/${goalId}/comments`, { content });
      toast.success("Comment posted!");
      return { success: true, comment: data.comment };
    } catch (error) {
      toast.error("Failed to add comment.");
      return { success: false, error: error.response?.data?.error };
    }
  },

  updateGoalComment: async (goalId, commentId, content) => {
    try {
      const { data } = await api.put(`/goals/${goalId}/comments/${commentId}`, { content });
      toast.success("Comment updated!");
      return { success: true, comment: data.comment };
    } catch (error) {
      toast.error("Failed to update comment.");
      return { success: false, error: error.response?.data?.error };
    }
  },

  deleteGoalComment: async (goalId, commentId) => {
    try {
      await api.delete(`/goals/${goalId}/comments/${commentId}`);
      toast.info("Comment deleted.");
      return { success: true };
    } catch (error) {
      toast.error("Failed to delete comment.");
      return { success: false, error: error.response?.data?.error };
    }
  },

  fetchGoalActivity: async (goalId) => {
    try {
      const { data } = await api.get(`/goals/${goalId}/activity`);
      return data;
    } catch (_) {
      return [];
    }
  },
}));

export default useGoalStore;

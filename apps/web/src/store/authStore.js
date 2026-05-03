import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import { connectSocket, disconnectSocket } from "@/lib/socket";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/login", { email, password });
          set({ user: data.user, isAuthenticated: true, isLoading: false });
          connectSocket(); // Connect socket after login
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.error || "Login failed" };
        }
      },

      register: async (name, email, password, avatar = null) => {
        set({ isLoading: true });
        try {
          let response;
          // Check if it's a File object or a String URL
          if (avatar && typeof avatar !== "string") {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("avatar", avatar);
            response = await api.post("/auth/register", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          } else {
            // Normal JSON request if avatar is a string URL or null
            response = await api.post("/auth/register", { name, email, password, avatarUrl: avatar });
          }
          const { data } = response;
          set({ user: data.user, isAuthenticated: true, isLoading: false });
          connectSocket();
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.error || "Registration failed" };
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch (_) {}
        disconnectSocket();
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: async (name, avatar = null) => {
        set({ isLoading: true });
        try {
          let response;
          if (avatar && typeof avatar !== "string") {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("avatar", avatar);
            response = await api.put("/users/profile", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          } else {
            response = await api.put("/users/profile", { name, avatarUrl: avatar });
          }
          const { data } = response;
          set({ user: data.user, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.error || "Profile update failed" };
        }
      },

      fetchMe: async () => {
        set({ isLoading: true });
        try {
          const { data } = await api.get("/auth/me");
          set({ user: data.user, isAuthenticated: true, isLoading: false });
          connectSocket();
        } catch (_) {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;

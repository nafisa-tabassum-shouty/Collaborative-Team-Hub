import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";

const useOfflineStore = create(
  persist(
    (set, get) => ({
      queue: [], // Array of { id, action, payload, endpoint, method }
      isOnline: typeof window !== "undefined" ? navigator.onLine : true,

      setOnlineStatus: (status) => set({ isOnline: status }),

      addToQueue: (item) => {
        const id = Date.now().toString();
        set((state) => ({ queue: [...state.queue, { ...item, id }] }));
        console.log("📥 Added to offline queue:", item.action);
      },

      removeFromQueue: (id) => {
        set((state) => ({ queue: state.queue.filter((item) => item.id !== id) }));
      },

      processQueue: async () => {
        const { queue, isOnline, removeFromQueue } = get();
        if (!isOnline || queue.length === 0) return;

        console.log("🔄 Processing offline queue...");
        
        for (const item of queue) {
          try {
            const { method, endpoint, payload } = item;
            await api[method.toLowerCase()](endpoint, payload);
            removeFromQueue(item.id);
            console.log("✅ Offline action synced:", item.action);
          } catch (error) {
            console.error("❌ Failed to sync offline action:", item.action, error);
            // If it's a 4xx error, remove it (invalid request), if 5xx keep it for retry
            if (error.response?.status < 500) {
              removeFromQueue(item.id);
            }
            break; // Stop processing further to maintain order
          }
        }
      },
    }),
    {
      name: "offline-storage",
    }
  )
);

export default useOfflineStore;

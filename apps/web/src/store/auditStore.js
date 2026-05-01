import { create } from "zustand";
import api from "@/lib/api";

const useAuditStore = create((set) => ({
  logs: [],
  isLoading: false,

  fetchLogs: async (workspaceId) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/workspaces/${workspaceId}/audit-logs`);
      set({ logs: data, isLoading: false });
    } catch (_) {
      set({ isLoading: false });
    }
  },

  exportToCSV: (workspaceName) => {
    const { logs } = useAuditStore.getState();
    if (logs.length === 0) return;

    const headers = ["Timestamp", "User", "Action", "Entity", "Details"];
    const rows = logs.map(log => [
      new Date(log.createdAt).toLocaleString(),
      log.user?.name || "System",
      log.action,
      log.entity,
      log.details || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `audit_log_${workspaceName.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}));

export default useAuditStore;

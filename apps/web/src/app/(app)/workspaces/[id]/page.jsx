"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useWorkspaceStore from "@/store/workspaceStore";
import useAuthStore from "@/store/authStore";
import SocketProvider from "@/providers/SocketProvider";
import Sidebar from "@/components/workspace/Sidebar";
import GoalsPanel from "@/components/workspace/GoalsPanel";
import KanbanBoard from "@/components/workspace/KanbanBoard";
import AnnouncementsFeed from "@/components/workspace/AnnouncementsFeed";
import MembersPanel from "@/components/workspace/MembersPanel";
import DashboardAnalytics from "@/components/workspace/DashboardAnalytics";

const VIEWS = ["goals", "kanban", "announcements", "members", "analytics"];

export default function WorkspacePage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchWorkspaceById, activeWorkspace, isLoading } = useWorkspaceStore();
  const { logout } = useAuthStore();
  const [activeView, setActiveView] = useState("announcements");

  useEffect(() => {
    if (id) fetchWorkspaceById(id);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary text-sm">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!activeWorkspace) return null;

  const renderView = () => {
    switch (activeView) {
      case "goals":        return <GoalsPanel workspaceId={id} />;
      case "kanban":       return <KanbanBoard workspaceId={id} />;
      case "announcements":return <AnnouncementsFeed workspaceId={id} />;
      case "members":      return <MembersPanel workspaceId={id} />;
      case "analytics":    return <DashboardAnalytics workspaceId={id} />;
      default:             return null;
    }
  };

  return (
    <SocketProvider workspaceId={id}>
      <div className="min-h-screen bg-bg-primary text-text-primary flex transition-colors">
        <Sidebar
          workspace={activeWorkspace}
          activeView={activeView}
          onViewChange={setActiveView}
          onLogout={async () => { await logout(); router.push("/login"); }}
        />
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>
    </SocketProvider>
  );
}

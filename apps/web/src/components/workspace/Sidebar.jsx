"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useWorkspaceStore from "@/store/workspaceStore";
import useAuthStore from "@/store/authStore";

import ThemeToggle from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { id: "announcements", label: "Announcements", icon: "📢" },
  { id: "goals",         label: "Goals",         icon: "🎯" },
  { id: "kanban",        label: "Kanban Board",  icon: "📋" },
  { id: "members",       label: "Members",       icon: "👥" },
];

export default function Sidebar({ workspace, activeView, onViewChange, onLogout }) {
  const { workspaces, onlineUsers } = useWorkspaceStore();
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <aside className="w-64 bg-sidebar-bg border-r border-border-color flex flex-col h-screen sticky top-0 transition-colors">
      {/* Brand + Workspace name */}
      <div className="px-4 py-5 border-b border-border-color">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
            style={{ backgroundColor: workspace?.accentColor || "#4f46e5" }}
          >
            {workspace?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-text-primary truncate">{workspace?.name}</p>
            <p className="text-xs text-text-muted">{onlineUsers.length} online</p>
          </div>
        </div>
      </div>

      {/* Workspace switcher */}
      <div className="px-3 pt-4 pb-2">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-2">Workspaces</p>
        <div className="space-y-1">
          {workspaces.map((ws) => (
            <Link
              key={ws.id}
              href={`/workspaces/${ws.id}`}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                ws.id === workspace?.id
                  ? "bg-bg-secondary text-text-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
              }`}
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: ws.accentColor || "#4f46e5" }}
              >
                {ws.name.charAt(0).toUpperCase()}
              </div>
              <span className="truncate">{ws.name}</span>
            </Link>
          ))}
          <Link
            href="/workspaces/new"
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-text-muted hover:text-accent transition-colors"
          >
            <span>+</span> New workspace
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 flex-1">
        <div className="flex items-center justify-between px-2 mb-2">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Navigation</p>
        </div>
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                activeView === item.id
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Theme Settings at bottom of Nav */}
        <div className="mt-8 px-2 space-y-5">
          <div>
            <p className="text-[10px] font-black uppercase text-text-muted tracking-widest mb-3 ml-1">Theme Settings</p>
            <ThemeToggle />
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider text-text-secondary hover:text-accent hover:bg-accent/10 border border-transparent hover:border-accent/20 transition-all duration-300 shadow-sm"
          >
            <span className="text-sm">🏠</span>
            <span>Exit Dashboard</span>
          </button>
        </div>
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-border-color bg-bg-secondary/30 backdrop-blur-sm mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
            <p className="text-[10px] text-text-muted truncate opacity-80">{user?.email}</p>
          </div>
          <button 
            onClick={onLogout} 
            title="Logout" 
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
          >
            <span className="text-lg">⬡</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

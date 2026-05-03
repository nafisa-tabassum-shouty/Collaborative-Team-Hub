"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useWorkspaceStore from "@/store/workspaceStore";
import useAuthStore from "@/store/authStore";
import useNotificationStore from "@/store/notificationStore";

import ThemeToggle from "@/components/ThemeToggle";
import ProfileModal from "@/components/workspace/ProfileModal";

const NAV_ITEMS = [
  { id: "announcements", label: "Announcements", icon: "📢" },
  { id: "goals",         label: "Goals",         icon: "🎯" },
  { id: "kanban",        label: "Kanban Board",  icon: "📋" },
  { id: "members",       label: "Members",       icon: "👥" },
  { id: "analytics",     label: "Analytics",     icon: "📊" },
];

export default function Sidebar({ workspace, activeView, onViewChange, onLogout }) {
  const { workspaces, onlineUsers } = useWorkspaceStore();
  const { user } = useAuthStore();
  const { unreadCount, fetchNotifications, notifications, markAsRead } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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
          <div 
            onClick={() => setShowProfile(true)}
            className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm cursor-pointer overflow-hidden hover:ring-2 hover:ring-accent transition-all"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setShowProfile(true)}>
            <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
            <p className="text-[10px] text-text-muted truncate opacity-80">{user?.email}</p>
          </div>
          <div className="flex gap-1 items-center relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications" 
              className="relative w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-all duration-300"
            >
              <span className="text-lg">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-bg-card flex items-center justify-center text-[8px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute bottom-0 left-[calc(100%+15px)] w-85 bg-bg-card border border-border-color shadow-2xl rounded-2xl p-0 z-50 transform origin-bottom-left transition-all overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-border-color bg-bg-secondary/30">
                  <h3 className="font-bold text-text-primary text-sm flex items-center gap-2">
                    Notifications
                    {unreadCount > 0 && <span className="bg-accent text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                  </h3>
                  <div className="flex gap-3">
                    {unreadCount > 0 && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          notifications.filter(n => !n.isRead).forEach(n => markAsRead(n.id));
                        }} 
                        className="text-[10px] text-accent hover:underline font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
                    <button onClick={() => setShowNotifications(false)} className="text-text-muted hover:text-text-primary">
                      <span className="text-lg">×</span>
                    </button>
                  </div>
                </div>
                <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                      <span className="text-3xl mb-2 opacity-20">🔔</span>
                      <p className="text-xs text-text-muted">No notifications yet. When someone mentions you or reacts to your posts, they will show up here.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border-color/50">
                      {notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            if (!n.isRead) markAsRead(n.id);
                            setShowNotifications(false);
                            if (n.link) router.push(n.link);
                          }}
                          className={`p-4 cursor-pointer transition-all relative flex gap-3 hover:bg-bg-secondary group ${!n.isRead ? 'bg-accent/5' : ''}`}
                        >
                          {!n.isRead && (
                            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent rounded-full shadow-sm shadow-accent/50"></span>
                          )}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${!n.isRead ? 'bg-accent/20 text-accent' : 'bg-bg-secondary text-text-muted'}`}>
                            {n.type === 'MENTION' ? '@' : n.type === 'REACTION' ? '❤️' : '🔔'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[12px] leading-relaxed mb-1 ${!n.isRead ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}>
                              {n.content}
                            </p>
                            <div className="text-[10px] text-text-muted flex items-center gap-2">
                              <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                              <span className="w-1 h-1 bg-border-color rounded-full"></span>
                              <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-border-color text-center bg-bg-secondary/10">
                  <button className="text-[10px] text-text-muted hover:text-accent font-medium transition-colors">
                    See all history
                  </button>
                </div>
              </div>
            )}

            <button 
              onClick={onLogout} 
              title="Logout" 
              className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
            >
              <span className="text-lg">⬡</span>
            </button>
          </div>
        </div>
      </div>
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </aside>
  );
}

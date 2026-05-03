"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import useNotificationStore from "@/store/notificationStore";
import useWorkspaceStore from "@/store/workspaceStore";
import useAuthStore from "@/store/authStore";
import Sidebar from "@/components/workspace/Sidebar";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsPage() {
  const router = useRouter();
  const { 
    notifications, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    isLoading, 
    currentPage, 
    totalPages 
  } = useNotificationStore();
  const { workspaces, fetchWorkspaces } = useWorkspaceStore();
  const { logout } = useAuthStore();
  const [activeView, setActiveView] = useState("notifications");

  const observer = useRef();
  const lastNotificationRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && currentPage < totalPages) {
        fetchNotifications(currentPage + 1, 20, true);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, currentPage, totalPages, fetchNotifications]);

  useEffect(() => {
    fetchNotifications(1, 20, false);
    fetchWorkspaces();
  }, [fetchNotifications, fetchWorkspaces]);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'MENTION': return '🏷️';
      case 'COMMENT': return '💬';
      case 'REACTION': return '❤️';
      case 'ASSIGNMENT': return '📋';
      case 'WORKSPACE_JOIN': return '🤝';
      default: return '🔔';
    }
  };

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden transition-colors">
      <Sidebar 
        workspace={workspaces[0]} 
        activeView={activeView} 
        onViewChange={(id) => {
          if (id !== 'notifications') {
            router.push(workspaces[0] ? `/workspaces/${workspaces[0].id}` : "/dashboard");
          }
        }} 
        onLogout={async () => { await logout(); router.push("/login"); }}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="border-b border-border-color bg-bg-card/50 backdrop-blur-md px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-black text-text-primary tracking-tight">Notification History</h1>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-0.5">Stay updated across all workspaces</p>
          </div>
          <button 
            onClick={markAllAsRead}
            className="px-5 py-2.5 bg-accent/10 text-accent text-xs font-black uppercase tracking-wider rounded-xl hover:bg-accent/20 transition-all border border-accent/20 shadow-sm"
          >
            Mark all read
          </button>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            <div className="bg-bg-card border border-border-color rounded-3xl overflow-hidden shadow-xl shadow-accent/5">
              {notifications.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center text-5xl mb-6 opacity-30">
                    🔔
                  </div>
                  <h3 className="text-xl font-black text-text-primary">All quiet here</h3>
                  <p className="text-sm text-text-secondary max-w-xs mx-auto mt-3 font-medium">
                    When you get mentions or updates, they will appear in this history.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border-color/30">
                  {notifications.map((n, index) => {
                    const isLast = index === notifications.length - 1;
                    return (
                      <div 
                        key={n.id}
                        ref={isLast ? lastNotificationRef : null}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-6 flex gap-5 cursor-pointer transition-all hover:bg-bg-secondary group relative ${!n.isRead ? 'bg-accent/5' : ''}`}
                      >
                        {!n.isRead && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-accent rounded-r-full shadow-lg shadow-accent/40" />
                        )}
                        
                        <div className="relative flex-shrink-0">
                          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-bg-card shadow-md group-hover:scale-105 transition-transform duration-300">
                            {n.actor?.avatarUrl ? (
                              <img 
                                src={n.actor.avatarUrl} 
                                alt={n.actor.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-accent/20 flex items-center justify-center text-accent font-black text-lg">
                                {n.actor?.name?.charAt(0) || '?'}
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-bg-card rounded-full flex items-center justify-center text-sm shadow-md border border-border-color">
                            {getIcon(n.type)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 pt-1">
                          <p className={`text-sm leading-relaxed mb-2 ${!n.isRead ? 'text-text-primary font-bold' : 'text-text-secondary'}`}>
                            <span className="font-black text-text-primary">{n.actor?.name || 'Someone'}</span> {n.content.replace('undefined', '').replace(n.actor?.name || '', '').trim()}
                          </p>
                          <div className="flex items-center gap-4 text-[11px] text-text-muted font-bold uppercase tracking-widest">
                            <span>
                              {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                            </span>
                            {!n.isRead && (
                              <span className="text-accent flex items-center gap-1.5 animate-pulse">
                                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                                NEW
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                            →
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {isLoading && (
                <div className="py-12 flex flex-col items-center gap-3 border-t border-border-color bg-bg-secondary/10">
                  <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Synchronizing...</span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

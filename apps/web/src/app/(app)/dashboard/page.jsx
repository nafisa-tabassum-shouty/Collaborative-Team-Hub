"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import useWorkspaceStore from "@/store/workspaceStore";

import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const { workspaces, fetchWorkspaces, isLoading, createWorkspace } = useWorkspaceStore();
  const router = useRouter();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors">
      {/* Top nav */}
      <header className="border-b border-border-color bg-bg-card/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-sm">C</div>
          <span className="font-bold text-lg tracking-tight">Team Hub</span>
        </div>
        <div className="flex items-center gap-6">
          <ThemeToggle compact />
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary hidden sm:block">
              Hey, <span className="text-text-primary font-semibold">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-text-muted hover:text-red-500 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Your Workspaces</h1>
            <p className="text-text-secondary text-sm mt-1 font-medium">Select a workspace to get started or create a new one</p>
          </div>
          <Link
            href="/workspaces/new"
            className="bg-accent hover:bg-accent-hover text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 text-center"
          >
            + New Workspace
          </Link>
        </div>

        {/* Workspaces Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-bg-card border border-border-color rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-bg-secondary rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-bg-secondary rounded w-3/4" />
                    <div className="h-3 bg-bg-secondary rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-bg-secondary rounded w-full mb-2" />
                <div className="h-3 bg-bg-secondary rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-border-color rounded-3xl bg-bg-secondary/20">
            <div className="text-6xl mb-6 opacity-20">🏢</div>
            <p className="text-text-secondary text-lg mb-6 font-medium">No workspaces yet</p>
            <Link
              href="/workspaces/new"
              className="text-accent hover:text-accent-hover text-sm font-bold bg-accent/5 px-6 py-3 rounded-full transition-colors"
            >
              Create your first workspace →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((ws) => (
              <Link
                key={ws.id}
                href={`/workspaces/${ws.id}`}
                className="group bg-bg-card border border-border-color hover:border-accent/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 relative overflow-hidden"
              >
                {/* Hover effect background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                
                <div className="flex items-center gap-4 mb-4 relative z-0">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm"
                    style={{ backgroundColor: ws.accentColor || "#4f46e5" }}
                  >
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-text-primary group-hover:text-accent transition-colors truncate">
                      {ws.name}
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      {ws._count?.members ?? 0} member{ws._count?.members !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                {ws.description && (
                  <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed relative z-0">{ws.description}</p>
                )}
                <div className="mt-4 pt-4 border-t border-border-color/50 flex items-center justify-between relative z-0">
                  <span className="text-[10px] font-bold text-accent group-hover:translate-x-1 transition-transform">Enter Workspace →</span>
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(3, ws._count?.members || 0))].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-bg-card bg-bg-secondary" />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

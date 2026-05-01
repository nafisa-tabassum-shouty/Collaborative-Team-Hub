"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import useWorkspaceStore from "@/store/workspaceStore";

export default function MembersPanel({ workspaceId }) {
  const { onlineUsers } = useWorkspaceStore();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, [workspaceId]);

  const fetchMembers = async () => {
    try {
      const { data } = await api.get(`/workspaces/${workspaceId}`);
      setMembers(data.members || []);
    } catch (_) {}
    finally { setIsLoading(false); }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteStatus(null);
    try {
      await api.post(`/workspaces/${workspaceId}/invite`, { email: inviteEmail });
      setInviteStatus({ type: "success", message: "Invite sent successfully!" });
      setInviteEmail("");
      fetchMembers();
    } catch (error) {
      setInviteStatus({ type: "error", message: error.response?.data?.error || "Invite failed" });
    }
  };

  const onlineUserIds = new Set(onlineUsers.map((u) => u.id));

  return (
    <div className="p-6 max-w-xl mx-auto transition-colors">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary">Members</h2>
        <p className="text-text-secondary text-sm mt-1">Team members and their roles</p>
      </div>

      {/* Invite form */}
      <div className="bg-bg-card border border-border-color rounded-xl p-5 mb-6 shadow-sm">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Invite a Member</h3>
        <form onSubmit={handleInvite} className="flex gap-3">
          <input
            type="email"
            required
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="flex-1 bg-input-bg border border-border-color text-text-primary rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-text-muted transition-colors"
          />
          <button
            type="submit"
            className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            Invite
          </button>
        </form>
        {inviteStatus && (
          <p className={`text-sm mt-3 ${inviteStatus.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
            {inviteStatus.message}
          </p>
        )}
      </div>

      {/* Members list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-bg-card border border-border-color rounded-xl animate-pulse">
              <div className="w-10 h-10 bg-bg-secondary rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-bg-secondary rounded w-1/3" />
                <div className="h-3 bg-bg-secondary rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => {
            const isOnline = onlineUserIds.has(member.user?.id || member.userId);
            return (
              <div
                key={member.userId || member.id}
                className="flex items-center gap-3 p-3 bg-bg-card border border-border-color rounded-xl hover:border-accent/30 transition-all shadow-sm"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-white text-sm shadow-sm">
                    {(member.user?.name || "?").charAt(0).toUpperCase()}
                  </div>
                  {/* Online dot */}
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-bg-card ${
                      isOnline ? "bg-green-500" : "bg-gray-400 dark:bg-gray-600"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{member.user?.name}</p>
                  <p className="text-xs text-text-muted truncate">{member.user?.email}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight shadow-sm ${
                    member.role === "ADMIN"
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "bg-bg-secondary text-text-secondary border border-border-color"
                  }`}
                >
                  {member.role}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

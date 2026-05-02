"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import useWorkspaceStore from "@/store/workspaceStore";
import useAuthStore from "@/store/authStore";

export default function MembersPanel({ workspaceId }) {
  const { onlineUsers } = useWorkspaceStore();
  const { user: currentUser } = useAuthStore();
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

  const currentMembership = members.find(m => m.userId === currentUser?.id);
  const isAdmin = currentMembership?.role === "ADMIN";

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteStatus({ type: "loading", message: "Sending invitation..." });
    try {
      await api.post(`/workspaces/${workspaceId}/invite`, { email: inviteEmail, role: "MEMBER" });
      setInviteStatus({ type: "success", message: "Success! An invitation email has been sent." });
      setInviteEmail("");
      fetchMembers();
      setTimeout(() => setInviteStatus(null), 5000);
    } catch (error) {
      setInviteStatus({ type: "error", message: error.response?.data?.error || "Failed to send invitation" });
    }
  };

  const onlineUserIds = new Set(onlineUsers.map((u) => u.id));

  return (
    <div className="p-6 max-w-4xl mx-auto transition-colors">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Team Members</h2>
          <p className="text-text-secondary text-sm mt-1">Manage access and collaborate with your team</p>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isAdmin ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-8`}>
        {/* Left: Invite Section (ADMIN ONLY) */}
        {isAdmin && (
          <div className="lg:col-span-1">
            <div className="bg-bg-card border border-border-color rounded-2xl p-6 shadow-sm sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">✉️</span>
                <h3 className="font-bold text-text-primary">Invite Member</h3>
              </div>
              <p className="text-xs text-text-secondary mb-6 leading-relaxed">
                Enter the email address of your colleague to invite them to this workspace. They will receive an email with instructions.
              </p>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-text-muted ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-input-bg border border-border-color text-text-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-text-muted transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={inviteStatus?.type === "loading"}
                  className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-md active:scale-95"
                >
                  {inviteStatus?.type === "loading" ? "Sending..." : "Send Invitation"}
                </button>
              </form>
              {inviteStatus && (
                <div className={`mt-4 p-3 rounded-xl text-xs font-medium animate-in fade-in slide-in-from-top-2 ${
                  inviteStatus.type === "success" ? "bg-green-500/10 text-green-600 dark:text-green-400" : 
                  inviteStatus.type === "error" ? "bg-red-500/10 text-red-500" : "bg-bg-secondary text-text-secondary"
                }`}>
                  {inviteStatus.message}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right: Members List */}
        <div className={isAdmin ? "lg:col-span-2" : "lg:col-span-2"}>
          <div className="bg-bg-card border border-border-color rounded-2xl overflow-hidden shadow-sm">
             <div className="p-4 border-b border-border-color bg-bg-secondary/20 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Active Members</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-bg-secondary text-text-primary">
                  {members.length} Total
                </span>
             </div>
             
             {isLoading ? (
               <div className="divide-y divide-border-color">
                 {[...Array(5)].map((_, i) => (
                   <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                     <div className="w-10 h-10 bg-bg-secondary rounded-full" />
                     <div className="flex-1 space-y-2">
                       <div className="h-3 bg-bg-secondary rounded w-1/3" />
                       <div className="h-3 bg-bg-secondary rounded w-1/4 opacity-50" />
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="divide-y divide-border-color">
                 {members.map((member) => {
                   const isOnline = onlineUserIds.has(member.user?.id || member.userId);
                   return (
                     <div
                       key={member.userId || member.id}
                       className="flex items-center gap-4 p-4 hover:bg-bg-secondary/30 transition-all group"
                     >
                       <div className="relative">
                         <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center font-black text-white text-sm shadow-md ring-2 ring-bg-card">
                           {(member.user?.name || "?").charAt(0).toUpperCase()}
                         </div>
                         <span
                           className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-bg-card shadow-sm ${
                             isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400 dark:bg-gray-600"
                           }`}
                         />
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                           <p className="text-sm font-bold text-text-primary truncate">{member.user?.name}</p>
                           {member.user?.id === currentUser?.id && (
                             <span className="text-[8px] font-black bg-bg-secondary text-text-muted px-1.5 py-0.5 rounded uppercase tracking-tighter">You</span>
                           )}
                         </div>
                         <p className="text-[11px] text-text-muted truncate opacity-80">{member.user?.email}</p>
                       </div>
                       <div className="flex flex-col items-end gap-1">
                         <span
                           className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-sm ${
                             member.role === "ADMIN"
                               ? "bg-accent/10 text-accent border border-accent/20"
                               : "bg-bg-secondary text-text-secondary border border-border-color"
                           }`}
                         >
                           {member.role}
                         </span>
                         <span className="text-[8px] font-bold text-text-muted italic opacity-60">
                           Joined {new Date(member.joinedAt).toLocaleDateString()}
                         </span>
                       </div>
                     </div>
                   );
                 })}
               </div>
             )}
          </div>
          
          <div className="mt-6 p-4 bg-accent/5 border border-accent/10 rounded-2xl flex items-start gap-3">
             <span className="text-lg">💡</span>
             <p className="text-xs text-text-secondary leading-relaxed">
               <b>Tip:</b> Only Admins can invite new members. Once a member joins, they will appear in the <b>Online</b> indicator in the sidebar and can be assigned to tasks on the Kanban board.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

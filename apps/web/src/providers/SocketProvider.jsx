"use client";
import { useEffect } from "react";
import { getSocket, connectSocket, joinWorkspaceRoom, leaveWorkspaceRoom } from "@/lib/socket";
import useWorkspaceStore from "@/store/workspaceStore";
import useActionItemStore from "@/store/actionItemStore";
import useAnnouncementStore from "@/store/announcementStore";

export default function SocketProvider({ children, workspaceId }) {
  const { addOnlineUser, removeOnlineUser, setOnlineUsers } = useWorkspaceStore();
  const { liveUpdateActionItem } = useActionItemStore();
  const { addLiveAnnouncement, liveUpdateReaction } = useAnnouncementStore();

  useEffect(() => {
    const socket = connectSocket();
    if (!socket || !workspaceId) return;

    // Join workspace room
    const handleConnect = () => joinWorkspaceRoom(workspaceId);
    if (socket.connected) {
      joinWorkspaceRoom(workspaceId);
    } else {
      socket.on("connect", handleConnect);
    }

    // Listen for active users list on join
    socket.on("workspace:active_users", ({ users }) => {
      setOnlineUsers(users);
    });

    // Online/offline presence
    socket.on("user:online", ({ user }) => addOnlineUser(user));
    socket.on("user:offline", ({ userId }) => removeOnlineUser(userId));

    // Live Kanban updates
    socket.on("actionItem:update", ({ updatedItem }) => liveUpdateActionItem(updatedItem));

    // Live Announcement feed
    socket.on("announcement:new", (announcement) => addLiveAnnouncement(announcement));

    // Live reactions
    socket.on("reaction:update", (payload) => liveUpdateReaction(payload));

    return () => {
      leaveWorkspaceRoom(workspaceId);
      socket.off("connect", handleConnect);
      socket.off("workspace:active_users");
      socket.off("user:online");
      socket.off("user:offline");
      socket.off("actionItem:update");
      socket.off("announcement:new");
      socket.off("reaction:update");
    };
  }, [workspaceId]);

  return children;
}

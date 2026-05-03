"use client";
import { useEffect } from "react";
import { getSocket, connectSocket, joinWorkspaceRoom, leaveWorkspaceRoom } from "@/lib/socket";
import useWorkspaceStore from "@/store/workspaceStore";
import useActionItemStore from "@/store/actionItemStore";
import useAnnouncementStore from "@/store/announcementStore";
import useNotificationStore from "@/store/notificationStore";
import useAuthStore from "@/store/authStore";

export default function SocketProvider({ children, workspaceId }) {
  const { addOnlineUser, removeOnlineUser, setOnlineUsers } = useWorkspaceStore();
  const { liveUpdateActionItem } = useActionItemStore();
  const { addLiveAnnouncement, liveUpdateReaction } = useAnnouncementStore();

  useEffect(() => {
    const socket = connectSocket();
    if (!socket || !workspaceId) return;

    // Register listeners FIRST to avoid race conditions
    socket.on("workspace:active_users", ({ users }) => {
      console.log(`📡 [Socket] Received active users for workspace ${workspaceId}:`, users.map(u => u.name));
      setOnlineUsers(users);
    });

    socket.on("user:online", ({ user }) => {
      console.log(`🟢 [Socket] User online:`, user.name);
      addOnlineUser(user);
    });
    
    socket.on("user:offline", ({ userId }) => {
      console.log(`🔴 [Socket] User offline:`, userId);
      removeOnlineUser(userId);
    });

    socket.on("actionItem:update", ({ updatedItem }) => liveUpdateActionItem(updatedItem));
    socket.on("announcement:new", (announcement) => addLiveAnnouncement(announcement));
    socket.on("reaction:update", (payload) => liveUpdateReaction(payload));

    socket.on("notification:new", (notification) => {
      // Only add if it's meant for the current user
      if (notification.userId === useAuthStore.getState().user?.id) {
        console.log(`🔔 [Socket] New notification:`, notification.content);
        useNotificationStore.getState().addLiveNotification(notification);
      }
    });

    // Join workspace room AFTER listeners are set
    const joinRoom = () => {
      console.log(`🚀 [Socket] Joining workspace room: ${workspaceId} with socket ID: ${socket.id}`);
      joinWorkspaceRoom(workspaceId);
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.on("connect", () => {
        console.log("✅ [Socket] Connected inside provider", socket.id);
        joinRoom();
      });
    }

    return () => {
      console.log(`🔌 [Socket] Leaving workspace room: ${workspaceId}`);
      leaveWorkspaceRoom(workspaceId);
      socket.off("connect");
      socket.off("workspace:active_users");
      socket.off("user:online");
      socket.off("user:offline");
      socket.off("actionItem:update");
      socket.off("announcement:new");
      socket.off("reaction:update");
      socket.off("notification:new");
    };
  }, [workspaceId, addOnlineUser, removeOnlineUser, setOnlineUsers, liveUpdateActionItem, addLiveAnnouncement, liveUpdateReaction]);

  return children;
}

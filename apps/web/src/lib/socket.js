import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => socket;

export const connectSocket = () => {
  if (socket) return socket;

  const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  socket = io(SOCKET_URL, {
    withCredentials: true, // Send auth cookies
    autoConnect: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.warn("⚠️ Socket disconnected:", reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinWorkspaceRoom = (workspaceId) => {
  if (socket?.connected) {
    socket.emit("workspace:join", { workspaceId });
  }
};

export const leaveWorkspaceRoom = (workspaceId) => {
  if (socket?.connected) {
    socket.emit("workspace:leave", { workspaceId });
  }
};

const jwt = require("jsonwebtoken");
const prisma = require("./lib/prisma");
const cookie = require("cookie");

// In-memory store to track online users per workspace
// Structure: { workspaceId: { userId: { socketId, userDetails } } }
const workspaceOnlineUsers = new Map();

module.exports = (io) => {
  // Authentication Middleware for Socket.io
  io.use(async (socket, next) => {
    try {
      // Extract cookies from socket handshake headers
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.accessToken || socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      
      // Fetch user details
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, name: true, avatarUrl: true, email: true }
      });

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (err) {
      console.error("Socket Auth Error:", err.message);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.user.name} (${socket.id})`);

    // =====================================
    // Workspace Room Management
    // =====================================
    socket.on("workspace:join", async ({ workspaceId }) => {
      try {
        if (!workspaceId) return;

        // Verify user is a member of the workspace
        const membership = await prisma.workspaceMember.findUnique({
          where: {
            userId_workspaceId: { userId: socket.user.id, workspaceId }
          }
        });

        if (!membership) {
          socket.emit("error", { message: "You don't have access to this workspace." });
          return;
        }

        // Join the Socket.io room for this workspace
        const roomName = `workspace_${workspaceId}`;
        socket.join(roomName);

        // Add to active users map
        if (!workspaceOnlineUsers.has(workspaceId)) {
          workspaceOnlineUsers.set(workspaceId, new Map());
        }
        const workspaceUsers = workspaceOnlineUsers.get(workspaceId);
        workspaceUsers.set(socket.user.id, {
          socketId: socket.id,
          user: socket.user
        });

        // Broadcast to others in the room that this user joined
        socket.to(roomName).emit("user:online", { user: socket.user });

        // Send the current list of online users to the user who just joined
        const activeUsersList = Array.from(workspaceUsers.values()).map(u => u.user);
        socket.emit("workspace:active_users", { users: activeUsersList });

        // Store active workspaces in socket object for easy cleanup on disconnect
        socket.activeWorkspaces = socket.activeWorkspaces || new Set();
        socket.activeWorkspaces.add(workspaceId);

        console.log(`👤 ${socket.user.name} joined room ${roomName}`);
      } catch (err) {
        console.error("Join workspace error:", err);
      }
    });

    socket.on("workspace:leave", ({ workspaceId }) => {
      if (!workspaceId) return;
      const roomName = `workspace_${workspaceId}`;
      socket.leave(roomName);

      if (workspaceOnlineUsers.has(workspaceId)) {
        const workspaceUsers = workspaceOnlineUsers.get(workspaceId);
        workspaceUsers.delete(socket.user.id);
        
        socket.to(roomName).emit("user:offline", { userId: socket.user.id });
      }
      
      if (socket.activeWorkspaces) {
        socket.activeWorkspaces.delete(workspaceId);
      }
    });

    // =====================================
    // Disconnect Handling
    // =====================================
    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.user.name} (${socket.id})`);

      // Cleanup user from all active workspaces
      if (socket.activeWorkspaces) {
        for (const workspaceId of socket.activeWorkspaces) {
          if (workspaceOnlineUsers.has(workspaceId)) {
            const workspaceUsers = workspaceOnlineUsers.get(workspaceId);
            workspaceUsers.delete(socket.user.id);
            
            // Notify others in the workspace
            io.to(`workspace_${workspaceId}`).emit("user:offline", { userId: socket.user.id });
          }
        }
      }
    });
  });
};

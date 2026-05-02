const jwt = require("jsonwebtoken");
const prisma = require("./lib/prisma");
const cookie = require("cookie");
const { 
  joinGoalRoom, 
  leaveGoalRoom, 
  updateCursor, 
  getRoomUsers, 
  clearSocketFromAllRooms 
} = require("./services/presenceService");

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
        where: { id: decoded.userId || decoded.id }, // Handle different token structures
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

        console.log(`👤 User joined workspace: ${socket.user.name} (ID: ${socket.user.id})`);
        console.log(`   Workspace ID: ${workspaceId}`);
        console.log(`   Current Users Count: ${activeUsersList.length}`);
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
    // Collaborative Editing (Feature 1)
    // =====================================
    socket.on("goal:join", ({ goalId }) => {
      if (!goalId) return;
      const roomName = `goal_${goalId}`;
      socket.join(roomName);

      const users = joinGoalRoom(goalId, socket.id, socket.user);
      
      // Update everyone in the room about the user list
      io.to(roomName).emit("goal:user_list", { users });
      console.log(`📝 ${socket.user.name} started editing goal ${goalId}`);
    });

    socket.on("goal:update", ({ goalId, content }) => {
      if (!goalId) return;
      // Broadcast content update to everyone ELSE in the room
      socket.to(`goal_${goalId}`).emit("goal:content_update", { 
        content,
        userId: socket.user.id 
      });
    });

    socket.on("goal:cursor_move", ({ goalId, cursor }) => {
      if (!goalId) return;
      updateCursor(goalId, socket.id, cursor);
      // Broadcast cursor move to everyone ELSE in the room
      socket.to(`goal_${goalId}`).emit("goal:cursor_update", {
        userId: socket.user.id,
        cursor
      });
    });

    socket.on("goal:leave", ({ goalId }) => {
      if (!goalId) return;
      const roomName = `goal_${goalId}`;
      socket.leave(roomName);
      leaveGoalRoom(goalId, socket.id);
      
      const users = getRoomUsers(goalId);
      io.to(roomName).emit("goal:user_list", { users });
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

      // Cleanup user from all goal rooms
      const affectedGoals = clearSocketFromAllRooms(socket.id);
      affectedGoals.forEach(goalId => {
        const users = getRoomUsers(goalId);
        io.to(`goal_${goalId}`).emit("goal:user_list", { users });
      });
    });
  });
};

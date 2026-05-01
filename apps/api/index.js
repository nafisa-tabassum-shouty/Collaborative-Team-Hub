require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Inject Socket.io into the request object so routes can broadcast events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
const authRoutes = require("./routes/auth.routes");
const workspaceRoutes = require("./routes/workspace.routes");
const goalRoutes = require("./routes/goal.routes");

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/workspaces/:workspaceId/goals", goalRoutes);
app.use("/api/goals", goalRoutes);

// Action Items Routes (Kanban)
const actionItemRoutes = require("./routes/action-item.routes");
app.use("/api/workspaces/:workspaceId/action-items", actionItemRoutes);
app.use("/api/goals/:goalId/action-items", actionItemRoutes);
app.use("/api/action-items", actionItemRoutes);

// Announcements Routes (Newsfeed)
const announcementRoutes = require("./routes/announcement.routes");
app.use("/api/workspaces/:workspaceId/announcements", announcementRoutes);
app.use("/api/announcements", announcementRoutes);

// Basic health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

// Initialize real-time Socket.io logic
require("./socket")(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

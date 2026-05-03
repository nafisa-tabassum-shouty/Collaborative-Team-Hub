// In-memory presence management for collaborative editing
// Maps goalId -> Map(socketId -> { userId, name, cursor: { x, y } })
const goalPresence = new Map();

const COLORS = [
  "#f87171", "#fb923c", "#fbbf24", "#a3e635", "#4ade80", 
  "#2dd4bf", "#22d3ee", "#38bdf8", "#818cf8", "#c084fc", "#f472b6"
];

const joinGoalRoom = (goalId, socketId, userData) => {
  if (!goalPresence.has(goalId)) {
    goalPresence.set(goalId, new Map());
  }
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  goalPresence.get(goalId).set(socketId, {
    ...userData,
    color,
    cursor: { x: 0, y: 0 }
  });
  return Array.from(goalPresence.get(goalId).values());
};

const leaveGoalRoom = (goalId, socketId) => {
  if (goalPresence.has(goalId)) {
    goalPresence.get(goalId).delete(socketId);
    if (goalPresence.get(goalId).size === 0) {
      goalPresence.delete(goalId);
    }
  }
};

const updateCursor = (goalId, socketId, cursor) => {
  if (goalPresence.has(goalId) && goalPresence.get(goalId).has(socketId)) {
    goalPresence.get(goalId).get(socketId).cursor = cursor;
  }
};

const getRoomUsers = (goalId) => {
  return goalPresence.has(goalId) ? Array.from(goalPresence.get(goalId).values()) : [];
};

const clearSocketFromAllRooms = (socketId) => {
  const affectedGoals = [];
  goalPresence.forEach((users, goalId) => {
    if (users.has(socketId)) {
      users.delete(socketId);
      affectedGoals.push(goalId);
      if (users.size === 0) {
        goalPresence.delete(goalId);
      }
    }
  });
  return affectedGoals;
};

module.exports = {
  joinGoalRoom,
  leaveGoalRoom,
  updateCursor,
  getRoomUsers,
  clearSocketFromAllRooms
};

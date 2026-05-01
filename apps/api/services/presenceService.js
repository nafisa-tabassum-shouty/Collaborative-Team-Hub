// In-memory presence management for collaborative editing
// Maps goalId -> Map(socketId -> { userId, name, cursor: { x, y } })
const goalPresence = new Map();

const joinGoalRoom = (goalId, socketId, userData) => {
  if (!goalPresence.has(goalId)) {
    goalPresence.set(goalId, new Map());
  }
  goalPresence.get(goalId).set(socketId, {
    ...userData,
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

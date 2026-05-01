const prisma = require("../lib/prisma");

/**
 * Log an activity asynchronously
 * @param {Object} params
 * @param {string} params.action - e.g., "CREATED_GOAL"
 * @param {string} params.entity - e.g., "Goal"
 * @param {string} params.entityId - ID of the affected entity
 * @param {string} params.workspaceId - ID of the workspace
 * @param {string} params.userId - ID of the user who performed the action
 * @param {Object} [params.details] - Optional extra details
 */
const logActivity = async ({ action, entity, entityId, workspaceId, userId, details }) => {
  try {
    // We don't await this to keep it non-blocking for the main request
    prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        workspaceId,
        userId,
        details: details ? JSON.stringify(details) : null
      }
    }).catch(err => console.error("❌ Audit Log Error:", err));
    
  } catch (err) {
    console.error("❌ Audit Log Service Error:", err);
  }
};

module.exports = { logActivity };

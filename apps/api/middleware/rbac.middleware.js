const prisma = require("../lib/prisma");
const { hasPermission } = require("../utils/permissions");

/**
 * Middleware to check if user has required permission in a workspace
 * @param {string} permission - The permission key from PERMISSIONS util
 * @param {boolean} fromParams - Whether to get workspaceId from req.params or req.body
 */
const requirePermission = (permission, fromParams = true) => {
  return async (req, res, next) => {
    try {
      const workspaceId = fromParams ? req.params.workspaceId || req.params.id : req.body.workspaceId;
      
      if (!workspaceId) {
        return res.status(400).json({ error: "Workspace ID is required for authorization" });
      }

      const membership = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: req.user.id,
            workspaceId
          }
        }
      });

      if (!membership) {
        return res.status(403).json({ error: "Access denied. You are not a member of this workspace." });
      }

      if (!hasPermission(membership.role, permission)) {
        return res.status(403).json({ error: `Access denied. Missing permission: ${permission}` });
      }

      // Attach workspace info to request for downstream routes
      req.workspaceMember = membership;
      next();
    } catch (error) {
      res.status(500).json({ error: "Authorization check failed" });
    }
  };
};

module.exports = { requirePermission };

const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../utils/permissions');

// Help function to check admin status (deprecated in favor of RBAC middleware)
const checkWorkspaceAdmin = async (workspaceId, userId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } }
  });
  return membership?.role === 'ADMIN';
};

/**
 * @swagger
 * /api/workspaces:
 *   post:
 *     summary: Create a new workspace
 *     tags: [Workspaces]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Workspace created successfully
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Workspace name is required" });

    const workspace = await prisma.workspace.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId: req.user.id,
            role: 'ADMIN'
          }
        }
      }
    });

    res.status(201).json({ message: "Workspace created successfully", workspace });
  } catch (error) {
    res.status(500).json({ error: "Failed to create workspace" });
  }
});

/**
 * @swagger
 * /api/workspaces:
 *   get:
 *     summary: Get all workspaces for the current user
 *     tags: [Workspaces]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of workspaces
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId: req.user.id },
      include: { workspace: true }
    });
    res.status(200).json(memberships.map(m => m.workspace));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workspaces" });
  }
});

/**
 * @swagger
 * /api/workspaces/{id}:
 *   get:
 *     summary: Get workspace details including members
 *     tags: [Workspaces]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workspace details
 */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } }
          }
        }
      }
    });

    if (!workspace) return res.status(404).json({ error: "Workspace not found" });

    // Check if user is a member
    const isMember = workspace.members.some(m => m.userId === req.user.id);
    if (!isMember) return res.status(403).json({ error: "Access denied" });

    res.status(200).json(workspace);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workspace details" });
  }
});

/**
 * @swagger
 * /api/workspaces/{id}/members:
 *   get:
 *     summary: Get all members of a workspace
 *     tags: [Workspaces]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of members
 */
router.get('/:id/members', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is a member of this workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: req.user.id, workspaceId: id } }
    });

    if (!membership) {
      return res.status(403).json({ error: "Access denied. You are not a member of this workspace." });
    }

    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    });
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

/**
 * @swagger
 * /api/workspaces/{id}/invite:
 *   post:
 *     summary: Invite a user to a workspace
 *     tags: [Workspaces]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MEMBER]
 *     responses:
 *       200:
 *         description: User invited successfully
 */
router.post('/:id/invite', requireAuth, requirePermission(PERMISSIONS.INVITE_MEMBER), async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role = 'MEMBER' } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const userToInvite = await prisma.user.findUnique({ where: { email } });
    if (!userToInvite) return res.status(404).json({ error: "User not found. They must register first." });

    const existingMember = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: userToInvite.id, workspaceId: id } }
    });
    if (existingMember) return res.status(400).json({ error: "User is already a member" });

    const newMember = await prisma.workspaceMember.create({
      data: { userId: userToInvite.id, workspaceId: id, role },
      include: { user: { select: { name: true, email: true } } }
    });

    // Create in-app Notification
    const workspace = await prisma.workspace.findUnique({ where: { id } });
    const notification = await prisma.notification.create({
      data: {
        type: "WORKSPACE_JOIN",
        content: `${req.user.name} added you to the workspace "${workspace.name}"`,
        link: `/workspaces/${id}`,
        userId: userToInvite.id,
        actorId: req.user.id,
        entityId: id
      },
      include: { actor: { select: { name: true, avatarUrl: true } } }
    });

    // Broadcast live notification
    req.io.to(`user_${userToInvite.id}`).emit("notification:new", notification);

    // Send Email
    const { sendEmailAsync } = require('../utils/email');
    const { invitationTemplate } = require('../utils/emailTemplates');
    
    sendEmailAsync({
      to: email,
      subject: `Invitation to join ${workspace.name}`,
      ...invitationTemplate(workspace.name, req.user.name)
    });

    res.status(200).json({ message: "User invited successfully", member: newMember });
  } catch (error) {
    res.status(500).json({ error: "Failed to invite member" });
  }
});

/**
 * @swagger
 * /api/workspaces/{id}:
 *   delete:
 *     summary: Delete a workspace
 *     tags: [Workspaces]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workspace deleted successfully
 */
router.delete('/:id', requireAuth, requirePermission(PERMISSIONS.MANAGE_WORKSPACE), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.workspace.delete({ where: { id } });
    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: "Workspace not found" });
    res.status(500).json({ error: "Failed to delete workspace" });
  }
});

/**
 * @swagger
 * /api/workspaces/{id}/audit-logs:
 *   get:
 *     summary: Get audit logs for a workspace
 *     tags: [Workspaces]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id/audit-logs', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await prisma.auditLog.findMany({
      where: { workspaceId: id },
      include: {
        user: { select: { name: true, avatarUrl: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit for performance
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

// GET /:id/stats - Get workspace analytics overview
router.get('/:id/stats', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    
    // Start of current week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const [totalGoals, completedTasksThisWeek, overdueGoals, totalTasks, completedTasks] = await Promise.all([
      prisma.goal.count({ where: { workspaceId: id } }),
      prisma.actionItem.count({ 
        where: { 
          goal: { workspaceId: id },
          status: 'DONE',
          updatedAt: { gte: startOfWeek }
        } 
      }),
      prisma.goal.count({
        where: {
          workspaceId: id,
          status: { not: 'DONE' },
          dueDate: { lt: new Date() }
        }
      }),
      prisma.actionItem.count({ where: { goal: { workspaceId: id } } }),
      prisma.actionItem.count({ where: { goal: { workspaceId: id }, status: 'DONE' } })
    ]);

    res.status(200).json({
      totalGoals,
      completedThisWeek: completedTasksThisWeek, // Now reflecting tasks
      overdueGoals,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workspace stats" });
  }
});

// GET /:id/trends - Get weekly task completion trends
router.get('/:id/trends', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const stats = await Promise.all(last7Days.map(async (date) => {
      const startOfDay = new Date(date + "T00:00:00Z");
      const endOfDay = new Date(date + "T23:59:59Z");
      
      const count = await prisma.actionItem.count({
        where: {
          goal: { workspaceId: id },
          status: 'DONE',
          updatedAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      });
      return { date, completed: count };
    }));

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

// GET /:id/export-csv - Export workspace data as CSV
router.get('/:id/export-csv', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const goals = await prisma.goal.findMany({
      where: { workspaceId: id },
      include: { owner: { select: { name: true } } }
    });

    let csv = "ID,Title,Status,Due Date,Owner\n";
    goals.forEach(g => {
      csv += `${g.id},"${g.title}",${g.status},${g.dueDate ? g.dueDate.toISOString() : 'N/A'},"${g.owner?.name}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`workspace-${id}-export.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: "Failed to export data" });
  }
});

module.exports = router;

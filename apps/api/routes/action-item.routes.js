const express = require('express');
const router = express.Router({ mergeParams: true });
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middleware/auth.middleware');

router.use(requireAuth);

// Helper: Check workspace membership
const checkWorkspaceMember = async (workspaceId, userId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });
  return membership;
};

// Helper: Get goal details to verify access
const getGoalAndMembership = async (goalId, userId) => {
  const goal = await prisma.goal.findUnique({ where: { id: goalId } });
  if (!goal) return { goal: null, membership: null };

  const membership = await checkWorkspaceMember(goal.workspaceId, userId);
  return { goal, membership };
};

// Helper: Get Action Item to verify access
const getActionItemAndMembership = async (actionItemId, userId) => {
  const actionItem = await prisma.actionItem.findUnique({
    where: { id: actionItemId },
    include: { goal: true }
  });
  if (!actionItem) return { actionItem: null, membership: null };

  const membership = await checkWorkspaceMember(actionItem.goal.workspaceId, userId);
  return { actionItem, membership };
};


// ==========================================
// WORKSPACE ACTION ITEMS (/api/workspaces/:workspaceId/action-items)
// ==========================================

// GET / - Get all action items in a workspace (with optional status filtering)
router.get('/', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { status } = req.query; // optional filter by status

    // Ensure it's called from a workspace route
    if (workspaceId) {
      const membership = await checkWorkspaceMember(workspaceId, req.user.id);
      if (!membership) return res.status(403).json({ error: "Access denied." });

      const filter = { goal: { workspaceId } };
      if (status) filter.status = status;

      const actionItems = await prisma.actionItem.findMany({
        where: filter,
        include: {
          assignee: { select: { id: true, name: true, avatarUrl: true } },
          goal: { select: { id: true, title: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      return res.status(200).json(actionItems);
    }

    // If goalId is present, fetch items for that goal
    const { goalId } = req.params;
    if (goalId) {
      const { goal, membership } = await getGoalAndMembership(goalId, req.user.id);
      if (!goal) return res.status(404).json({ error: "Goal not found" });
      if (!membership) return res.status(403).json({ error: "Access denied." });

      const filter = { goalId };
      if (status) filter.status = status;

      const actionItems = await prisma.actionItem.findMany({
        where: filter,
        include: {
          assignee: { select: { id: true, name: true, avatarUrl: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      return res.status(200).json(actionItems);
    }

    res.status(400).json({ error: "Missing workspaceId or goalId context" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch action items" });
  }
});


// ==========================================
// CREATE ACTION ITEM (/api/goals/:goalId/action-items)
// ==========================================

const { logActivity } = require('../services/auditService');

router.post('/', async (req, res) => {
  try {
    const { goalId } = req.params;
    const { title, priority, dueDate, status, assigneeId } = req.body;

    if (!goalId) return res.status(400).json({ error: "goalId is required" });
    if (!title) return res.status(400).json({ error: "Title is required" });

    const { goal, membership } = await getGoalAndMembership(goalId, req.user.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    if (!membership) return res.status(403).json({ error: "Access denied." });

    // Validate assignee is part of the workspace
    if (assigneeId) {
      const isAssigneeMember = await checkWorkspaceMember(goal.workspaceId, assigneeId);
      if (!isAssigneeMember) {
        return res.status(400).json({ error: "Assignee must be a member of the workspace" });
      }
    }

    const actionItem = await prisma.actionItem.create({
      data: {
        title,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || 'TODO',
        assigneeId,
        goalId
      },
      include: {
        assignee: { select: { id: true, name: true, avatarUrl: true } }
      }
    });

    // Log Activity
    logActivity({
      action: "CREATED_TASK",
      entity: "ActionItem",
      entityId: actionItem.id,
      workspaceId: goal.workspaceId,
      userId: req.user.id,
      details: { title: actionItem.title }
    });

    // Notify assignee if someone else assigns a task to them
    if (assigneeId && assigneeId !== req.user.id) {
      const contextUrl = `/workspaces/${goal.workspaceId}`;
      const notification = await prisma.notification.create({
        data: {
          type: "ASSIGNMENT",
          content: `${req.user.name} assigned a new task to you: "${actionItem.title}"`,
          link: contextUrl,
          userId: assigneeId,
          actorId: req.user.id
        },
        include: { actor: { select: { name: true, avatarUrl: true } } }
      });
      req.io.to(`user_${assigneeId}`).emit("notification:new", notification);
    }

    res.status(201).json({ message: "Action item created", actionItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to create action item" });
  }
});


// ==========================================
// SINGLE ACTION ITEM (/api/action-items/:id)
// ==========================================

// PUT /:id - Update action item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, priority, dueDate, status, assigneeId } = req.body;

    const { actionItem, membership } = await getActionItemAndMembership(id, req.user.id);
    if (!actionItem) return res.status(404).json({ error: "Action item not found" });
    if (!membership) return res.status(403).json({ error: "Access denied." });

    // Check permissions: Only Admin, Goal Owner, or Assignee can modify
    const isAdmin = membership.role === 'ADMIN';
    const isGoalOwner = actionItem.goal.ownerId === req.user.id;
    const isAssignee = actionItem.assigneeId === req.user.id;

    if (!isAdmin && !isGoalOwner && !isAssignee) {
      return res.status(403).json({ error: "You don't have permission to modify this task" });
    }

    // Validate new assignee if changing
    if (assigneeId && assigneeId !== actionItem.assigneeId) {
      const isAssigneeMember = await checkWorkspaceMember(actionItem.goal.workspaceId, assigneeId);
      if (!isAssigneeMember) {
        return res.status(400).json({ error: "New assignee must be a member of the workspace" });
      }
    }

    const updatedItem = await prisma.actionItem.update({
      where: { id },
      data: {
        title,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status,
        assigneeId
      },
      include: {
        assignee: { select: { id: true, name: true, avatarUrl: true } }
      }
    });

    // Log Activity
    logActivity({
      action: "UPDATED_TASK",
      entity: "ActionItem",
      entityId: id,
      workspaceId: actionItem.goal.workspaceId,
      userId: req.user.id,
      details: { title: updatedItem.title, status: updatedItem.status }
    });

    // Notify new assignee if changed and not self-assigned
    if (assigneeId && assigneeId !== actionItem.assigneeId && assigneeId !== req.user.id) {
      const contextUrl = `/workspaces/${actionItem.goal.workspaceId}`;
      const notification = await prisma.notification.create({
        data: {
          type: "ASSIGNMENT",
          content: `${req.user.name} assigned a task to you: "${updatedItem.title}"`,
          link: contextUrl,
          userId: assigneeId
        }
      });
      req.io.to(`workspace_${actionItem.goal.workspaceId}`).emit("notification:new", notification);
    }

    // Real-time Event: Kanban board update
    req.io.to(`workspace_${actionItem.goal.workspaceId}`).emit("actionItem:update", {
      actionItemId: updatedItem.id,
      updatedItem
    });

    res.status(200).json({ message: "Action item updated", actionItem: updatedItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to update action item" });
  }
});

// DELETE /:id - Delete action item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { actionItem, membership } = await getActionItemAndMembership(id, req.user.id);
    if (!actionItem) return res.status(404).json({ error: "Action item not found" });
    if (!membership) return res.status(403).json({ error: "Access denied." });

    // Check permissions: Only Admin or Goal Owner can delete
    const isAdmin = membership.role === 'ADMIN';
    const isGoalOwner = actionItem.goal.ownerId === req.user.id;

    if (!isAdmin && !isGoalOwner) {
      return res.status(403).json({ error: "Only admins or the goal owner can delete this task" });
    }

    await prisma.actionItem.delete({ where: { id } });

    // Log Activity
    logActivity({
      action: "DELETED_TASK",
      entity: "ActionItem",
      entityId: id,
      workspaceId: actionItem.goal.workspaceId,
      userId: req.user.id,
      details: { title: actionItem.title }
    });

    res.status(200).json({ message: "Action item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete action item" });
  }
});

module.exports = router;

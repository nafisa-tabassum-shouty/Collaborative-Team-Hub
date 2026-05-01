const express = require('express');
const router = express.Router({ mergeParams: true });
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middleware/auth.middleware');

router.use(requireAuth);

// Helper: Check if user is a member of the workspace
const checkWorkspaceMember = async (workspaceId, userId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });
  return membership; // returns membership object including role
};

// Helper: Check goal access and return goal + membership
const getGoalAndMembership = async (goalId, userId) => {
  const goal = await prisma.goal.findUnique({ where: { id: goalId } });
  if (!goal) return { goal: null, membership: null };

  const membership = await checkWorkspaceMember(goal.workspaceId, userId);
  return { goal, membership };
};


// ==========================================
// WORKSPACE GOALS (/api/workspaces/:workspaceId/goals)
// ==========================================

// GET / - List all goals in a workspace
router.get('/', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    if (!workspaceId) return res.status(400).json({ error: "workspaceId is required" });

    const membership = await checkWorkspaceMember(workspaceId, req.user.id);
    if (!membership) {
      return res.status(403).json({ error: "Access denied." });
    }

    const goals = await prisma.goal.findMany({
      where: { workspaceId },
      include: {
        owner: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { milestones: true, actionItems: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});
const { logActivity } = require('../services/auditService');

// POST / - Create a new goal
router.post('/', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { title, description, dueDate, status } = req.body;

    if (!workspaceId) return res.status(400).json({ error: "workspaceId is required" });
    if (!title) return res.status(400).json({ error: "Goal title is required" });

    const membership = await checkWorkspaceMember(workspaceId, req.user.id);
    if (!membership) {
      return res.status(403).json({ error: "Access denied." });
    }

    const newGoal = await prisma.goal.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || 'TODO',
        workspaceId,
        ownerId: req.user.id
      },
      include: {
        owner: { select: { id: true, name: true, avatarUrl: true } }
      }
    });

    // Log Activity
    logActivity({
      action: "CREATED_GOAL",
      entity: "Goal",
      entityId: newGoal.id,
      workspaceId,
      userId: req.user.id,
      details: { title: newGoal.title }
    });

    res.status(201).json({ message: "Goal created successfully", goal: newGoal });
  } catch (error) {
    res.status(500).json({ error: "Failed to create goal" });
  }
});


// ==========================================
// SINGLE GOAL (/api/goals/:goalId)
// ==========================================

// GET /:goalId - Get single goal with details
router.get('/:goalId', async (req, res) => {
  try {
    const { goalId } = req.params;
    if (!goalId) return res.status(400).json({ error: "goalId is required" });

    const { goal, membership } = await getGoalAndMembership(goalId, req.user.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    if (!membership) return res.status(403).json({ error: "Access denied." });

    const fullGoal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: {
        owner: { select: { id: true, name: true, avatarUrl: true } },
        milestones: { orderBy: { createdAt: 'asc' } },
        actionItems: { orderBy: { createdAt: 'desc' } }
      }
    });

    res.status(200).json(fullGoal);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch goal details" });
  }
});

// PUT /:goalId - Update goal status/details
router.put('/:goalId', async (req, res) => {
  try {
    const { goalId } = req.params;
    const { title, description, dueDate, status } = req.body;
    if (!goalId) return res.status(400).json({ error: "goalId is required" });

    const { goal, membership } = await getGoalAndMembership(goalId, req.user.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    if (!membership) return res.status(403).json({ error: "Access denied." });

    // Only Owner or Admin can update
    if (goal.ownerId !== req.user.id && membership.role !== 'ADMIN') {
      return res.status(403).json({ error: "Only the owner or an admin can update this goal" });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status
      }
    });

    // Log Activity
    logActivity({
      action: "UPDATED_GOAL",
      entity: "Goal",
      entityId: goalId,
      workspaceId: goal.workspaceId,
      userId: req.user.id,
      details: { title: updatedGoal.title, status: updatedGoal.status }
    });

    res.status(200).json({ message: "Goal updated", goal: updatedGoal });
  } catch (error) {
    res.status(500).json({ error: "Failed to update goal" });
  }
});

// DELETE /:goalId - Delete goal
router.delete('/:goalId', async (req, res) => {
  try {
    const { goalId } = req.params;
    if (!goalId) return res.status(400).json({ error: "goalId is required" });

    const { goal, membership } = await getGoalAndMembership(goalId, req.user.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    if (!membership) return res.status(403).json({ error: "Access denied." });

    if (goal.ownerId !== req.user.id && membership.role !== 'ADMIN') {
      return res.status(403).json({ error: "Only the owner or an admin can delete this goal" });
    }

    await prisma.goal.delete({ where: { id: goalId } });

    // Log Activity
    logActivity({
      action: "DELETED_GOAL",
      entity: "Goal",
      entityId: goalId,
      workspaceId: goal.workspaceId,
      userId: req.user.id,
      details: { title: goal.title }
    });

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete goal" });
  }
});


// ==========================================
// MILESTONES (/api/goals/:goalId/milestones)
// ==========================================

// POST /:goalId/milestones - Create milestone
router.post('/:goalId/milestones', async (req, res) => {
  try {
    const { goalId } = req.params;
    const { title, progress } = req.body;
    
    if (!goalId) return res.status(400).json({ error: "goalId is required" });
    if (!title) return res.status(400).json({ error: "Milestone title is required" });

    const { goal, membership } = await getGoalAndMembership(goalId, req.user.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    if (!membership) return res.status(403).json({ error: "Access denied." });

    if (goal.ownerId !== req.user.id && membership.role !== 'ADMIN') {
      return res.status(403).json({ error: "Only the owner or an admin can manage milestones" });
    }

    const milestone = await prisma.milestone.create({
      data: {
        title,
        progress: progress || 0,
        goalId
      }
    });

    res.status(201).json({ message: "Milestone created", milestone });
  } catch (error) {
    res.status(500).json({ error: "Failed to create milestone" });
  }
});

// PUT /:goalId/milestones/:milestoneId - Update milestone progress
router.put('/:goalId/milestones/:milestoneId', async (req, res) => {
  try {
    const { goalId, milestoneId } = req.params;
    const { title, progress } = req.body;

    const { goal, membership } = await getGoalAndMembership(goalId, req.user.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    if (!membership) return res.status(403).json({ error: "Access denied." });

    if (goal.ownerId !== req.user.id && membership.role !== 'ADMIN') {
      return res.status(403).json({ error: "Only the owner or an admin can manage milestones" });
    }

    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { title, progress }
    });

    res.status(200).json({ message: "Milestone updated", milestone: updatedMilestone });
  } catch (error) {
    res.status(500).json({ error: "Failed to update milestone" });
  }
});

// DELETE /:goalId/milestones/:milestoneId - Delete milestone
router.delete('/:goalId/milestones/:milestoneId', async (req, res) => {
  try {
    const { goalId, milestoneId } = req.params;

    const { goal, membership } = await getGoalAndMembership(goalId, req.user.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    if (!membership) return res.status(403).json({ error: "Access denied." });

    if (goal.ownerId !== req.user.id && membership.role !== 'ADMIN') {
      return res.status(403).json({ error: "Only the owner or an admin can manage milestones" });
    }

    await prisma.milestone.delete({ where: { id: milestoneId } });

    res.status(200).json({ message: "Milestone deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete milestone" });
  }
});

module.exports = router;

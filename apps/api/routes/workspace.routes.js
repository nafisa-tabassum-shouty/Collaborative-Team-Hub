const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middleware/auth.middleware');

// Apply requireAuth middleware to all workspace routes
router.use(requireAuth);

// Helper function to check if user is admin
const checkWorkspaceAdmin = async (workspaceId, userId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
  return membership?.role === 'ADMIN';
};

// Helper function to check if user is a member
const checkWorkspaceMember = async (workspaceId, userId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
  return !!membership;
};

// GET /api/workspaces - List all workspaces for logged-in user
router.get('/', async (req, res) => {
  try {
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: req.user.id
          }
        }
      },
      include: {
        members: {
          where: { userId: req.user.id },
          select: { role: true }
        },
        _count: {
          select: { members: true, goals: true }
        }
      }
    });

    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workspaces" });
  }
});

// POST /api/workspaces - Create a new workspace
router.post('/', async (req, res) => {
  try {
    const { name, description, accentColor } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Workspace name is required" });
    }

    // Create workspace and automatically make creator an ADMIN
    const workspace = await prisma.workspace.create({
      data: {
        name,
        description,
        accentColor,
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

// GET /api/workspaces/:id - Get single workspace
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const isMember = await checkWorkspaceMember(id, req.user.id);
    if (!isMember) {
      return res.status(403).json({ error: "Access denied. You are not a member of this workspace." });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true }
            }
          }
        }
      }
    });

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    res.status(200).json(workspace);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workspace" });
  }
});

// PUT /api/workspaces/:id - Update workspace
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, accentColor } = req.body;

    const isAdmin = await checkWorkspaceAdmin(id, req.user.id);
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied. Only admins can update the workspace." });
    }

    const updatedWorkspace = await prisma.workspace.update({
      where: { id },
      data: { name, description, accentColor }
    });

    res.status(200).json({ message: "Workspace updated successfully", workspace: updatedWorkspace });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Workspace not found" });
    }
    res.status(500).json({ error: "Failed to update workspace" });
  }
});

// DELETE /api/workspaces/:id - Delete workspace
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const isAdmin = await checkWorkspaceAdmin(id, req.user.id);
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied. Only admins can delete the workspace." });
    }

    await prisma.workspace.delete({
      where: { id }
    });

    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Workspace not found" });
    }
    res.status(500).json({ error: "Failed to delete workspace" });
  }
});

// POST /api/workspaces/:id/invite - Invite a member
router.post('/:id/invite', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required to invite" });
    }

    const isAdmin = await checkWorkspaceAdmin(id, req.user.id);
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied. Only admins can invite members." });
    }

    // Find user by email
    const userToInvite = await prisma.user.findUnique({
      where: { email }
    });

    if (!userToInvite) {
      return res.status(404).json({ error: "User with this email not found" });
    }

    // Check if user is already a member
    const existingMembership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: userToInvite.id,
          workspaceId: id
        }
      }
    });

    if (existingMembership) {
      return res.status(400).json({ error: "User is already a member of this workspace" });
    }

    // Add user to workspace
    const newMember = await prisma.workspaceMember.create({
      data: {
        userId: userToInvite.id,
        workspaceId: id,
        role: role === 'ADMIN' ? 'ADMIN' : 'MEMBER'
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true }
        }
      }
    });

    res.status(201).json({ message: "Member invited successfully", member: newMember });
  } catch (error) {
    res.status(500).json({ error: "Failed to invite member" });
  }
});

module.exports = router;

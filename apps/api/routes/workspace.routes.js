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

/**
 * @swagger
 * tags:
 *   name: Workspaces
 *   description: Workspace management and collaboration
 */

/**
 * @swagger
 * /api/workspaces:
 *   get:
 *     summary: List all workspaces for the logged-in user
 *     tags: [Workspaces]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of workspaces fetched successfully
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
 *               accentColor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Workspace created successfully
 */
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

/**
 * @swagger
 * /api/workspaces/{id}:
 *   get:
 *     summary: Get single workspace details
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
 *         description: Workspace details fetched successfully
 *       404:
 *         description: Workspace not found
 *   put:
 *     summary: Update workspace details (Admin only)
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               accentColor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Workspace updated successfully
 *   delete:
 *     summary: Delete workspace (Admin only)
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

const { sendEmailAsync } = require('../utils/email');
const { invitationTemplate } = require('../utils/emailTemplates');

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

    // Get workspace details for the email
    const workspace = await prisma.workspace.findUnique({
      where: { id }
    });

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

    // Send invitation email (Async/Non-blocking)
    const joinUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/workspaces/${id}`;
    const emailData = invitationTemplate(workspace.name, req.user.name, joinUrl);
    sendEmailAsync({
      to: email,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    });

    res.status(201).json({ message: "Member invited successfully", member: newMember });
  } catch (error) {
    res.status(500).json({ error: "Failed to invite member" });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router({ mergeParams: true });
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middleware/auth.middleware');
const { sendEmailAsync } = require('../utils/email');
const { mentionTemplate } = require('../utils/emailTemplates');

router.use(requireAuth);

// Helper: Check workspace membership
const checkWorkspaceMember = async (workspaceId, userId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });
  return membership;
};

// Helper: Get announcement and check workspace access
const getAnnouncementAndMembership = async (announcementId, userId) => {
  const announcement = await prisma.announcement.findUnique({
    where: { id: announcementId },
    select: { workspaceId: true, authorId: true }
  });
  if (!announcement) return { announcement: null, membership: null };

  const membership = await checkWorkspaceMember(announcement.workspaceId, userId);
  return { announcement, membership };
};


// ==========================================
// WORKSPACE ANNOUNCEMENTS (/api/workspaces/:workspaceId/announcements)
// ==========================================

// GET / - Get all announcements for a workspace (sorted: pinned first)
router.get('/', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    if (!workspaceId) return res.status(400).json({ error: "workspaceId is required" });

    const membership = await checkWorkspaceMember(workspaceId, req.user.id);
    if (!membership) return res.status(403).json({ error: "Access denied." });

    const announcements = await prisma.announcement.findMany({
      where: { workspaceId },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { comments: true } },
        reactions: {
          select: { emoji: true, userId: true }
        }
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Format reaction summaries (count per emoji)
    const formattedAnnouncements = announcements.map(ann => {
      const reactionSummary = {};
      ann.reactions.forEach(r => {
        if (!reactionSummary[r.emoji]) reactionSummary[r.emoji] = { count: 0, userReacted: false };
        reactionSummary[r.emoji].count += 1;
        if (r.userId === req.user.id) reactionSummary[r.emoji].userReacted = true;
      });

      return { ...ann, reactions: reactionSummary };
    });

    res.status(200).json(formattedAnnouncements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

// POST / - Create announcement (ADMIN only)
router.post('/', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { content, isPinned, attachmentUrl, attachmentType } = req.body;

    if (!workspaceId) return res.status(400).json({ error: "workspaceId is required" });
    if (!content) return res.status(400).json({ error: "Content is required" });

    const membership = await checkWorkspaceMember(workspaceId, req.user.id);
    if (!membership || membership.role !== 'ADMIN') {
      return res.status(403).json({ error: "Only admins can post announcements." });
    }

    const announcement = await prisma.announcement.create({
      data: {
        content,
        isPinned: isPinned || false,
        workspaceId,
        authorId: req.user.id,
        attachmentUrl,
        attachmentType
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } }
      }
    });

    // Real-time Event: Broadcast new announcement to workspace members
    req.io.to(`workspace_${workspaceId}`).emit("announcement:new", announcement);

    // Email Notifications: Detect @mentions and send emails
    const mentions = content.match(/@(\w+)/g);
    if (mentions) {
      const mentionedNames = mentions.map(m => m.substring(1));
      
      const mentionedMembers = await prisma.workspaceMember.findMany({
        where: {
          workspaceId,
          user: {
            name: { in: mentionedNames, mode: 'insensitive' }
          }
        },
        include: { user: { select: { id: true, email: true, name: true } } }
      });

      mentionedMembers.forEach(async (member) => {
        // Don't notify the author themselves
        if (member.user.email !== req.user.email) {
          const contextUrl = `/workspaces/${workspaceId}`;
          
          // Create in-app Notification
          const notification = await prisma.notification.create({
            data: {
              type: "MENTION",
              content: `${req.user.name} mentioned you in an announcement.`,
              link: contextUrl,
              userId: member.user.id,
              actorId: req.user.id
            },
            include: { actor: { select: { name: true, avatarUrl: true } } }
          });

          // Broadcast live notification
          req.io.to(`workspace_${workspaceId}`).emit("notification:new", notification);

          // Send Email
          const fullUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}${contextUrl}`;
          const emailData = mentionTemplate(req.user.name, content, "ANNOUNCEMENT", fullUrl);
          sendEmailAsync({
            to: member.user.email,
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text
          });
        }
      });
    }

    res.status(201).json({ message: "Announcement created", announcement });
  } catch (error) {
    res.status(500).json({ error: "Failed to create announcement" });
  }
});


// ==========================================
// SINGLE ANNOUNCEMENT (/api/announcements/:id)
// ==========================================

// GET /:id - Get single announcement with full comments
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { announcement: checkAnn, membership } = await getAnnouncementAndMembership(id, req.user.id);
    if (!checkAnn) return res.status(404).json({ error: "Announcement not found" });
    if (!membership) return res.status(403).json({ error: "Access denied." });

    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        reactions: { select: { emoji: true, userId: true } },
        comments: {
          include: { author: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' }
        },
        _count: { select: { comments: true } }
      }
    });

    if (!announcement) return res.status(404).json({ error: "Announcement not found" });

    // Format reactions to match the summary format used in the feed
    const reactionSummary = {};
    announcement.reactions.forEach(r => {
      if (!reactionSummary[r.emoji]) reactionSummary[r.emoji] = { count: 0, userReacted: false };
      reactionSummary[r.emoji].count += 1;
      if (r.userId === req.user.id) reactionSummary[r.emoji].userReacted = true;
    });

    res.status(200).json({ ...announcement, reactions: reactionSummary });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch announcement details" });
  }
});

// PUT /:id - Update announcement (ADMIN only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, isPinned } = req.body;

    const { announcement, membership } = await getAnnouncementAndMembership(id, req.user.id);
    if (!announcement) return res.status(404).json({ error: "Announcement not found" });
    if (!membership || membership.role !== 'ADMIN') {
      return res.status(403).json({ error: "Only admins can update announcements." });
    }

    const updated = await prisma.announcement.update({
      where: { id },
      data: { content, isPinned }
    });

    res.status(200).json({ message: "Announcement updated", announcement: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update announcement" });
  }
});

// DELETE /:id - Delete announcement (ADMIN only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { announcement, membership } = await getAnnouncementAndMembership(id, req.user.id);
    if (!announcement) return res.status(404).json({ error: "Announcement not found" });
    if (!membership || membership.role !== 'ADMIN') {
      return res.status(403).json({ error: "Only admins can delete announcements." });
    }

    await prisma.announcement.delete({ where: { id } });

    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete announcement" });
  }
});


// ==========================================
// REACTIONS (/api/announcements/:id/reactions)
// ==========================================

// POST /:id/reactions - Add an emoji reaction
router.post('/:id/reactions', async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body;

    if (!emoji) return res.status(400).json({ error: "Emoji is required" });

    const { announcement, membership } = await getAnnouncementAndMembership(id, req.user.id);
    if (!announcement) return res.status(404).json({ error: "Announcement not found" });
    if (!membership) return res.status(403).json({ error: "Access denied." });

    const reaction = await prisma.reaction.create({
      data: {
        emoji,
        userId: req.user.id,
        announcementId: id
      }
    });

    // Real-time Event: Broadcast reaction update
    req.io.to(`workspace_${announcement.workspaceId}`).emit("reaction:update", {
      announcementId: id,
      action: "add",
      emoji,
      userId: req.user.id
    });

    // Notify author of announcement if someone else reacts
    if (announcement.authorId !== req.user.id) {
      const contextUrl = `/workspaces/${announcement.workspaceId}`;
      const notification = await prisma.notification.create({
        data: {
          type: "REACTION",
          content: `${req.user.name} reacted ${emoji} to your announcement.`,
          link: contextUrl,
          userId: announcement.authorId,
          actorId: req.user.id
        },
        include: { actor: { select: { name: true, avatarUrl: true } } }
      });
      req.io.to(`user_${announcement.authorId}`).emit("notification:new", notification);
    }

    res.status(201).json({ message: "Reaction added", reaction });
  } catch (error) {
    // P2002 means the unique constraint failed (already reacted with this emoji)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "You already reacted with this emoji" });
    }
    res.status(500).json({ error: "Failed to add reaction" });
  }
});

// DELETE /:id/reactions - Remove a specific emoji reaction
router.delete('/:id/reactions', async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body; // Usually DELETE with body is fine in modern APIs, but could also be via query

    if (!emoji) return res.status(400).json({ error: "Emoji is required" });

    const { announcement, membership } = await getAnnouncementAndMembership(id, req.user.id);
    if (!announcement) return res.status(404).json({ error: "Announcement not found" });
    if (!membership) return res.status(403).json({ error: "Access denied." });

    // Use deleteMany to delete matching user + announcement + emoji
    const deleted = await prisma.reaction.deleteMany({
      where: {
        userId: req.user.id,
        announcementId: id,
        emoji: emoji
      }
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "Reaction not found" });
    }

    res.status(200).json({ message: "Reaction removed" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove reaction" });
  }
});


// ==========================================
// COMMENTS (/api/announcements/:id/comments)
// ==========================================

// POST /:id/comments - Add comment
router.post('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, parentId } = req.body;

    if (!content) return res.status(400).json({ error: "Content is required" });

    const { announcement, membership } = await getAnnouncementAndMembership(id, req.user.id);
    if (!announcement) return res.status(404).json({ error: "Announcement not found" });
    if (!membership) return res.status(403).json({ error: "Access denied." });

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: req.user.id,
        announcementId: id,
        parentId: parentId || null
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } }
      }
    });

    // Real-time Event: Broadcast new comment
    req.io.to(`workspace_${announcement.workspaceId}`).emit("comment:new", {
      announcementId: id,
      comment
    });

    // If it's a reply, notify the parent comment's author
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { authorId: true }
      });

      if (parentComment && parentComment.authorId !== req.user.id) {
        const notification = await prisma.notification.create({
          data: {
            type: "COMMENT_REPLY",
            content: `${req.user.name} replied to your comment.`,
            link: `/workspaces/${announcement.workspaceId}`,
            userId: parentComment.authorId,
            actorId: req.user.id
          },
          include: { actor: { select: { name: true, avatarUrl: true } } }
        });
        req.io.to(`user_${parentComment.authorId}`).emit("notification:new", notification);
      }
    }

    // Email Notifications: Detect @mentions and send emails
    const mentions = content.match(/@(\w+)/g);
    if (mentions) {
      const mentionedNames = mentions.map(m => m.substring(1));
      
      const mentionedMembers = await prisma.workspaceMember.findMany({
        where: {
          workspaceId: announcement.workspaceId,
          user: {
            name: { in: mentionedNames, mode: 'insensitive' }
          }
        },
        include: { user: { select: { id: true, email: true, name: true } } }
      });

      mentionedMembers.forEach(async (member) => {
        if (member.user.email !== req.user.email) {
          const contextUrl = `/workspaces/${announcement.workspaceId}`;
          
          // Create in-app Notification
          const notification = await prisma.notification.create({
            data: {
              type: "MENTION",
              content: `${req.user.name} mentioned you in a comment.`,
              link: contextUrl,
              userId: member.user.id,
              actorId: req.user.id
            },
            include: { actor: { select: { name: true, avatarUrl: true } } }
          });

          // Broadcast live notification
          req.io.to(`workspace_${announcement.workspaceId}`).emit("notification:new", notification);

          // Send Email
          const fullUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}${contextUrl}`;
          const emailData = mentionTemplate(req.user.name, content, "COMMENT", fullUrl);
          sendEmailAsync({
            to: member.user.email,
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text
          });
        }
      });
    }

    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// PUT /:id/comments/:commentId - Edit comment (Owner only)
router.put('/:id/comments/:commentId', async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { content } = req.body;

    if (!content) return res.status(400).json({ error: "Content is required" });

    const { announcement, membership } = await getAnnouncementAndMembership(id, req.user.id);
    if (!announcement) return res.status(404).json({ error: "Announcement not found" });
    if (!membership) return res.status(403).json({ error: "Access denied." });

    const existingComment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!existingComment) return res.status(404).json({ error: "Comment not found" });

    if (existingComment.authorId !== req.user.id) {
      return res.status(403).json({ error: "You can only edit your own comments" });
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content }
    });

    res.status(200).json({ message: "Comment updated", comment: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update comment" });
  }
});

// DELETE /:id/comments/:commentId - Delete comment (Owner or Admin)
router.delete('/:id/comments/:commentId', async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const { announcement, membership } = await getAnnouncementAndMembership(id, req.user.id);
    if (!announcement) return res.status(404).json({ error: "Announcement not found" });
    if (!membership) return res.status(403).json({ error: "Access denied." });

    const existingComment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!existingComment) return res.status(404).json({ error: "Comment not found" });

    const isOwner = existingComment.authorId === req.user.id;
    const isAdmin = membership.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Only the author or an admin can delete this comment" });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

module.exports = router;

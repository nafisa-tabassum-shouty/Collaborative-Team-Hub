const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const cloudinary = require('../lib/cloudinary');
const fs = require('fs');

router.use(requireAuth);

// GET current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// UPDATE profile (including avatar)
router.put('/profile', upload.single('avatar'), async (req, res) => {
  try {
    const { name, avatarUrl: bodyAvatarUrl } = req.body;
    let avatarUrl = bodyAvatarUrl || undefined;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'avatars',
        transformation: [{ width: 200, height: 200, crop: 'fill' }]
      });
      avatarUrl = result.secure_url;
      // Delete temporary file
      fs.unlinkSync(req.file.path);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        ...(avatarUrl && { avatarUrl })
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true
      }
    });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Upload Error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Generic file upload for attachments
router.post('/upload-attachment', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'attachments',
      resource_type: 'auto'
    });

    fs.unlinkSync(req.file.path);

    res.json({
      url: result.secure_url,
      originalName: req.file.originalname,
      format: result.format,
      size: result.bytes
    });
  } catch (error) {
    console.error('Attachment Upload Error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to upload attachment' });
  }
});

module.exports = router;

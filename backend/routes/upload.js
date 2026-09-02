const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const upload = require('../utils/upload');
const cloudinary = require('../utils/cloudinary');
const { protect } = require('../middleware/auth');

// Upload single image (protected)
router.post('/', protect, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(503).json({ message: 'Image storage is not configured. Please add the Cloudinary environment variables.' });
    }

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'casa-misu/menu',
        resource_type: 'image',
      });

      return res.json({
        success: true,
        imageUrl: result.secure_url,
        filename: result.public_id,
      });
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return res.status(500).json({ message: 'Image upload failed. Please try again.' });
    } finally {
      await fs.unlink(req.file.path).catch(() => {});
    }
  });
});

module.exports = router;

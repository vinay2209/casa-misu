const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { protect } = require('../middleware/auth');

// Upload single image (protected)
router.post('/', protect, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      imageUrl,
      filename: req.file.filename
    });
  });
});

module.exports = router;

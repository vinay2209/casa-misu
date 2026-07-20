const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const GalleryImage = require('../models/GalleryImage');
const { protect } = require('../middleware/auth');

function optionalAdmin(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.isAdmin = false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    req.isAdmin = true;
  } catch {
    req.isAdmin = false;
  }
  next();
}

// GET /api/gallery — public (visible only); admin token returns all
router.get('/', optionalAdmin, async (req, res) => {
  try {
    const query = req.isAdmin ? {} : { isVisible: true };
    const images = await GalleryImage.find(query).sort({ order: 1, createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/gallery — protected
router.post('/', protect, async (req, res) => {
  try {
    const { title, imageUrl, category, order } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: 'imageUrl is required' });
    }
    const image = new GalleryImage({ title, imageUrl, category, order });
    const saved = await image.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/gallery/:id — protected
router.patch('/:id', protect, async (req, res) => {
  try {
    const { isVisible, order, title, category } = req.body;
    const updates = {};
    if (typeof isVisible === 'boolean') updates.isVisible = isVisible;
    if (typeof order === 'number') updates.order = order;
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;

    const updated = await GalleryImage.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Image not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/gallery/:id — protected
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Image not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

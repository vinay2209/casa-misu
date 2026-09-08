const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const Settings = require('../models/Settings');
const { protect } = require('../middleware/auth');

// Attaches a `discountPercent` to each item — 0 unless the site-wide sale
// is on or the item itself is individually on sale, in which case it's
// the shared sale percentage. Computed here, once, so every page that
// reads /api/menu shows the same price without duplicating this logic.
async function withDiscount(items) {
  const settings = await Settings.findOne();
  const pct = settings?.saleActive ? Number(settings.saleDiscountPercent) || 0 : 0;
  return items.map((item) => {
    const obj = item.toObject ? item.toObject() : item;
    const discountPercent = pct > 0 ? pct : (item.onSale ? Number(settings?.saleDiscountPercent) || 0 : 0);
    return { ...obj, discountPercent };
  });
}

// GET /api/menu
router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    const category = req.query.category;
    const query = category ? { category } : {};
    const items = await MenuItem.find(query).sort({ createdAt: -1 });
    res.json(await withDiscount(items));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/menu/featured
router.get('/featured', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    const items = await MenuItem.find({ isFeatured: true });
    res.json(await withDiscount(items));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/menu (protected)
router.post('/', protect, async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    const saved = await item.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/menu/:id (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/menu/:id (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/menu/:id/availability (protected)
router.patch('/:id/availability', protect, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

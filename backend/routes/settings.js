const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect } = require('../middleware/auth');
const { STORE_ADDRESS } = require('../utils/store');

async function getOrCreateSettings() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({ pickupAddresses: [STORE_ADDRESS], acceptingOrders: true });
  }
  return settings;
}

// GET /api/settings — public; the checkout page needs pickup addresses and
// the accepting-orders switch before a customer can pay.
router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/settings (protected)
router.put('/', protect, async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    if (Array.isArray(req.body.pickupAddresses)) {
      settings.pickupAddresses = req.body.pickupAddresses
        .filter((a) => typeof a === 'string' && a.trim())
        .map((a) => a.trim());
    }
    if (typeof req.body.acceptingOrders === 'boolean') {
      settings.acceptingOrders = req.body.acceptingOrders;
    }
    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

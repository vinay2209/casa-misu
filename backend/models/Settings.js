const mongoose = require('mongoose');

// Singleton document — always the first (and only) one in this collection.
const SettingsSchema = new mongoose.Schema({
  pickupAddresses: { type: [String], default: [] },
  acceptingOrders: { type: Boolean, default: true },
});

module.exports = mongoose.model('Settings', SettingsSchema);

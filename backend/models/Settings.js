const mongoose = require('mongoose');

// Singleton document — always the first (and only) one in this collection.
const SettingsSchema = new mongoose.Schema({
  pickupAddresses: { type: [String], default: [] },
  acceptingOrders: { type: Boolean, default: true },
  // Shown to customers (in the cart drawer and at checkout) whenever
  // acceptingOrders is false. Falls back to a default message on the
  // frontend if left blank.
  pausedMessage: { type: String, default: '' },
});

module.exports = mongoose.model('Settings', SettingsSchema);

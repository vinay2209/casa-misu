const mongoose = require('mongoose');

// Singleton document — always the first (and only) one in this collection.
const SettingsSchema = new mongoose.Schema({
  pickupAddresses: { type: [String], default: [] },
  acceptingOrders: { type: Boolean, default: true },
  // Shown to customers (in the cart drawer and at checkout) whenever
  // acceptingOrders is false. Falls back to a default message on the
  // frontend if left blank.
  pausedMessage: { type: String, default: '' },
  // Flat site-wide sale — when active, every product's price (not
  // delivery fee, not the cake-topper add-on) is discounted by this
  // percent. A product can also be put on sale individually via its own
  // onSale flag, using this same percentage, independent of this switch.
  saleActive: { type: Boolean, default: false },
  saleDiscountPercent: { type: Number, default: 0 },
  // Specific dates (YYYY-MM-DD) the admin has marked as unavailable for
  // scheduled orders — e.g. a day she already knows she can't fulfill.
  // Excluded from the date picker at checkout.
  blockedDates: { type: [String], default: [] },
});

module.exports = mongoose.model('Settings', SettingsSchema);

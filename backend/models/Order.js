const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String },
  items: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  specialRequests: { type: String },
  status: { type: String, enum: ['pending','confirmed','delivered','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  totalAmount: { type: Number }
});

module.exports = mongoose.model('Order', OrderSchema);

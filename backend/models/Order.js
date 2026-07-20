const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String },
  items: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  specialRequests: { type: String },
  deliveryType: { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
  address: { type: String },
  status: { type: String, enum: ['pending','confirmed','delivered','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  totalAmount: { type: Number },
  deliveryDate: { type: Date },
  deliveryTimeSlot: { type: String },
  orderType: { type: String, enum: ['asap','scheduled'], default: 'asap' },
  transactionId: { type: String },
  paymentStatus: { type: String, enum: ['pending','verified','failed'], default: 'pending' },
  paymentMethod: { type: String, default: 'UPI' }
});

module.exports = mongoose.model('Order', OrderSchema);

const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['tiramisu','cookies','desserts','gifting'], required: true },
  description: { type: String },
  price: { type: Number, required: true },
  // Each product can have one or more purchasable sizes/weights. `price`
  // remains for backwards compatibility with existing menu items.
  options: [{
    label: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  dietaryOptions: [{ type: String }],
  messageOnCake: { type: Boolean, default: true },
  ingredients: { type: String },
  shelfLife: { type: String },
  image: { type: String },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);

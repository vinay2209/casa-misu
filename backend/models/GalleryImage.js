const mongoose = require('mongoose');

const GalleryImageSchema = new mongoose.Schema({
  title: { type: String },
  imageUrl: { type: String, required: true },
  category: {
    type: String,
    enum: ['tiramisu', 'cookies', 'desserts', 'gifting', 'all'],
    default: 'all',
  },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('GalleryImage', GalleryImageSchema);

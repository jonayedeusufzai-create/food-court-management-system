const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  stall: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stall',
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    default: 0
  },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
menuItemSchema.index({ stall: 1 });
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isActive: 1 });
menuItemSchema.index({ name: 1 });
menuItemSchema.index({ price: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
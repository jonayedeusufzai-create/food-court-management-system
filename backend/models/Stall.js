const mongoose = require('mongoose');

const stallSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  rent: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  averageRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
stallSchema.index({ owner: 1 });
stallSchema.index({ category: 1 });
stallSchema.index({ isActive: 1 });
stallSchema.index({ name: 1 });
stallSchema.index({ averageRating: -1 }); // Index for sorting by rating

module.exports = mongoose.model('Stall', stallSchema);
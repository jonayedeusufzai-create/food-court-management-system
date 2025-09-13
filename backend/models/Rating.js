const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stall: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stall',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Ensure a user can only rate a stall once
ratingSchema.index({ user: 1, stall: 1 }, { unique: true });

// Create indexes for better query performance
ratingSchema.index({ stall: 1 });
ratingSchema.index({ rating: 1 });

module.exports = mongoose.model('Rating', ratingSchema);
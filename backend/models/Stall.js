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
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String // URL to stall image
  },
  location: {
    type: String,
    trim: true
  },
  contactInfo: {
    phone: String,
    email: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Stall', stallSchema);
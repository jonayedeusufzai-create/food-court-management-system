const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  metric: {
    type: String,
    required: true,
    enum: ['sales-trend', 'order-volume', 'customer-behavior', 'stall-performance']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema);
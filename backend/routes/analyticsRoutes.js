const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

// All analytics routes require authentication and admin access
router.route('/sales-trends')
  .get(protect, admin, analyticsController.getSalesTrends);

router.route('/order-volume')
  .get(protect, admin, analyticsController.getOrderVolume);

router.route('/stall-performance')
  .get(protect, admin, analyticsController.getStallPerformance);

module.exports = router;
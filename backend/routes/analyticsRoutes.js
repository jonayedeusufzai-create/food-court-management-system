const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getRecentOrders,
  getTopStalls,
  getSalesTrends
} = require('../controllers/analyticsController');

const router = express.Router();

// All routes require authentication and admin access
router.route('/dashboard-stats').get(protect, admin, getDashboardStats);
router.route('/recent-orders').get(protect, admin, getRecentOrders);
router.route('/top-stalls').get(protect, admin, getTopStalls);
router.route('/sales-trends').get(protect, admin, getSalesTrends);

module.exports = router;
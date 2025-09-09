const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

// All report routes require authentication and admin access
router.route('/')
  .get(protect, admin, reportController.getReports);

router.route('/:id')
  .get(protect, admin, reportController.getReportById);

router.route('/sales')
  .get(protect, admin, reportController.generateSalesReport);

router.route('/performance')
  .get(protect, admin, reportController.generatePerformanceReport);

router.route('/stall-ranking')
  .get(protect, admin, reportController.generateStallRankingReport);

module.exports = router;
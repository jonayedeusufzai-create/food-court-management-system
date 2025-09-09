const express = require('express');
const {
  processPayment,
  getPaymentByOrder,
  getPaymentById
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, processPayment);

router.route('/order/:orderId')
  .get(protect, getPaymentByOrder);

router.route('/:id')
  .get(protect, getPaymentById);

module.exports = router;
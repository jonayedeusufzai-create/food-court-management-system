const express = require('express');
const {
  getOrders,
  getOrderById,
  getOrdersByCustomer,
  getOrdersByStall,
  createOrder,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, admin, getOrders)
  .post(protect, createOrder);

router.route('/myorders')
  .get(protect, getOrdersByCustomer);

router.route('/stall/:stallId')
  .get(protect, getOrdersByStall);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, updateOrderStatus);

module.exports = router;
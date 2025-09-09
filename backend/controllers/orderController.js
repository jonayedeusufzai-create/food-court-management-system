const Order = require('../models/Order');
const { body, validationResult } = require('express-validator');
const { io, connectedUsers } = require('../server');

// Validation middleware for creating orders
const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must have at least one item'),
  body('items.*.name')
    .notEmpty()
    .withMessage('Item name is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Item quantity must be at least 1'),
  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Item price must be a positive number'),
  body('totalAmount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  body('deliveryAddress')
    .isObject()
    .withMessage('Delivery address is required'),
  body('deliveryAddress.street')
    .notEmpty()
    .withMessage('Street address is required'),
  body('deliveryAddress.city')
    .notEmpty()
    .withMessage('City is required')
];

// Validation middleware for updating order status
const validateOrderStatus = [
  body('status')
    .isIn(['Pending', 'Preparing', 'Ready', 'Delivered', 'Completed', 'Cancelled'])
    .withMessage('Invalid order status')
];

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = [
  validateOrder,
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { items, totalAmount, deliveryAddress } = req.body;
      
      // Create order
      const order = await Order.create({
        customer: req.user._id,
        items,
        totalAmount,
        deliveryAddress
      });
      
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer', 'name email').sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name email');
    
    if (order) {
      // Check if user is authorized to view this order
      if (order.customer.toString() !== req.user._id.toString() && req.user.role !== 'FoodCourtOwner') {
        return res.status(401).json({ message: 'Not authorized to view this order' });
      }
      
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = [
  validateOrderStatus,
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { status } = req.body;
      
      const order = await Order.findById(req.params.id).populate('customer', 'name email');
      
      if (order) {
        // Check if user is authorized to update this order
        if (req.user.role !== 'FoodCourtOwner' && req.user.role !== 'StallOwner') {
          return res.status(401).json({ message: 'Not authorized to update this order' });
        }
        
        order.status = status;
        const updatedOrder = await order.save();
        
        // Emit real-time event for order status update
        const orderData = {
          orderId: updatedOrder._id,
          status: updatedOrder.status,
          userId: updatedOrder.customer._id
        };
        
        // Emit to all connected clients
        io.emit('order_status_updated', orderData);
        
        // Also emit to specific user if connected
        if (connectedUsers.has(updatedOrder.customer._id.toString())) {
          const userSocketId = connectedUsers.get(updatedOrder.customer._id.toString());
          io.to(userSocketId).emit('order_status_updated', orderData);
        }
        
        res.json(updatedOrder);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

// @desc    Get orders by customer
// @route   GET /api/orders/customer/:customerId
// @access  Private
const getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.customerId }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders by stall
// @route   GET /api/orders/stall/:stallId
// @access  Private
const getOrdersByStall = async (req, res) => {
  try {
    // This would require updating the Order model to include stall information
    // For now, we'll return all orders
    const orders = await Order.find().sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByCustomer,
  getOrdersByStall
};
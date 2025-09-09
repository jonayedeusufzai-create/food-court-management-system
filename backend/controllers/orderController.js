const Order = require('../models/Order');
const { io, connectedUsers } = require('../server');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress } = req.body;
    
    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must have items' });
    }
    
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
};

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
const updateOrderStatus = async (req, res) => {
  try {
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
};

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
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');
const Stall = require('../models/Stall');
const Payment = require('../models/Payment');

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate({
        path: 'items.menuItem',
        select: 'name'
      })
      .populate({
        path: 'items.stall',
        select: 'name'
      })
      .sort({ createdAt: -1 });

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
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate({
        path: 'items.menuItem',
        select: 'name'
      })
      .populate({
        path: 'items.stall',
        select: 'name'
      });

    if (order) {
      // Check if user is owner of order or admin
      if (order.user._id.toString() !== req.user._id.toString() && 
          req.user.role !== 'FoodCourtOwner' && 
          req.user.role !== 'StallOwner') {
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

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: 'items.menuItem',
        select: 'name'
      })
      .populate({
        path: 'items.stall',
        select: 'name'
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders by stall
// @route   GET /api/orders/stall/:stallId
// @access  Private/StallOwner
const getOrdersByStall = async (req, res) => {
  try {
    // Check if stall exists and user is owner
    const stall = await Stall.findById(req.params.stallId);
    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    if (stall.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view orders for this stall' });
    }

    // Find orders that contain items from this stall
    const orders = await Order.find({
      'items.stall': req.params.stallId
    })
    .populate('user', 'name email')
    .populate({
      path: 'items.menuItem',
      select: 'name'
    })
    .populate({
      path: 'items.stall',
      select: 'name'
    })
    .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { paymentMethod, deliveryAddress, orderNotes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const menuItem = item.menuItem;
      
      // Check if menu item is active
      if (!menuItem.isActive) {
        return res.status(400).json({ 
          message: `Menu item ${menuItem.name} is no longer available` 
        });
      }

      // Check stock
      if (menuItem.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${menuItem.name}` 
        });
      }

      // Add to order items
      orderItems.push({
        menuItem: menuItem._id,
        stall: menuItem.stall,
        quantity: item.quantity,
        price: menuItem.price
      });

      totalAmount += item.quantity * menuItem.price;
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      orderNotes
    });

    const createdOrder = await order.save();

    // Update menu item stock
    for (const item of cart.items) {
      await MenuItem.findByIdAndUpdate(
        item.menuItem._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    // Populate order details
    const populatedOrder = await Order.findById(createdOrder._id)
      .populate('user', 'name email')
      .populate({
        path: 'items.menuItem',
        select: 'name'
      })
      .populate({
        path: 'items.stall',
        select: 'name'
      });

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/StallOwner
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is owner of any stall in the order
    const stallIds = order.items.map(item => item.stall.toString());
    const stalls = await Stall.find({
      _id: { $in: stallIds },
      owner: req.user._id
    });

    if (stalls.length === 0 && req.user.role !== 'FoodCourtOwner') {
      return res.status(401).json({ message: 'Not authorized to update this order' });
    }

    // Validate status transition
    const validStatusTransitions = {
      'Pending': ['Preparing'],
      'Preparing': ['Ready for Pickup'],
      'Ready for Pickup': ['Completed'],
      'Completed': [],
      'Cancelled': []
    };

    if (!validStatusTransitions[order.status].includes(status) && 
        status !== 'Cancelled' && 
        req.user.role !== 'FoodCourtOwner') {
      return res.status(400).json({ 
        message: `Cannot change status from ${order.status} to ${status}` 
      });
    }

    order.status = status;
    const updatedOrder = await order.save();

    // Populate order details
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate('user', 'name email')
      .populate({
        path: 'items.menuItem',
        select: 'name'
      })
      .populate({
        path: 'items.stall',
        select: 'name'
      });

    res.json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  getMyOrders,
  getOrdersByStall,
  createOrder,
  updateOrderStatus
};
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// @desc    Process payment
// @route   POST /api/payments
// @access  Private
const processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, transactionId, paymentGatewayResponse } = req.body;

    // Validate order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is owner of order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to pay for this order' });
    }

    // Check if order is already paid
    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    // Create payment record
    const payment = new Payment({
      order: orderId,
      user: req.user._id,
      amount: order.totalAmount,
      paymentMethod,
      transactionId,
      paymentGatewayResponse,
      status: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Completed'
    });

    const createdPayment = await payment.save();

    // Update order payment status
    order.paymentStatus = paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery' : 'Paid';
    await order.save();

    // Populate payment details
    const populatedPayment = await Payment.findById(createdPayment._id)
      .populate('order')
      .populate('user', 'name email');

    res.status(201).json(populatedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment by order ID
// @route   GET /api/payments/order/:orderId
// @access  Private
const getPaymentByOrder = async (req, res) => {
  try {
    const payment = await Payment.findOne({ order: req.params.orderId })
      .populate('order')
      .populate('user', 'name email');

    if (payment) {
      // Check if user is owner of payment or admin
      if (payment.user._id.toString() !== req.user._id.toString() && 
          req.user.role !== 'FoodCourtOwner') {
        return res.status(401).json({ message: 'Not authorized to view this payment' });
      }

      res.json(payment);
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('order')
      .populate('user', 'name email');

    if (payment) {
      // Check if user is owner of payment or admin
      if (payment.user._id.toString() !== req.user._id.toString() && 
          req.user.role !== 'FoodCourtOwner') {
        return res.status(401).json({ message: 'Not authorized to view this payment' });
      }

      res.json(payment);
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  processPayment,
  getPaymentByOrder,
  getPaymentById
};
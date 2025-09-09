const Analytics = require('../models/Analytics');
const Order = require('../models/Order');
const Stall = require('../models/Stall');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard-stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalStalls = await Stall.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue from completed orders
    const completedOrders = await Order.find({ status: 'Completed' });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Get pending orders count
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    
    res.json({
      totalStalls,
      totalOrders,
      totalRevenue,
      pendingOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent orders
// @route   GET /api/analytics/recent-orders
// @access  Private/Admin
const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name')
      .sort('-createdAt')
      .limit(10);
    
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: `ORD-${order._id.toString().substr(-3)}`,
      customer: order.customer.name,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt
    }));
    
    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top performing stalls
// @route   GET /api/analytics/top-stalls
// @access  Private/Admin
const getTopStalls = async (req, res) => {
  try {
    // This is a simplified implementation
    // In a real application, you would calculate based on actual order data
    const stalls = await Stall.find().limit(5);
    
    const topStalls = stalls.map((stall, index) => ({
      _id: stall._id,
      name: stall.name,
      revenue: Math.floor(Math.random() * 1000) + 500, // Mock revenue
      orders: Math.floor(Math.random() * 50) + 10 // Mock order count
    }));
    
    // Sort by revenue descending
    topStalls.sort((a, b) => b.revenue - a.revenue);
    
    res.json(topStalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sales trends
// @route   GET /api/analytics/sales-trends
// @access  Private/Admin
const getSalesTrends = async (req, res) => {
  try {
    // Get orders from last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const orders = await Order.find({
      createdAt: { $gte: oneWeekAgo },
      status: 'Completed'
    });
    
    // Group by day
    const salesByDay = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!salesByDay[date]) {
        salesByDay[date] = 0;
      }
      salesByDay[date] += order.totalAmount;
    });
    
    // Format for chart
    const chartData = Object.keys(salesByDay).map(date => ({
      date,
      revenue: salesByDay[date]
    }));
    
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getRecentOrders,
  getTopStalls,
  getSalesTrends
};
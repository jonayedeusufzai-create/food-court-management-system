const Analytics = require('../models/Analytics');
const Order = require('../models/Order');
const Stall = require('../models/Stall');
const asyncHandler = require('express-async-handler');

// @desc    Get sales trends
// @route   GET /api/analytics/sales-trends
// @access  Private/Admin
const getSalesTrends = asyncHandler(async (req, res) => {
  try {
    const { period = 'monthly', limit = 12 } = req.query;
    
    // Calculate date range based on period
    const endDate = new Date();
    let startDate;
    
    switch (period) {
      case 'daily':
        startDate = new Date(endDate.getTime() - (limit * 24 * 60 * 60 * 1000));
        break;
      case 'weekly':
        startDate = new Date(endDate.getTime() - (limit * 7 * 24 * 60 * 60 * 1000));
        break;
      case 'monthly':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - limit, 1);
        break;
      case 'yearly':
        startDate = new Date(endDate.getFullYear() - limit, 0, 1);
        break;
      default:
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 12, 1);
    }
    
    // Fetch orders within date range
    const orders = await Order.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      },
      status: 'Completed'
    });
    
    // Group sales by period
    const salesData = {};
    
    orders.forEach(order => {
      let key;
      
      switch (period) {
        case 'daily':
          key = order.createdAt.toISOString().split('T')[0];
          break;
        case 'weekly':
          // Get week number
          const week = Math.ceil(order.createdAt.getDate() / 7);
          key = `${order.createdAt.getFullYear()}-W${week}`;
          break;
        case 'monthly':
          key = `${order.createdAt.getFullYear()}-${(order.createdAt.getMonth() + 1).toString().padStart(2, '0')}`;
          break;
        case 'yearly':
          key = order.createdAt.getFullYear().toString();
          break;
        default:
          key = order.createdAt.toISOString().split('T')[0];
      }
      
      if (!salesData[key]) {
        salesData[key] = 0;
      }
      
      salesData[key] += order.totalAmount;
    });
    
    // Convert to array format for charting
    const chartData = Object.entries(salesData).map(([date, amount]) => ({
      date,
      amount
    }));
    
    // Sort by date
    chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Save analytics data
    const analytics = await Analytics.create({
      metric: 'sales-trend',
      data: chartData,
      period,
      date: new Date()
    });
    
    res.status(200).json({
      success: true,
      data: {
        chartData,
        period,
        startDate,
        endDate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sales trends',
      error: error.message
    });
  }
});

// @desc    Get order volume analytics
// @route   GET /api/analytics/order-volume
// @access  Private/Admin
const getOrderVolume = asyncHandler(async (req, res) => {
  try {
    const { period = 'monthly', limit = 12 } = req.query;
    
    // Calculate date range based on period
    const endDate = new Date();
    let startDate;
    
    switch (period) {
      case 'daily':
        startDate = new Date(endDate.getTime() - (limit * 24 * 60 * 60 * 1000));
        break;
      case 'weekly':
        startDate = new Date(endDate.getTime() - (limit * 7 * 24 * 60 * 60 * 1000));
        break;
      case 'monthly':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - limit, 1);
        break;
      case 'yearly':
        startDate = new Date(endDate.getFullYear() - limit, 0, 1);
        break;
      default:
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 12, 1);
    }
    
    // Fetch orders within date range
    const orders = await Order.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // Group orders by status and period
    const orderData = {};
    
    orders.forEach(order => {
      let key;
      
      switch (period) {
        case 'daily':
          key = order.createdAt.toISOString().split('T')[0];
          break;
        case 'weekly':
          // Get week number
          const week = Math.ceil(order.createdAt.getDate() / 7);
          key = `${order.createdAt.getFullYear()}-W${week}`;
          break;
        case 'monthly':
          key = `${order.createdAt.getFullYear()}-${(order.createdAt.getMonth() + 1).toString().padStart(2, '0')}`;
          break;
        case 'yearly':
          key = order.createdAt.getFullYear().toString();
          break;
        default:
          key = order.createdAt.toISOString().split('T')[0];
      }
      
      if (!orderData[key]) {
        orderData[key] = {
          Pending: 0,
          Preparing: 0,
          Ready: 0,
          Delivered: 0,
          Completed: 0,
          Cancelled: 0
        };
      }
      
      orderData[key][order.status]++;
    });
    
    // Convert to array format for charting
    const chartData = Object.entries(orderData).map(([date, statuses]) => ({
      date,
      ...statuses
    }));
    
    // Sort by date
    chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Save analytics data
    const analytics = await Analytics.create({
      metric: 'order-volume',
      data: chartData,
      period,
      date: new Date()
    });
    
    res.status(200).json({
      success: true,
      data: {
        chartData,
        period,
        startDate,
        endDate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order volume data',
      error: error.message
    });
  }
});

// @desc    Get stall performance analytics
// @route   GET /api/analytics/stall-performance
// @access  Private/Admin
const getStallPerformance = asyncHandler(async (req, res) => {
  try {
    // Fetch all stalls
    const stalls = await Stall.find({});
    
    // Fetch recent orders (last 30 days)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const orders = await Order.find({
      createdAt: {
        $gte: startDate
      },
      status: 'Completed'
    }).populate('items.stall', 'name');
    
    // Calculate performance metrics for each stall
    const stallPerformance = {};
    
    stalls.forEach(stall => {
      stallPerformance[stall._id] = {
        name: stall.name,
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0
      };
    });
    
    // Aggregate order data
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.stall && stallPerformance[item.stall._id]) {
          const revenue = item.quantity * item.price;
          stallPerformance[item.stall._id].totalRevenue += revenue;
          stallPerformance[item.stall._id].totalOrders += 1;
        }
      });
    });
    
    // Calculate average order value
    Object.values(stallPerformance).forEach(stall => {
      if (stall.totalOrders > 0) {
        stall.avgOrderValue = stall.totalRevenue / stall.totalOrders;
      }
    });
    
    // Convert to array and sort by revenue
    const performanceData = Object.values(stallPerformance)
      .filter(stall => stall.totalOrders > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
    
    // Save analytics data
    const analytics = await Analytics.create({
      metric: 'stall-performance',
      data: performanceData,
      date: new Date()
    });
    
    res.status(200).json({
      success: true,
      data: performanceData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stall performance data',
      error: error.message
    });
  }
});

module.exports = {
  getSalesTrends,
  getOrderVolume,
  getStallPerformance
};
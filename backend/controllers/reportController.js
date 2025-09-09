const Report = require('../models/Report');
const Order = require('../models/Order');
const Stall = require('../models/Stall');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Generate sales report
// @route   GET /api/reports/sales
// @access  Private/Admin
const generateSalesReport = asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate, stallId } = req.query;
    
    // Build query filters
    let orderQuery = {};
    
    if (startDate && endDate) {
      orderQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (stallId) {
      orderQuery['items.stall'] = stallId;
    }
    
    // Only include completed orders
    orderQuery.status = 'Completed';
    
    // Fetch orders
    const orders = await Order.find(orderQuery).populate('items.stall', 'name');
    
    // Calculate sales data
    let totalSales = 0;
    let totalOrders = orders.length;
    const salesByStall = {};
    const salesByDate = {};
    
    orders.forEach(order => {
      totalSales += order.totalAmount;
      
      // Group by stall
      order.items.forEach(item => {
        const stallName = item.stall ? item.stall.name : 'Unknown Stall';
        if (!salesByStall[stallName]) {
          salesByStall[stallName] = 0;
        }
        salesByStall[stallName] += item.quantity * item.price;
      });
      
      // Group by date
      const date = order.createdAt.toISOString().split('T')[0];
      if (!salesByDate[date]) {
        salesByDate[date] = 0;
      }
      salesByDate[date] += order.totalAmount;
    });
    
    // Create report data
    const reportData = {
      totalSales,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
      salesByStall,
      salesByDate,
      dateRange: {
        startDate,
        endDate
      }
    };
    
    // Save report
    const report = await Report.create({
      type: 'sales',
      title: `Sales Report ${startDate ? `(${startDate} to ${endDate})` : '(All Time)'}`,
      description: 'Sales performance report with revenue by stall and date',
      data: reportData,
      generatedBy: req.user._id,
      dateRange: {
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });
    
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating sales report',
      error: error.message
    });
  }
});

// @desc    Generate performance report
// @route   GET /api/reports/performance
// @access  Private/Admin
const generatePerformanceReport = asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build query filters
    let orderQuery = {};
    
    if (startDate && endDate) {
      orderQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Fetch orders with populated data
    const orders = await Order.find(orderQuery)
      .populate('items.stall', 'name')
      .populate('customer', 'name');
    
    // Calculate performance metrics
    const totalOrders = orders.length;
    const orderStatusCounts = {};
    const avgPreparationTime = 0; // Would need timestamps for each status change
    
    // Count orders by status
    orders.forEach(order => {
      if (!orderStatusCounts[order.status]) {
        orderStatusCounts[order.status] = 0;
      }
      orderStatusCounts[order.status]++;
    });
    
    // Calculate revenue by status
    const revenueByStatus = {};
    orders.forEach(order => {
      if (!revenueByStatus[order.status]) {
        revenueByStatus[order.status] = 0;
      }
      revenueByStatus[order.status] += order.totalAmount;
    });
    
    // Create report data
    const reportData = {
      totalOrders,
      orderStatusCounts,
      revenueByStatus,
      avgPreparationTime,
      dateRange: {
        startDate,
        endDate
      }
    };
    
    // Save report
    const report = await Report.create({
      type: 'performance',
      title: `Performance Report ${startDate ? `(${startDate} to ${endDate})` : '(All Time)'}`,
      description: 'Order performance report with status distribution and revenue',
      data: reportData,
      generatedBy: req.user._id,
      dateRange: {
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });
    
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating performance report',
      error: error.message
    });
  }
});

// @desc    Generate stall ranking report
// @route   GET /api/reports/stall-ranking
// @access  Private/Admin
const generateStallRankingReport = asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build query filters
    let orderQuery = {
      status: 'Completed' // Only completed orders for ranking
    };
    
    if (startDate && endDate) {
      orderQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Fetch orders with populated stall data
    const orders = await Order.find(orderQuery).populate('items.stall', 'name');
    
    // Calculate stall performance metrics
    const stallMetrics = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const stallId = item.stall ? item.stall._id.toString() : 'unknown';
        const stallName = item.stall ? item.stall.name : 'Unknown Stall';
        
        if (!stallMetrics[stallId]) {
          stallMetrics[stallId] = {
            name: stallName,
            totalRevenue: 0,
            totalOrders: 0,
            totalItemsSold: 0
          };
        }
        
        stallMetrics[stallId].totalRevenue += item.quantity * item.price;
        stallMetrics[stallId].totalOrders += 1;
        stallMetrics[stallId].totalItemsSold += item.quantity;
      });
    });
    
    // Convert to array and sort by revenue
    const rankedStalls = Object.values(stallMetrics).sort((a, b) => b.totalRevenue - a.totalRevenue);
    
    // Add ranking
    rankedStalls.forEach((stall, index) => {
      stall.rank = index + 1;
    });
    
    // Create report data
    const reportData = {
      rankedStalls,
      totalStalls: rankedStalls.length,
      dateRange: {
        startDate,
        endDate
      }
    };
    
    // Save report
    const report = await Report.create({
      type: 'stall-ranking',
      title: `Stall Ranking Report ${startDate ? `(${startDate} to ${endDate})` : '(All Time)'}`,
      description: 'Stall performance ranking based on revenue, orders, and items sold',
      data: reportData,
      generatedBy: req.user._id,
      dateRange: {
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });
    
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating stall ranking report',
      error: error.message
    });
  }
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
const getReports = asyncHandler(async (req, res) => {
  try {
    const reports = await Report.find({ generatedBy: req.user._id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message
    });
  }
});

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private/Admin
const getReportById = asyncHandler(async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    
    // Check if user is authorized to view this report
    if (report.generatedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this report'
      });
    }
    
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching report',
      error: error.message
    });
  }
});

module.exports = {
  generateSalesReport,
  generatePerformanceReport,
  generateStallRankingReport,
  getReports,
  getReportById
};
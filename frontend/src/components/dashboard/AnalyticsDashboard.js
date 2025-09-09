import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState({
    salesTrends: [],
    orderVolume: [],
    stallPerformance: []
  });
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('monthly');

  useEffect(() => {
    // TODO: Fetch analytics data from API
    // Mock data for now
    const mockSalesTrends = [
      { date: '2023-01', amount: 1200.50 },
      { date: '2023-02', amount: 1800.75 },
      { date: '2023-03', amount: 1500.25 },
      { date: '2023-04', amount: 2100.00 },
      { date: '2023-05', amount: 2456.78 }
    ];

    const mockOrderVolume = [
      { 
        date: '2023-01', 
        Pending: 5, 
        Preparing: 8, 
        Ready: 3, 
        Delivered: 12, 
        Completed: 10, 
        Cancelled: 2 
      },
      { 
        date: '2023-02', 
        Pending: 3, 
        Preparing: 6, 
        Ready: 4, 
        Delivered: 15, 
        Completed: 14, 
        Cancelled: 1 
      },
      { 
        date: '2023-03', 
        Pending: 7, 
        Preparing: 9, 
        Ready: 5, 
        Delivered: 18, 
        Completed: 16, 
        Cancelled: 3 
      }
    ];

    const mockStallPerformance = [
      { name: 'Burger Palace', totalRevenue: 1250.50, totalOrders: 42, avgOrderValue: 29.77 },
      { name: 'Pizza Corner', totalRevenue: 980.25, totalOrders: 38, avgOrderValue: 25.80 },
      { name: 'Sushi Bar', totalRevenue: 820.75, totalOrders: 29, avgOrderValue: 28.30 },
      { name: 'Indian Spice', totalRevenue: 650.30, totalOrders: 22, avgOrderValue: 29.56 }
    ];

    setTimeout(() => {
      setAnalyticsData({
        salesTrends: mockSalesTrends,
        orderVolume: mockOrderVolume,
        stallPerformance: mockStallPerformance
      });
      setLoading(false);
    }, 1000);
  }, [timePeriod]);

  if (loading) {
    return <div className="analytics-dashboard">Loading analytics...</div>;
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <div className="analytics-controls">
          <select 
            value={timePeriod} 
            onChange={(e) => setTimePeriod(e.target.value)}
            className="period-select"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="analytics-content">
        <div className="chart-section">
          <h2>Sales Trends</h2>
          <div className="chart-container">
            <div className="chart-placeholder">
              {/* In a real implementation, this would be a chart component */}
              <p>Sales Trend Chart Visualization</p>
              <div className="chart-data">
                {analyticsData.salesTrends.map((data, index) => (
                  <div key={index} className="chart-bar">
                    <div 
                      className="bar" 
                      style={{ height: `${(data.amount / 3000) * 100}%` }}
                    ></div>
                    <span className="bar-label">{data.date}</span>
                    <span className="bar-value">${data.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h2>Order Volume by Status</h2>
          <div className="chart-container">
            <div className="chart-placeholder">
              {/* In a real implementation, this would be a chart component */}
              <p>Order Volume Chart Visualization</p>
              <div className="legend">
                <div className="legend-item">
                  <div className="legend-color pending"></div>
                  <span>Pending</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color preparing"></div>
                  <span>Preparing</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color ready"></div>
                  <span>Ready</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color delivered"></div>
                  <span>Delivered</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-section">
          <h2>Stall Performance</h2>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Stall Name</th>
                  <th>Revenue</th>
                  <th>Orders</th>
                  <th>Avg. Order Value</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.stallPerformance.map((stall, index) => (
                  <tr key={index}>
                    <td>{stall.name}</td>
                    <td>${stall.totalRevenue.toFixed(2)}</td>
                    <td>{stall.totalOrders}</td>
                    <td>${stall.avgOrderValue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
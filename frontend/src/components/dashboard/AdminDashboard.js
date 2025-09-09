import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI, orderAPI, stallAPI } from '../../services/api';
import './dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStalls: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [topStalls, setTopStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all dashboard data concurrently
        const [statsResponse, ordersResponse, stallsResponse] = await Promise.all([
          analyticsAPI.getDashboardStats(),
          analyticsAPI.getRecentOrders(),
          analyticsAPI.getTopStalls()
        ]);
        
        setStats(statsResponse.data);
        setRecentOrders(ordersResponse.data);
        setTopStalls(stallsResponse.data);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch dashboard data:', err);
        
        // Fallback to mock data if API fails
        const mockStats = {
          totalStalls: 12,
          totalOrders: 124,
          totalRevenue: 2456.78,
          pendingOrders: 8
        };

        const mockOrders = [
          {
            _id: '1',
            orderNumber: 'ORD-001',
            customer: 'John Doe',
            totalAmount: 24.99,
            status: 'Pending',
            createdAt: '2023-05-15T10:30:00Z'
          },
          {
            _id: '2',
            orderNumber: 'ORD-002',
            customer: 'Jane Smith',
            totalAmount: 18.50,
            status: 'Preparing',
            createdAt: '2023-05-15T09:15:00Z'
          },
          {
            _id: '3',
            orderNumber: 'ORD-003',
            customer: 'Mike Johnson',
            totalAmount: 32.75,
            status: 'Ready',
            createdAt: '2023-05-15T08:45:00Z'
          }
        ];

        const mockStalls = [
          {
            _id: '1',
            name: 'Burger Palace',
            revenue: 1250.50,
            orders: 42
          },
          {
            _id: '2',
            name: 'Pizza Corner',
            revenue: 980.25,
            orders: 38
          },
          {
            _id: '3',
            name: 'Sushi Bar',
            revenue: 820.75,
            orders: 29
          }
        ];

        setStats(mockStats);
        setRecentOrders(mockOrders);
        setTopStalls(mockStalls);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Preparing':
        return 'status-preparing';
      case 'Ready':
        return 'status-ready';
      case 'Delivered':
        return 'status-delivered';
      case 'Completed':
        return 'status-completed';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error">Error loading dashboard: {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's what's happening today.</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Stalls</h3>
          <p className="stat-value">{stats.totalStalls}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-value">{stats.pendingOrders}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/orders/manage" className="view-all-link">View All</Link>
          </div>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customer}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Top Performing Stalls</h2>
            <Link to="/reports" className="view-all-link">View Reports</Link>
          </div>
          <div className="stalls-list">
            {topStalls.map(stall => (
              <div key={stall._id} className="stall-item">
                <div className="stall-info">
                  <h3>{stall.name}</h3>
                  <p>{stall.orders} orders</p>
                </div>
                <div className="stall-revenue">
                  ${stall.revenue.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
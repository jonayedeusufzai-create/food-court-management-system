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
      <div className="admin-dashboard" role="main">
        <div className="loading" aria-live="polite">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard" role="main">
        <div className="error" role="alert">Error loading dashboard: {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" role="main">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's what's happening today.</p>
      </div>

      <div className="dashboard-stats" role="region" aria-label="Dashboard statistics">
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
        <div className="dashboard-section" role="region" aria-labelledby="recent-orders-heading">
          <div className="section-header">
            <h2 id="recent-orders-heading">Recent Orders</h2>
            <Link to="/orders/manage" className="view-all-link">View All</Link>
          </div>
          <div className="orders-table" role="table" aria-label="Recent orders table">
            <div role="rowgroup">
              <div role="row">
                <div role="columnheader">Order #</div>
                <div role="columnheader">Customer</div>
                <div role="columnheader">Amount</div>
                <div role="columnheader">Status</div>
                <div role="columnheader">Date</div>
              </div>
            </div>
            <div role="rowgroup">
              {recentOrders.map(order => (
                <div role="row" key={order._id}>
                  <div role="cell">{order.orderNumber}</div>
                  <div role="cell">{order.customer}</div>
                  <div role="cell">${order.totalAmount.toFixed(2)}</div>
                  <div role="cell">
                    <span className={`status-badge ${getStatusClass(order.status)}`} aria-label={`Status: ${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  <div role="cell">{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-section" role="region" aria-labelledby="top-stalls-heading">
          <div className="section-header">
            <h2 id="top-stalls-heading">Top Performing Stalls</h2>
            <Link to="/reports" className="view-all-link">View Reports</Link>
          </div>
          <div className="stalls-list" role="list">
            {topStalls.map(stall => (
              <div role="listitem" key={stall._id} className="stall-item">
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
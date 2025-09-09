import React from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css';

const StallOwnerDashboard = () => {
  return (
    <div className="dashboard">
      <h1>Stall Owner Dashboard</h1>
      <p>Welcome! Manage your stall and orders from here.</p>
      
      <div className="dashboard-links">
        <Link to="/menu/manage" className="dashboard-link">
          <h3>Menu Management</h3>
          <p>Manage your menu items and pricing</p>
        </Link>
        
        <Link to="/orders/manage" className="dashboard-link">
          <h3>Order Management</h3>
          <p>View and update your incoming orders</p>
        </Link>
        
        <Link to="/stalls/manage" className="dashboard-link">
          <h3>Stall Settings</h3>
          <p>Update your stall information</p>
        </Link>
      </div>
    </div>
  );
};

export default StallOwnerDashboard;
import React from 'react';

const StallOwnerDashboard = () => {
  return (
    <div className="dashboard">
      <h1>Stall Owner Dashboard</h1>
      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Manage Menu</h2>
          <p>Add, edit, or remove food items from your menu</p>
        </div>
        <div className="dashboard-section">
          <h2>Order Management</h2>
          <p>Track and update order statuses in real-time</p>
        </div>
        <div className="dashboard-section">
          <h2>Stock Management</h2>
          <p>Monitor and update inventory levels</p>
        </div>
        <div className="dashboard-section">
          <h2>Sales Reports</h2>
          <p>View sales data and performance metrics</p>
        </div>
      </div>
    </div>
  );
};

export default StallOwnerDashboard;
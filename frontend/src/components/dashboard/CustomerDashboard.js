import React from 'react';

const CustomerDashboard = () => {
  return (
    <div className="dashboard">
      <h1>Customer Dashboard</h1>
      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Browse Stalls</h2>
          <p>Discover and browse available food stalls</p>
        </div>
        <div className="dashboard-section">
          <h2>View Menus</h2>
          <p>Browse menu items from your favorite stalls</p>
        </div>
        <div className="dashboard-section">
          <h2>Cart</h2>
          <p>Manage your shopping cart</p>
        </div>
        <div className="dashboard-section">
          <h2>Order History</h2>
          <p>View your past orders</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
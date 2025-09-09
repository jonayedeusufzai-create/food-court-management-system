import React from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css';

const FoodCourtOwnerDashboard = () => {
  return (
    <div className="dashboard">
      <h1>Food Court Owner Dashboard</h1>
      <p>Welcome! Manage your food court operations from here.</p>
      
      <div className="dashboard-links">
        <Link to="/stalls/manage" className="dashboard-link">
          <h3>Stall Management</h3>
          <p>View, add, edit, and remove stalls</p>
        </Link>
        
        <Link to="/reports" className="dashboard-link">
          <h3>Reports & Analytics</h3>
          <p>Generate sales and performance reports</p>
        </Link>
        
        <Link to="/analytics" className="dashboard-link">
          <h3>Analytics Dashboard</h3>
          <p>View real-time analytics and insights</p>
        </Link>
      </div>
    </div>
  );
};

export default FoodCourtOwnerDashboard;
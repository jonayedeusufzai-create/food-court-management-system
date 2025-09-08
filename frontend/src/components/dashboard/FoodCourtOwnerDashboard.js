import React from 'react';

const FoodCourtOwnerDashboard = () => {
  return (
    <div className="dashboard">
      <h1>Food Court Owner Dashboard</h1>
      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Manage Stalls</h2>
          <p>Add, edit, or remove stalls from the food court</p>
        </div>
        <div className="dashboard-section">
          <h2>Rent & Bill Management</h2>
          <p>Track rent payments and utility bills</p>
        </div>
        <div className="dashboard-section">
          <h2>Performance Reports</h2>
          <p>Generate sales and performance reports</p>
        </div>
        <div className="dashboard-section">
          <h2>Stall Ranking</h2>
          <p>View ranked performance of all stalls</p>
        </div>
      </div>
    </div>
  );
};

export default FoodCourtOwnerDashboard;
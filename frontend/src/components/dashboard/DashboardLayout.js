import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DashboardLayout = ({ user, children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement logout functionality
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Food Court Management</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>
      
      <nav className="dashboard-nav">
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          {user?.role === 'Customer' && (
            <>
              <li><Link to="/stalls">Browse Stalls</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </>
          )}
          {user?.role === 'StallOwner' && (
            <>
              <li><Link to="/menu">Manage Menu</Link></li>
              <li><Link to="/orders">Order Management</Link></li>
              <li><Link to="/inventory">Inventory</Link></li>
              <li><Link to="/reports">Reports</Link></li>
            </>
          )}
          {(user?.role === 'FoodCourtOwner') && (
            <>
              <li><Link to="/stalls">Manage Stalls</Link></li>
              <li><Link to="/reports">Reports</Link></li>
              <li><Link to="/billing">Rent & Billing</Link></li>
              <li><Link to="/ranking">Stall Ranking</Link></li>
            </>
          )}
        </ul>
      </nav>
      
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
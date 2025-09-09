import React from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css';

const CustomerDashboard = () => {
  return (
    <div className="dashboard">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Amazing Food Options</h1>
          <p>Browse our diverse selection of food stalls and order your favorites with just a few clicks</p>
          <Link to="/stalls" className="btn btn-primary hero-btn">
            Browse Restaurants
          </Link>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>How It Works</h2>
            <p>Ordering food has never been easier</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <span>🍽️</span>
              </div>
              <h3>Browse Menus</h3>
              <p>Explore menus from all our food stalls and discover new favorites</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <span>🛒</span>
              </div>
              <h3>Add to Cart</h3>
              <p>Select your favorite items and add them to your cart</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <span>🚚</span>
              </div>
              <h3>Fast Delivery</h3>
              <p>Get your food delivered quickly to your table</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="container">
          <div className="section-header text-center">
            <h2>Quick Actions</h2>
          </div>
          
          <div className="dashboard-links">
            <Link to="/stalls" className="dashboard-link">
              <div className="link-icon">🏪</div>
              <h3>Browse Stalls</h3>
              <p>Explore all available food stalls</p>
            </Link>
            
            <Link to="/orders" className="dashboard-link">
              <div className="link-icon">📦</div>
              <h3>My Orders</h3>
              <p>View your order history and status</p>
            </Link>
            
            <Link to="/cart" className="dashboard-link">
              <div className="link-icon">🛒</div>
              <h3>My Cart</h3>
              <p>Review and checkout your selected items</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboard;
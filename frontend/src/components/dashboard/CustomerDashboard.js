import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartAPI } from '../../services/api';
import './dashboard.css';

const CustomerDashboard = () => {
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setLoading(false);
    }
  };

  // Calculate VAT (8%) and delivery charge
  const vat = cart.totalAmount * 0.08;
  const deliveryCharge = 2.99;
  const totalBill = cart.totalAmount + vat + deliveryCharge;

  return (
    <div className="dashboard">
      {/* Cart Summary at Top */}
      <div className="dashboard-header">
        <div className="cart-summary-container">
          <div className="cart-icon-container">
            <Link to="/cart" className="cart-icon-link">
              <span className="cart-icon">🛒</span>
              <span className="cart-text">My Cart</span>
              {cart.items.length > 0 && (
                <span className="cart-count">{cart.items.length}</span>
              )}
            </Link>
          </div>
          
          {!loading && cart.items.length > 0 && (
            <div className="cart-summary">
              <div className="cart-items-summary">
                <h3>Your Cart ({cart.items.length} items)</h3>
                <div className="cart-items-list">
                  {cart.items.slice(0, 3).map((item) => (
                    <div key={item._id} className="cart-item-summary">
                      <span className="item-name">{item.menuItem.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                      <span className="item-price">${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                  {cart.items.length > 3 && (
                    <div className="cart-item-summary">
                      <span className="item-name">+ {cart.items.length - 3} more items</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="cart-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>VAT (8%):</span>
                  <span>${vat.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Delivery Charge:</span>
                  <span>${deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total Bill:</span>
                  <span>${totalBill.toFixed(2)}</span>
                </div>
                <Link to="/cart" className="btn btn-primary checkout-btn">
                  Checkout
                </Link>
              </div>
            </div>
          )}
          
          {!loading && cart.items.length === 0 && (
            <div className="empty-cart-message">
              <p>Your cart is empty. Add some delicious items!</p>
              <Link to="/stalls" className="btn btn-primary">
                Browse Restaurants
              </Link>
            </div>
          )}
        </div>
      </div>
      
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
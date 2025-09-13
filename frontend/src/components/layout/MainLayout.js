import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { cartAPI } from '../../services/api';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
    }
  }, [isAuthenticated]);

  const fetchCartCount = async () => {
    try {
      const response = await cartAPI.getCart();
      const items = response.data.items || [];
      const count = items.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      console.error('Failed to fetch cart count:', err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="main-layout">
      {/* Header */}
      <header className="main-header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <h1>The<span>Tree</span>Housse</h1>
            </Link>
            
            <nav className="main-nav">
              {isAuthenticated ? (
                <>
                  <Link to="/stalls">Restaurants</Link>
                  <Link to="/orders">Orders</Link>
                  <Link to="/cart">Cart</Link>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              )}
            </nav>
            
            <div className="user-actions">
              {isAuthenticated ? (
                <div className="user-menu">
                  <span className="user-greeting">Hi, {user?.name}</span>
                  <button className="cart-btn" onClick={() => navigate('/cart')}>
                    🛒 Cart {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
                  </button>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="login-btn">Login</Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="main-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>TheTreeHousse</h3>
              <p>Your one-stop solution for food court management and ordering.</p>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/stalls">Restaurants</Link></li>
                <li><Link to="/orders">My Orders</Link></li>
                <li><Link to="/profile">My Profile</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Contact Us</h4>
              <p>Email: support@thetreehousse.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 TheTreeHousse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
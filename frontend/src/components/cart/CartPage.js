import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartAPI } from '../../services/api';
import './cart.css';

const CartPage = () => {
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch cart');
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      // If quantity is less than 1, remove the item
      removeItem(itemId);
      return;
    }

    try {
      const response = await cartAPI.updateCartItem(itemId, newQuantity);
      setCart(response.data);
    } catch (err) {
      setError(err.message || 'Failed to update item quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await cartAPI.removeFromCart(itemId);
      setCart(response.data);
    } catch (err) {
      setError(err.message || 'Failed to remove item from cart');
    }
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="loading-container">
            <p>Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="error-container">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <Link to="/stalls" className="back-link">← Continue Shopping</Link>
          <h1>Your Cart</h1>
        </div>

        {cart.items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/stalls" className="btn btn-primary continue-shopping-btn">
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-image">
                    <img src={item.menuItem.image} alt={item.menuItem.name} />
                  </div>
                  
                  <div className="item-details">
                    <h3>{item.menuItem.name}</h3>
                    <p className="stall-name">{item.menuItem.stall.name}</p>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="item-controls">
                    <div className="quantity-control">
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      className="remove-btn"
                      onClick={() => removeItem(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="item-total">
                    ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="summary-header">
                <h2>Order Summary</h2>
              </div>
              
              <div className="summary-details">
                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>${cart.totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="summary-item">
                  <span>Tax</span>
                  <span>${(cart.totalAmount * 0.08).toFixed(2)}</span>
                </div>
                
                <div className="summary-item">
                  <span>Delivery Fee</span>
                  <span>$2.99</span>
                </div>
                
                <div className="summary-item total-row">
                  <span>Total</span>
                  <span className="total-amount">${(cart.totalAmount * 1.08 + 2.99).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="summary-actions">
                <button 
                  className="btn btn-primary checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
                
                <Link to="/stalls" className="btn btn-outline continue-shopping-btn">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
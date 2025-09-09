import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    // TODO: Fetch cart from API
    // Mock data for now
    const mockCart = {
      items: [
        {
          _id: '1',
          menuItem: {
            _id: '101',
            name: 'Classic Burger',
            price: 8.99,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1998&q=80',
            stall: {
              _id: '1',
              name: 'Burger Palace'
            }
          },
          quantity: 2,
          price: 8.99
        },
        {
          _id: '2',
          menuItem: {
            _id: '201',
            name: 'Cheese Pizza',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            stall: {
              _id: '2',
              name: 'Pizza Corner'
            }
          },
          quantity: 1,
          price: 12.99
        },
        {
          _id: '3',
          menuItem: {
            _id: '301',
            name: 'French Fries',
            price: 3.99,
            image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            stall: {
              _id: '1',
              name: 'Burger Palace'
            }
          },
          quantity: 1,
          price: 3.99
        }
      ],
      totalAmount: 30.97
    };

    setTimeout(() => {
      setCart(mockCart);
      setLoading(false);
    }, 1000);
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    // TODO: Update cart item quantity via API
    console.log('Updating item quantity:', itemId, newQuantity);
    
    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => 
        item._id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      ).filter(item => item.quantity > 0); // Remove items with quantity 0
      
      const newTotal = updatedItems.reduce(
        (total, item) => total + (item.quantity * item.price),
        0
      );
      
      return {
        ...prevCart,
        items: updatedItems,
        totalAmount: newTotal
      };
    });
  };

  const removeItem = (itemId) => {
    // TODO: Remove item from cart via API
    console.log('Removing item:', itemId);
    
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item._id !== itemId);
      const newTotal = updatedItems.reduce(
        (total, item) => total + (item.quantity * item.price),
        0
      );
      
      return {
        ...prevCart,
        items: updatedItems,
        totalAmount: newTotal
      };
    });
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
        )}
      </div>
    </div>
  );
};

export default CartPage;
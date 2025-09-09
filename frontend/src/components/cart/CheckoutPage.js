import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './cart.css';

const CheckoutPage = () => {
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'credit-card'
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
            stall: {
              _id: '2',
              name: 'Pizza Corner'
            }
          },
          quantity: 1,
          price: 12.99
        }
      ],
      totalAmount: 30.97
    };

    setTimeout(() => {
      setCart(mockCart);
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Process checkout via API
    console.log('Processing checkout:', formData);
    alert('Order placed successfully!');
    navigate('/orders');
  };

  if (loading) {
    return <div className="checkout-page">Loading checkout...</div>;
  }

  if (error) {
    return <div className="checkout-page">Error: {error}</div>;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
      </div>

      <div className="checkout-content">
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Contact Information</h2>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Delivery Address</h2>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="form-group">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={formData.paymentMethod === 'credit-card'}
                    onChange={handleChange}
                  />
                  Credit/Debit Card
                </label>
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleChange}
                  />
                  PayPal
                </label>
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                  />
                  Cash on Delivery
                </label>
              </div>
              
              {formData.paymentMethod === 'credit-card' && (
                <div className="payment-details">
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button type="submit" className="place-order-btn">
              Place Order
            </button>
          </form>
        </div>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cart.items.map((item) => (
              <div key={item._id} className="summary-item">
                <div className="item-info">
                  <h3>{item.menuItem.name}</h3>
                  <p className="stall-name">{item.menuItem.stall.name}</p>
                </div>
                <div className="item-quantity">x{item.quantity}</div>
                <div className="item-price">
                  ${(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="summary-total">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${cart.totalAmount.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Delivery Fee:</span>
              <span>$2.00</span>
            </div>
            <div className="total-row">
              <span>Tax:</span>
              <span>${(cart.totalAmount * 0.08).toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>${(cart.totalAmount + 2.00 + (cart.totalAmount * 0.08)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
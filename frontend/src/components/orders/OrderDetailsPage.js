import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { subscribeToOrderUpdates, joinUserRoom } from '../../services/socket';
import './orders.css';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock order data for now
    const mockOrder = {
      _id: id,
      orderNumber: 'ORD-001',
      items: [
        { name: 'Burger', quantity: 2, price: 12.99 },
        { name: 'Fries', quantity: 1, price: 4.99 }
      ],
      totalAmount: 34.97,
      status: 'Pending',
      deliveryAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      createdAt: '2023-05-15T10:30:00Z'
    };
    
    setOrder(mockOrder);
    setLoading(false);
    
    // Join user room for real-time updates
    joinUserRoom('user123'); // This should be the actual user ID
    
    // Subscribe to real-time order updates
    const unsubscribe = subscribeToOrderUpdates((data) => {
      if (data.orderId === id) {
        setOrder(prevOrder => ({
          ...prevOrder,
          status: data.status
        }));
      }
    });

    // Cleanup subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, [id]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Preparing':
        return 'status-preparing';
      case 'Ready':
        return 'status-ready';
      case 'Delivered':
        return 'status-delivered';
      case 'Completed':
        return 'status-completed';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!order) return <div className="error">Order not found</div>;

  return (
    <div className="order-details-page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          ← Back
        </button>
        <h1>Order Details</h1>
        <p>Order #{order.orderNumber}</p>
      </div>

      <div className="order-details-content">
        <div className="order-summary">
          <div className="summary-section">
            <h3>Order Status</h3>
            <div className="status-display">
              <span className={`status-badge large ${getStatusClass(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          <div className="summary-section">
            <h3>Delivery Address</h3>
            <div className="address-display">
              <p>{order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</p>
            </div>
          </div>

          <div className="summary-section">
            <h3>Order Date</h3>
            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="order-items-section">
          <h3>Items Ordered</h3>
          <div className="order-items-list">
            {order.items.map((item, index) => (
              <div key={index} className="order-item-detail">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">Quantity: {item.quantity}</span>
                </div>
                <div className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-total-section">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${(order.totalAmount - 2.99).toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Delivery Fee</span>
              <span>$2.99</span>
            </div>
            <div className="total-row grand-total">
              <strong>Total</strong>
              <strong>${order.totalAmount.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="order-actions">
        <Link to="/orders" className="btn btn-secondary">
          View All Orders
        </Link>
        <button className="btn btn-primary" disabled>
          Track Order
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
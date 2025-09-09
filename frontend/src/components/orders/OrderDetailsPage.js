import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './orders.css';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Fetch order details from API
    // Mock data for now
    const mockOrder = {
      _id: orderId,
      orderNumber: 'ORD-001',
      items: [
        {
          menuItem: {
            name: 'Classic Burger',
            stall: {
              name: 'Burger Palace'
            }
          },
          quantity: 2,
          price: 8.99
        },
        {
          menuItem: {
            name: 'French Fries',
            stall: {
              name: 'Burger Palace'
            }
          },
          quantity: 1,
          price: 3.99
        }
      ],
      totalAmount: 24.97,
      status: 'Delivered',
      deliveryAddress: {
        name: 'John Doe',
        address: '123 Main St',
        city: 'Foodville',
        postalCode: '12345',
        phone: '+1 (555) 123-4567'
      },
      payment: {
        method: 'Credit Card',
        transactionId: 'txn_1234567890'
      },
      createdAt: '2023-05-15T10:30:00Z',
      updatedAt: '2023-05-15T11:45:00Z'
    };

    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 1000);
  }, [orderId]);

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

  if (loading) {
    return <div className="order-details-page">Loading order details...</div>;
  }

  if (error) {
    return <div className="order-details-page">Error: {error}</div>;
  }

  if (!order) {
    return <div className="order-details-page">Order not found</div>;
  }

  return (
    <div className="order-details-page">
      <div className="order-details-header">
        <Link to="/orders" className="back-link">← Back to Orders</Link>
        <h1>Order Details</h1>
      </div>

      <div className="order-details-content">
        <div className="order-info-card">
          <div className="order-header">
            <div className="order-basic-info">
              <h2>Order #{order.orderNumber}</h2>
              <p className="order-date">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className={`order-status ${getStatusClass(order.status)}`}>
              {order.status}
            </div>
          </div>

          <div className="order-details-grid">
            <div className="order-section">
              <h3>Items</h3>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item-detail">
                    <div className="item-info">
                      <h4>{item.menuItem.name}</h4>
                      <p className="stall-name">{item.menuItem.stall.name}</p>
                    </div>
                    <div className="item-quantity">x{item.quantity}</div>
                    <div className="item-price">
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-section">
              <h3>Delivery Address</h3>
              <div className="address-details">
                <p>{order.deliveryAddress.name}</p>
                <p>{order.deliveryAddress.address}</p>
                <p>{order.deliveryAddress.city}, {order.deliveryAddress.postalCode}</p>
                <p>{order.deliveryAddress.phone}</p>
              </div>
            </div>

            <div className="order-section">
              <h3>Payment</h3>
              <div className="payment-details">
                <p>Method: {order.payment.method}</p>
                <p>Transaction ID: {order.payment.transactionId}</p>
              </div>
            </div>
          </div>

          <div className="order-total-section">
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${(order.totalAmount - 2.00 - (order.totalAmount - 2.00) * 0.08).toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Delivery Fee:</span>
                <span>$2.00</span>
              </div>
              <div className="total-row">
                <span>Tax:</span>
                <span>${((order.totalAmount - 2.00) * 0.08).toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
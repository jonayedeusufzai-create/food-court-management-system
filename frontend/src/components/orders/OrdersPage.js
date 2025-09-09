import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './orders.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Fetch orders from API
    // Mock data for now
    const mockOrders = [
      {
        _id: '1',
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
        createdAt: '2023-05-15T10:30:00Z'
      },
      {
        _id: '2',
        orderNumber: 'ORD-002',
        items: [
          {
            menuItem: {
              name: 'Cheese Pizza',
              stall: {
                name: 'Pizza Corner'
              }
            },
            quantity: 1,
            price: 12.99
          }
        ],
        totalAmount: 12.99,
        status: 'Preparing',
        createdAt: '2023-05-18T14:20:00Z'
      },
      {
        _id: '3',
        orderNumber: 'ORD-003',
        items: [
          {
            menuItem: {
              name: 'Chicken Biryani',
              stall: {
                name: 'Indian Spice'
              }
            },
            quantity: 1,
            price: 10.99
          },
          {
            menuItem: {
              name: 'Garlic Naan',
              stall: {
                name: 'Indian Spice'
              }
            },
            quantity: 2,
            price: 2.99
          }
        ],
        totalAmount: 19.97,
        status: 'Completed',
        createdAt: '2023-05-10T12:15:00Z'
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

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
    return <div className="orders-page">Loading orders...</div>;
  }

  if (error) {
    return <div className="orders-page">Error: {error}</div>;
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <h2>You haven't placed any orders yet</h2>
          <p>Start ordering delicious food from our stalls!</p>
          <Link to="/stalls" className="browse-stalls-btn">
            Browse Stalls
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderNumber}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status}
                </div>
              </div>
              
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-details">
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
              
              <div className="order-footer">
                <div className="order-total">
                  Total: <span>${order.totalAmount.toFixed(2)}</span>
                </div>
                <Link to={`/orders/${order._id}`} className="view-details-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userAPI } from '../../services/api';
import { subscribeToOrderUpdates, joinUserRoom } from '../../services/socket';
import './orders.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getProfile();
        const customerId = response.data._id;
        
        // Join user room for real-time updates
        joinUserRoom(customerId);
        
        // Fetch orders
        const ordersResponse = await userAPI.getAllUsers(); // This should be replaced with proper orders API
        // For now, we'll use mock data
        const mockOrders = [
          {
            _id: '1',
            orderNumber: 'ORD-001',
            items: [
              { name: 'Burger', quantity: 2, price: 12.99 },
              { name: 'Fries', quantity: 1, price: 4.99 }
            ],
            totalAmount: 34.97,
            status: 'Pending',
            createdAt: '2023-05-15T10:30:00Z'
          },
          {
            _id: '2',
            orderNumber: 'ORD-002',
            items: [
              { name: 'Pizza', quantity: 1, price: 18.99 }
            ],
            totalAmount: 18.99,
            status: 'Preparing',
            createdAt: '2023-05-14T14:20:00Z'
          }
        ];
        setOrders(mockOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    
    // Subscribe to real-time order updates
    const unsubscribe = subscribeToOrderUpdates((data) => {
      console.log('Received order update:', data);
      // Update the specific order in state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === data.orderId 
            ? { ...order, status: data.status } 
            : order
        )
      );
    });

    // Cleanup subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, [user]);

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

  if (loading) return (
    <div className="orders-page" role="main">
      <div className="loading" aria-live="polite">Loading orders...</div>
    </div>
  );
  
  if (error) return (
    <div className="orders-page" role="main">
      <div className="error" role="alert">Error: {error}</div>
    </div>
  );

  return (
    <div className="orders-page" role="main">
      <div className="page-header">
        <h1>My Orders</h1>
        <p>Track your recent orders and their status</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/stalls" className="btn btn-primary">Browse Stalls</Link>
        </div>
      ) : (
        <div className="orders-list" role="list">
          {orders.map(order => (
            <div role="listitem" key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderNumber}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${getStatusClass(order.status)}`} aria-label={`Status: ${order.status}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="order-items" role="list">
                {order.items.map((item, index) => (
                  <div role="listitem" key={index} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="order-total">
                <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
              </div>
              
              <div className="order-actions">
                <Link to={`/orders/${order._id}`} className="btn btn-secondary">
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
import React, { useState, useEffect } from 'react';
import './orders.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // TODO: Fetch orders for stall owner from API
    // Mock data for now
    const mockOrders = [
      {
        _id: '1',
        orderNumber: 'ORD-001',
        customer: {
          name: 'John Doe'
        },
        items: [
          {
            menuItem: {
              name: 'Classic Burger'
            },
            quantity: 2,
            price: 8.99
          },
          {
            menuItem: {
              name: 'French Fries'
            },
            quantity: 1,
            price: 3.99
          }
        ],
        totalAmount: 24.97,
        status: 'Preparing',
        createdAt: '2023-05-15T10:30:00Z'
      },
      {
        _id: '2',
        orderNumber: 'ORD-005',
        customer: {
          name: 'Jane Smith'
        },
        items: [
          {
            menuItem: {
              name: 'Cheeseburger'
            },
            quantity: 1,
            price: 9.99
          },
          {
            menuItem: {
              name: 'Onion Rings'
            },
            quantity: 1,
            price: 4.99
          }
        ],
        totalAmount: 16.98,
        status: 'Pending',
        createdAt: '2023-05-18T14:20:00Z'
      },
      {
        _id: '3',
        orderNumber: 'ORD-008',
        customer: {
          name: 'Mike Johnson'
        },
        items: [
          {
            menuItem: {
              name: 'Veggie Burger'
            },
            quantity: 1,
            price: 7.99
          }
        ],
        totalAmount: 7.99,
        status: 'Ready',
        createdAt: '2023-05-18T09:15:00Z'
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

  const updateOrderStatus = (orderId, newStatus) => {
    // TODO: Update order status via API
    console.log(`Updating order ${orderId} to status ${newStatus}`);
    
    setOrders(orders.map(order => 
      order._id === orderId 
        ? { ...order, status: newStatus } 
        : order
    ));
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) {
    return <div className="order-management-page">Loading orders...</div>;
  }

  if (error) {
    return <div className="order-management-page">Error: {error}</div>;
  }

  return (
    <div className="order-management-page">
      <div className="order-management-header">
        <h1>Order Management</h1>
        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-orders">
          <h2>No orders found</h2>
          <p>
            {filter === 'all' 
              ? 'There are no orders for your stall yet.' 
              : `There are no orders with status "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderNumber}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  <p className="customer-name">Customer: {order.customer.name}</p>
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
                <div className="status-controls">
                  {order.status === 'Pending' && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => updateOrderStatus(order._id, 'Preparing')}
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'Preparing' && (
                    <button 
                      className="btn btn-success"
                      onClick={() => updateOrderStatus(order._id, 'Ready')}
                    >
                      Mark as Ready
                    </button>
                  )}
                  {order.status === 'Ready' && (
                    <button 
                      className="btn btn-info"
                      onClick={() => updateOrderStatus(order._id, 'Delivered')}
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
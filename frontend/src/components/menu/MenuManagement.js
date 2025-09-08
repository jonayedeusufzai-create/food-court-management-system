import React, { useState, useEffect } from 'react';
import './menuManagement.css';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stall: '',
    category: '',
    stock: '',
    preparationTime: ''
  });

  useEffect(() => {
    // TODO: Fetch menu items and stalls from API
    // Mock data for now
    const mockStalls = [
      { _id: '1', name: 'Burger Palace' },
      { _id: '2', name: 'Pizza Corner' }
    ];

    const mockMenuItems = [
      {
        _id: '1',
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, and special sauce',
        price: 8.99,
        stall: '1',
        category: 'Burgers',
        stock: 25,
        preparationTime: 10,
        isActive: true
      },
      {
        _id: '2',
        name: 'Cheese Pizza',
        description: 'Classic cheese pizza with tomato sauce and mozzarella',
        price: 12.99,
        stall: '2',
        category: 'Pizzas',
        stock: 15,
        preparationTime: 15,
        isActive: true
      }
    ];

    setTimeout(() => {
      setStalls(mockStalls);
      setMenuItems(mockMenuItems);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      // TODO: Update menu item via API
      console.log('Updating menu item:', formData);
    } else {
      // TODO: Create new menu item via API
      console.log('Creating new menu item:', formData);
    }
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      stall: '',
      category: '',
      stock: '',
      preparationTime: ''
    });
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      stall: item.stall,
      category: item.category,
      stock: item.stock,
      preparationTime: item.preparationTime
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      // TODO: Delete menu item via API
      console.log('Deleting menu item:', itemId);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stall: '',
      category: '',
      stock: '',
      preparationTime: ''
    });
  };

  const toggleActiveStatus = (item) => {
    // TODO: Update active status via API
    console.log('Toggling active status for item:', item._id);
  };

  if (loading) {
    return <div className="menu-management">Loading menu items...</div>;
  }

  return (
    <div className="menu-management">
      <div className="header">
        <h1>Menu Management</h1>
        <button className="add-item-btn" onClick={toggleForm}>
          {showForm ? 'Cancel' : '+ Add New Item'}
        </button>
      </div>

      {showForm && (
        <div className="menu-form-container">
          <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
          <form onSubmit={handleSubmit} className="menu-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Item Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="stall">Stall</label>
                <select
                  id="stall"
                  name="stall"
                  value={formData.stall}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a stall</option>
                  {stalls.map((stall) => (
                    <option key={stall._id} value={stall._id}>
                      {stall.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="stock">Stock Quantity</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="preparationTime">Preparation Time (minutes)</label>
                <input
                  type="number"
                  id="preparationTime"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
            
            <button type="submit" className="submit-btn">
              {editingItem ? 'Update Item' : 'Create Item'}
            </button>
          </form>
        </div>
      )}

      <div className="menu-items-list">
        <h2>Menu Items</h2>
        {menuItems.length === 0 ? (
          <p>You don't have any menu items yet.</p>
        ) : (
          <div className="menu-items-table">
            <div className="table-header">
              <div className="table-cell">Item</div>
              <div className="table-cell">Stall</div>
              <div className="table-cell">Category</div>
              <div className="table-cell">Price</div>
              <div className="table-cell">Stock</div>
              <div className="table-cell">Status</div>
              <div className="table-cell">Actions</div>
            </div>
            {menuItems.map((item) => {
              const stall = stalls.find(s => s._id === item.stall);
              return (
                <div key={item._id} className="table-row">
                  <div className="table-cell">
                    <div className="item-name">{item.name}</div>
                    <div className="item-description">{item.description}</div>
                  </div>
                  <div className="table-cell">{stall ? stall.name : 'Unknown'}</div>
                  <div className="table-cell">{item.category}</div>
                  <div className="table-cell">${item.price.toFixed(2)}</div>
                  <div className="table-cell">{item.stock}</div>
                  <div className="table-cell">
                    <span 
                      className={`status ${item.isActive ? 'active' : 'inactive'}`}
                      onClick={() => toggleActiveStatus(item)}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="table-cell actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
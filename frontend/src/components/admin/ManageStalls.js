import React, { useState, useEffect } from 'react';
import { stallAPI, menuAPI } from '../../services/api';
import './AdminStyles.css';

const ManageStalls = () => {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStall, setEditingStall] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    rent: '',
    image: ''
  });
  // Menu management states
  const [showMenuForm, setShowMenuForm] = useState({});
  const [editingMenuItem, setEditingMenuItem] = useState({});
  const [menuFormData, setMenuFormData] = useState({});
  const [expandedStalls, setExpandedStalls] = useState({});

  useEffect(() => {
    fetchStalls();
  }, []);

  const fetchStalls = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await stallAPI.getStalls();
      // The API returns {stalls: [...], ...} so we need to access response.data.stalls
      const stallsData = Array.isArray(response.data.stalls) ? response.data.stalls : response.data;
      
      // Fetch menu items for each stall
      const stallsWithMenus = await Promise.all(stallsData.map(async (stall) => {
        try {
          const menuResponse = await menuAPI.getMenuItemsByStall(stall._id);
          return { ...stall, menuItems: menuResponse.data };
        } catch (err) {
          console.error(`Error fetching menu for stall ${stall._id}:`, err);
          return { ...stall, menuItems: [] };
        }
      }));
      
      setStalls(stallsWithMenus);
    } catch (err) {
      console.error('Error fetching stalls:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch stalls');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMenuInputChange = (e, stallId) => {
    setMenuFormData({
      ...menuFormData,
      [stallId]: {
        ...menuFormData[stallId],
        [e.target.name]: e.target.value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        rent: parseFloat(formData.rent) || 0
      };
      
      if (editingStall) {
        // Update existing stall
        await stallAPI.updateStall(editingStall._id, submitData);
      } else {
        // Create new stall
        await stallAPI.createStall(submitData);
      }
      await fetchStalls(); // Wait for fetch to complete
      resetForm();
    } catch (err) {
      console.error('Error submitting stall:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save stall');
    }
  };

  const handleMenuSubmit = async (e, stallId) => {
    e.preventDefault();
    try {
      const currentMenuData = menuFormData[stallId] || {};
      const submitData = {
        ...currentMenuData,
        price: parseFloat(currentMenuData.price) || 0,
        stall: stallId
      };
      
      if (editingMenuItem[stallId]) {
        // Update existing menu item
        await menuAPI.updateMenuItem(editingMenuItem[stallId], submitData);
      } else {
        // Create new menu item
        await menuAPI.createMenuItem(submitData);
      }
      
      // Reset menu form for this stall
      setMenuFormData({
        ...menuFormData,
        [stallId]: {
          name: '',
          description: '',
          price: '',
          image: ''
        }
      });
      
      setEditingMenuItem({
        ...editingMenuItem,
        [stallId]: null
      });
      
      setShowMenuForm({
        ...showMenuForm,
        [stallId]: false
      });
      
      // Refresh stalls and their menus
      await fetchStalls();
    } catch (err) {
      console.error('Error submitting menu item:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save menu item');
    }
  };

  const handleEdit = (stall) => {
    setEditingStall(stall);
    setFormData({
      name: stall.name || '',
      description: stall.description || '',
      category: stall.category || '',
      rent: stall.rent || '',
      image: stall.image || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (stallId) => {
    if (window.confirm('Are you sure you want to delete this stall?')) {
      try {
        await stallAPI.deleteStall(stallId);
        await fetchStalls(); // Wait for fetch to complete
      } catch (err) {
        console.error('Error deleting stall:', err);
        setError(err.response?.data?.message || err.message || 'Failed to delete stall');
      }
    }
  };

  const handleEditMenuItem = (stallId, menuItem) => {
    setEditingMenuItem({
      ...editingMenuItem,
      [stallId]: menuItem._id
    });
    
    setMenuFormData({
      ...menuFormData,
      [stallId]: {
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        image: menuItem.image || ''
      }
    });
    
    setShowMenuForm({
      ...showMenuForm,
      [stallId]: true
    });
  };

  const handleDeleteMenuItem = async (stallId, menuItemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await menuAPI.deleteMenuItem(menuItemId);
        await fetchStalls(); // Refresh stalls and their menus
      } catch (err) {
        console.error('Error deleting menu item:', err);
        setError(err.response?.data?.message || err.message || 'Failed to delete menu item');
      }
    }
  };

  const resetForm = () => {
    setEditingStall(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      rent: '',
      image: ''
    });
    setShowForm(false);
  };

  const toggleStallExpansion = (stallId) => {
    setExpandedStalls({
      ...expandedStalls,
      [stallId]: !expandedStalls[stallId]
    });
  };

  const openAddMenuForm = (stallId) => {
    setEditingMenuItem({
      ...editingMenuItem,
      [stallId]: null
    });
    
    setMenuFormData({
      ...menuFormData,
      [stallId]: {
        name: '',
        description: '',
        price: '',
        image: ''
      }
    });
    
    setShowMenuForm({
      ...showMenuForm,
      [stallId]: true
    });
  };

  if (loading && stalls.length === 0) {
    return <div className="admin-page">Loading stalls...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Stalls</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Stall'}
        </button>
      </div>

      {error && (
        <div className="error">
          Error: {error}
          <button onClick={fetchStalls} className="btn btn-primary" style={{marginLeft: '10px'}}>
            Retry
          </button>
        </div>
      )}

      {showForm && (
        <div className="admin-form-container">
          <h2>{editingStall ? 'Edit Stall' : 'Add New Stall'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="name">Stall Name</label>
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
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Bangladeshi">Bangladeshi</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Drinks">Drinks</option>
                <option value="Dessert">Dessert</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="rent">Rent (BDT)</label>
              <input
                type="number"
                id="rent"
                name="rent"
                value={formData.rent}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
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
            
            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="Enter image URL"
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingStall ? 'Update Stall' : 'Add Stall'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-content">
        {stalls.length === 0 ? (
          <div className="no-stalls">
            <p>No stalls found. {loading ? 'Loading...' : 'Add your first stall using the button above.'}</p>
          </div>
        ) : (
          <div className="stalls-grid">
            {stalls.map((stall) => (
              <div key={stall._id} className="stall-card">
                <div className="stall-image">
                  {stall.image ? (
                    <img src={stall.image} alt={stall.name} />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                </div>
                <div className="stall-info">
                  <h3>{stall.name}</h3>
                  <p className="stall-category">{stall.category}</p>
                  <p className="stall-description">{stall.description}</p>
                  {stall.rent !== undefined && <p className="stall-rent">Rent: ৳ {parseFloat(stall.rent).toFixed(2)}</p>}
                </div>
                <div className="stall-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleEdit(stall)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(stall._id)}
                  >
                    Delete
                  </button>
                  <button 
                    className="btn btn-info"
                    onClick={() => toggleStallExpansion(stall._id)}
                  >
                    {expandedStalls[stall._id] ? 'Hide Menu' : 'Manage Menu'}
                  </button>
                </div>
                
                {expandedStalls[stall._id] && (
                  <div className="stall-menu-section">
                    <div className="menu-header">
                      <h4>Menu Items</h4>
                      <button 
                        className="btn btn-primary"
                        onClick={() => openAddMenuForm(stall._id)}
                      >
                        Add Menu Item
                      </button>
                    </div>
                    
                    {showMenuForm[stall._id] && (
                      <div className="menu-form-container">
                        <h5>{editingMenuItem[stall._id] ? 'Edit Menu Item' : 'Add New Menu Item'}</h5>
                        <form onSubmit={(e) => handleMenuSubmit(e, stall._id)} className="admin-form">
                          <div className="form-group">
                            <label htmlFor={`name-${stall._id}`}>Food Name</label>
                            <input
                              type="text"
                              id={`name-${stall._id}`}
                              name="name"
                              value={menuFormData[stall._id]?.name || ''}
                              onChange={(e) => handleMenuInputChange(e, stall._id)}
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor={`price-${stall._id}`}>Price (BDT)</label>
                            <input
                              type="number"
                              id={`price-${stall._id}`}
                              name="price"
                              value={menuFormData[stall._id]?.price || ''}
                              onChange={(e) => handleMenuInputChange(e, stall._id)}
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor={`description-${stall._id}`}>Description</label>
                            <textarea
                              id={`description-${stall._id}`}
                              name="description"
                              value={menuFormData[stall._id]?.description || ''}
                              onChange={(e) => handleMenuInputChange(e, stall._id)}
                              rows="2"
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor={`image-${stall._id}`}>Image URL</label>
                            <input
                              type="text"
                              id={`image-${stall._id}`}
                              name="image"
                              value={menuFormData[stall._id]?.image || ''}
                              onChange={(e) => handleMenuInputChange(e, stall._id)}
                              placeholder="Enter image URL"
                            />
                          </div>
                          
                          <div className="form-actions">
                            <button 
                              type="button" 
                              className="btn btn-secondary" 
                              onClick={() => {
                                setShowMenuForm({...showMenuForm, [stall._id]: false});
                                setEditingMenuItem({...editingMenuItem, [stall._id]: null});
                              }}
                            >
                              Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                              {editingMenuItem[stall._id] ? 'Update Item' : 'Add Item'}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                    
                    <div className="menu-items-grid">
                      {stall.menuItems && stall.menuItems.length > 0 ? (
                        stall.menuItems.map((item) => (
                          <div key={item._id} className="menu-item-card">
                            <div className="menu-item-image">
                              {item.image ? (
                                <img src={item.image} alt={item.name} />
                              ) : (
                                <div className="placeholder-image">No Image</div>
                              )}
                            </div>
                            <div className="menu-item-info">
                              <h5>{item.name}</h5>
                              <p className="menu-item-price">৳ {parseFloat(item.price).toFixed(2)}</p>
                              <p className="menu-item-description">{item.description}</p>
                            </div>
                            <div className="menu-item-actions">
                              <button 
                                className="btn btn-secondary"
                                onClick={() => handleEditMenuItem(stall._id, item)}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn btn-danger"
                                onClick={() => handleDeleteMenuItem(stall._id, item._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No menu items yet. Add your first item!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStalls;
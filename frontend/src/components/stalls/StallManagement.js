import React, { useState, useEffect } from 'react';
import './stallManagement.css';

const StallManagement = () => {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStall, setEditingStall] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    rent: '',
    location: '',
    contactInfo: {
      phone: '',
      email: ''
    }
  });

  useEffect(() => {
    // TODO: Fetch stalls from API
    // Mock data for now
    const mockStalls = [
      {
        _id: '1',
        name: 'Burger Palace',
        description: 'Delicious burgers and fries',
        category: 'Fast Food',
        rent: 500,
        location: 'Zone A, Stall 1',
        contactInfo: {
          phone: '+1234567890',
          email: 'burger@example.com'
        },
        isActive: true
      }
    ];

    setTimeout(() => {
      setStalls(mockStalls);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('contactInfo.')) {
      const contactField = name.split('.')[1];
      setFormData({
        ...formData,
        contactInfo: {
          ...formData.contactInfo,
          [contactField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingStall) {
      // TODO: Update stall via API
      console.log('Updating stall:', formData);
    } else {
      // TODO: Create new stall via API
      console.log('Creating new stall:', formData);
    }
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: '',
      rent: '',
      location: '',
      contactInfo: {
        phone: '',
        email: ''
      }
    });
    setShowForm(false);
    setEditingStall(null);
  };

  const handleEdit = (stall) => {
    setFormData({
      name: stall.name,
      description: stall.description,
      category: stall.category,
      rent: stall.rent,
      location: stall.location,
      contactInfo: {
        phone: stall.contactInfo.phone,
        email: stall.contactInfo.email
      }
    });
    setEditingStall(stall);
    setShowForm(true);
  };

  const handleDelete = (stallId) => {
    if (window.confirm('Are you sure you want to delete this stall?')) {
      // TODO: Delete stall via API
      console.log('Deleting stall:', stallId);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingStall(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      rent: '',
      location: '',
      contactInfo: {
        phone: '',
        email: ''
      }
    });
  };

  if (loading) {
    return <div className="stall-management">Loading stalls...</div>;
  }

  return (
    <div className="stall-management">
      <div className="header">
        <h1>Stall Management</h1>
        <button className="add-stall-btn" onClick={toggleForm}>
          {showForm ? 'Cancel' : '+ Add New Stall'}
        </button>
      </div>

      {showForm && (
        <div className="stall-form-container">
          <h2>{editingStall ? 'Edit Stall' : 'Add New Stall'}</h2>
          <form onSubmit={handleSubmit} className="stall-form">
            <div className="form-row">
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
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
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
                <label htmlFor="rent">Monthly Rent ($)</label>
                <input
                  type="number"
                  id="rent"
                  name="rent"
                  value={formData.rent}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Contact Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Contact Email</label>
                <input
                  type="email"
                  id="email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <button type="submit" className="submit-btn">
              {editingStall ? 'Update Stall' : 'Create Stall'}
            </button>
          </form>
        </div>
      )}

      <div className="stalls-list">
        <h2>My Stalls</h2>
        {stalls.length === 0 ? (
          <p>You don't have any stalls yet.</p>
        ) : (
          <div className="stalls-grid">
            {stalls.map((stall) => (
              <div key={stall._id} className="stall-card">
                <div className="stall-header">
                  <h3>{stall.name}</h3>
                  <div className="stall-status">
                    <span className={`status ${stall.isActive ? 'active' : 'inactive'}`}>
                      {stall.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="stall-details">
                  <p><strong>Category:</strong> {stall.category}</p>
                  <p><strong>Description:</strong> {stall.description}</p>
                  <p><strong>Rent:</strong> ${stall.rent}/month</p>
                  <p><strong>Location:</strong> {stall.location}</p>
                  <p><strong>Contact:</strong> {stall.contactInfo.phone} | {stall.contactInfo.email}</p>
                </div>
                <div className="stall-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(stall)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(stall._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StallManagement;
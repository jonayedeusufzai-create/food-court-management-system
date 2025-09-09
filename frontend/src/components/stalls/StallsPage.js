import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './stalls.css';

const StallsPage = () => {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // TODO: Fetch stalls from API
    // Mock data for now
    const mockStalls = [
      {
        _id: '1',
        name: 'Burger Palace',
        description: 'Delicious burgers and fries with premium ingredients',
        category: 'Fast Food',
        rating: 4.5,
        deliveryTime: '15-25 min',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1998&q=80',
        location: 'Zone A, Stall 1'
      },
      {
        _id: '2',
        name: 'Pizza Corner',
        description: 'Authentic Italian pizzas with fresh toppings',
        category: 'Italian',
        rating: 4.7,
        deliveryTime: '20-30 min',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        location: 'Zone B, Stall 5'
      },
      {
        _id: '3',
        name: 'Sushi Bar',
        description: 'Fresh sushi and Japanese dishes prepared by expert chefs',
        category: 'Japanese',
        rating: 4.8,
        deliveryTime: '25-35 min',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        location: 'Zone C, Stall 3'
      },
      {
        _id: '4',
        name: 'Taco Fiesta',
        description: 'Authentic Mexican tacos with fresh salsas and guacamole',
        category: 'Mexican',
        rating: 4.6,
        deliveryTime: '10-20 min',
        image: 'https://images.unsplash.com/photo-1599971378255-5ca65080f8ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
        location: 'Zone A, Stall 7'
      },
      {
        _id: '5',
        name: 'Green Bowl',
        description: 'Healthy salads and bowls with organic ingredients',
        category: 'Healthy',
        rating: 4.4,
        deliveryTime: '15-25 min',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        location: 'Zone B, Stall 2'
      },
      {
        _id: '6',
        name: 'Sweet Treats',
        description: 'Delicious desserts, cakes, and pastries',
        category: 'Desserts',
        rating: 4.9,
        deliveryTime: '5-15 min',
        image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
        location: 'Zone C, Stall 8'
      }
    ];

    setTimeout(() => {
      setStalls(mockStalls);
      setLoading(false);
    }, 1000);
  }, []);

  // Get unique categories for filter
  const categories = [...new Set(stalls.map(stall => stall.category))];

  // Filter stalls based on search and category
  const filteredStalls = stalls.filter(stall => {
    const matchesSearch = stall.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          stall.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || stall.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="stalls-page">
        <div className="container">
          <div className="page-header">
            <h1>Food Stalls</h1>
            <p>Discover amazing food options from our vendors</p>
          </div>
          <div className="loading-container">
            <p>Loading stalls...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stalls-page">
        <div className="container">
          <div className="page-header">
            <h1>Food Stalls</h1>
            <p>Discover amazing food options from our vendors</p>
          </div>
          <div className="error-container">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stalls-page">
      <div className="container">
        <div className="page-header">
          <h1>Food Stalls</h1>
          <p>Discover amazing food options from our vendors</p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search for restaurants or dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filter-section">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Stalls Grid */}
        {filteredStalls.length === 0 ? (
          <div className="no-results">
            <h3>No stalls found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="stalls-grid">
            {filteredStalls.map((stall) => (
              <div key={stall._id} className="stall-card">
                <div className="stall-image">
                  <img src={stall.image} alt={stall.name} />
                  <div className="stall-rating">
                    <span>⭐ {stall.rating}</span>
                  </div>
                </div>
                <div className="stall-info">
                  <div className="stall-header">
                    <h2>{stall.name}</h2>
                    <span className="delivery-time">{stall.deliveryTime}</span>
                  </div>
                  <p className="stall-category">{stall.category}</p>
                  <p className="stall-description">{stall.description}</p>
                  <div className="stall-footer">
                    <p className="stall-location">{stall.location}</p>
                    <Link to={`/stalls/${stall._id}`} className="view-menu-btn">
                      View Menu
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StallsPage;
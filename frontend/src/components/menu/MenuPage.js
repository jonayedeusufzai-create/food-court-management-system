import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { menuAPI, cartAPI } from '../../services/api';
import './MenuPage.css';

const MenuPage = () => {
  const { stallId } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    fetchMenuItems();
  }, [stallId]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      // Fetch menu items for the specific stall
      const response = await menuAPI.getMenuItemsByStall(stallId);
      setMenuItems(response.data.menuItems || response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch menu items');
      setLoading(false);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      // Set loading state for this item
      setAddingToCart(prev => ({ ...prev, [item._id]: true }));
      
      // Add item to cart
      await cartAPI.addToCart({
        menuItemId: item._id,
        quantity: 1
      });
      
      // Show success feedback
      alert(`${item.name} added to cart successfully!`);
    } catch (err) {
      // Show error feedback
      alert('Failed to add item to cart. Please try again.');
      console.error('Add to cart error:', err);
    } finally {
      // Reset loading state for this item
      setAddingToCart(prev => ({ ...prev, [item._id]: false }));
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Loading menu items...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: 'red' }}>
        <h2>{error}</h2>
        <button 
          onClick={() => navigate(-1)}
          className="back-button"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Group menu items by category for display
  const groupedItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div className="menu-page">
      {/* Header */}
      <header className="menu-header">
        <h1 className="menu-title">Stall Menu</h1>
        <button 
          onClick={() => navigate(-1)}
          className="back-button"
        >
          Back to Stalls
        </button>
      </header>

      {/* Menu Items */}
      <main style={{ marginTop: '30px' }}>
        {Object.keys(groupedItems).length > 0 ? (
          Object.entries(groupedItems).map(([category, items]) => (
            <section key={category} className="menu-items-section">
              <h2 className="category-title">
                {category}
              </h2>
              
              <div className="menu-grid">
                {items.map((item) => (
                  <div 
                    key={item._id} 
                    className="menu-item-card"
                  >
                    <h3 className="item-name">
                      {item.name}
                    </h3>
                    
                    <p className="item-description">
                      {item.description || 'Delicious item from our menu'}
                    </p>
                    
                    <div className="item-footer">
                      <span className="item-price">
                        ৳{item.price}
                      </span>
                      <button 
                        className="add-to-cart-button"
                        onClick={() => handleAddToCart(item)}
                        disabled={addingToCart[item._id]}
                      >
                        {addingToCart[item._id] ? 'Adding...' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="no-items-message">
            <h3>No menu items available for this stall</h3>
            <p>Please check back later</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="menu-footer">
        <p>© 2025 TheTreeHousse Food Court Management System</p>
      </footer>
    </div>
  );
};

export default MenuPage;
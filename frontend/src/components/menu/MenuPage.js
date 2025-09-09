import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './menu.css';

const MenuPage = () => {
  const { stallId } = useParams();
  const [stall, setStall] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // TODO: Fetch stall and menu data from API
    // Mock data for now
    const mockStall = {
      _id: stallId,
      name: 'Burger Palace',
      description: 'Delicious burgers and fries with premium ingredients',
      category: 'Fast Food',
      rating: 4.5,
      deliveryTime: '15-25 min',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1998&q=80',
      location: 'Zone A, Stall 1'
    };

    const mockMenuItems = [
      {
        _id: '1',
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, and special sauce',
        price: 8.99,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1998&q=80',
        stock: 25
      },
      {
        _id: '2',
        name: 'Cheeseburger',
        description: 'Classic burger with melted cheese',
        price: 9.99,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        stock: 20
      },
      {
        _id: '3',
        name: 'Veggie Burger',
        description: 'Plant-based patty with fresh vegetables',
        price: 7.99,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1592198879507-35496868a834?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        stock: 15
      },
      {
        _id: '4',
        name: 'French Fries',
        description: 'Crispy golden fries with salt',
        price: 3.99,
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        stock: 50
      },
      {
        _id: '5',
        name: 'Onion Rings',
        description: 'Crispy battered onion rings',
        price: 4.99,
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1634034379073-4cdef6f7f0b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80',
        stock: 30
      },
      {
        _id: '6',
        name: 'Chocolate Milkshake',
        description: 'Rich chocolate milkshake with whipped cream',
        price: 5.99,
        category: 'Drinks',
        image: 'https://images.unsplash.com/photo-1578587402466-3d3c0c6d0a5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
        stock: 15
      }
    ];

    setTimeout(() => {
      setStall(mockStall);
      setMenuItems(mockMenuItems);
      setLoading(false);
    }, 1000);
  }, [stallId]);

  const addToCart = (item) => {
    setCart([...cart, { ...item, quantity: 1 }]);
    alert(`${item.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="menu-page">
        <div className="container">
          <div className="loading-container">
            <p>Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-page">
        <div className="container">
          <div className="error-container">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Get unique categories for filter
  const categories = [...new Set(menuItems.map(item => item.category))];
  
  // Filter menu items based on category
  const filteredMenuItems = selectedCategory 
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  // Group menu items by category
  const groupedMenuItems = filteredMenuItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <div className="menu-page">
      <div className="container">
        <div className="menu-header">
          <Link to="/stalls" className="back-link">← Back to Stalls</Link>
          {stall && (
            <div className="stall-hero">
              <div className="stall-hero-image">
                <img src={stall.image} alt={stall.name} />
              </div>
              <div className="stall-hero-content">
                <h1>{stall.name}</h1>
                <p className="stall-description">{stall.description}</p>
                <div className="stall-meta">
                  <span className="stall-rating">⭐ {stall.rating}</span>
                  <span className="stall-delivery">{stall.deliveryTime}</span>
                  <span className="stall-category">{stall.category}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="menu-content">
          {/* Category Filter */}
          <div className="category-filter">
            <button 
              className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              All Items
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          {Object.keys(groupedMenuItems).length === 0 ? (
            <div className="no-results">
              <h3>No items found</h3>
              <p>Try selecting a different category</p>
            </div>
          ) : (
            Object.keys(groupedMenuItems).map((category) => (
              <div key={category} className="menu-category">
                <h2>{category}</h2>
                <div className="menu-items">
                  {groupedMenuItems[category].map((item) => (
                    <div key={item._id} className="menu-item">
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p className="item-description">{item.description}</p>
                        <div className="item-meta">
                          <p className="item-price">${item.price.toFixed(2)}</p>
                          <p className="item-stock">
                            {item.stock > 0 ? `In Stock: ${item.stock}` : 'Out of Stock'}
                          </p>
                        </div>
                      </div>
                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(item)}
                        disabled={item.stock === 0}
                      >
                        {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-summary">
            <Link to="/cart" className="view-cart-btn">
              View Cart ({cart.length} items)
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
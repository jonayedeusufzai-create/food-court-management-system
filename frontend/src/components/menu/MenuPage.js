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

  useEffect(() => {
    // TODO: Fetch stall and menu data from API
    // Mock data for now
    const mockStall = {
      _id: stallId,
      name: 'Burger Palace',
      description: 'Delicious burgers and fries',
      category: 'Fast Food',
      image: 'https://via.placeholder.com/300x200?text=Burger+Palace',
      location: 'Zone A, Stall 1'
    };

    const mockMenuItems = [
      {
        _id: '1',
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, and special sauce',
        price: 8.99,
        category: 'Burgers',
        image: 'https://via.placeholder.com/150x150?text=Classic+Burger',
        stock: 25
      },
      {
        _id: '2',
        name: 'Cheeseburger',
        description: 'Classic burger with melted cheese',
        price: 9.99,
        category: 'Burgers',
        image: 'https://via.placeholder.com/150x150?text=Cheeseburger',
        stock: 20
      },
      {
        _id: '3',
        name: 'Veggie Burger',
        description: 'Plant-based patty with fresh vegetables',
        price: 7.99,
        category: 'Burgers',
        image: 'https://via.placeholder.com/150x150?text=Veggie+Burger',
        stock: 15
      },
      {
        _id: '4',
        name: 'French Fries',
        description: 'Crispy golden fries with salt',
        price: 3.99,
        category: 'Sides',
        image: 'https://via.placeholder.com/150x150?text=French+Fries',
        stock: 50
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
    return <div className="menu-page">Loading menu...</div>;
  }

  if (error) {
    return <div className="menu-page">Error: {error}</div>;
  }

  // Group menu items by category
  const groupedMenuItems = menuItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <div className="menu-page">
      <div className="menu-header">
        <Link to="/stalls" className="back-link">← Back to Stalls</Link>
        {stall && (
          <>
            <h1>{stall.name} Menu</h1>
            <p className="stall-description">{stall.description}</p>
          </>
        )}
      </div>

      <div className="menu-content">
        {Object.keys(groupedMenuItems).map((category) => (
          <div key={category} className="menu-category">
            <h2>{category}</h2>
            <div className="menu-items">
              {groupedMenuItems[category].map((item) => (
                <div key={item._id} className="menu-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-description">{item.description}</p>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                    <p className="item-stock">
                      {item.stock > 0 ? `In Stock: ${item.stock}` : 'Out of Stock'}
                    </p>
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
        ))}
      </div>

      {cart.length > 0 && (
        <div className="cart-summary">
          <Link to="/cart" className="view-cart-btn">
            View Cart ({cart.length} items)
          </Link>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
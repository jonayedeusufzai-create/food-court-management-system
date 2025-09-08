import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './stalls.css';

const StallsPage = () => {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Fetch stalls from API
    // Mock data for now
    const mockStalls = [
      {
        _id: '1',
        name: 'Burger Palace',
        description: 'Delicious burgers and fries',
        category: 'Fast Food',
        image: 'https://via.placeholder.com/300x200?text=Burger+Palace',
        location: 'Zone A, Stall 1'
      },
      {
        _id: '2',
        name: 'Pizza Corner',
        description: 'Authentic Italian pizzas',
        category: 'Italian',
        image: 'https://via.placeholder.com/300x200?text=Pizza+Corner',
        location: 'Zone B, Stall 5'
      },
      {
        _id: '3',
        name: 'Sushi Bar',
        description: 'Fresh sushi and Japanese dishes',
        category: 'Japanese',
        image: 'https://via.placeholder.com/300x200?text=Sushi+Bar',
        location: 'Zone C, Stall 3'
      }
    ];

    setTimeout(() => {
      setStalls(mockStalls);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="stalls-page">Loading stalls...</div>;
  }

  if (error) {
    return <div className="stalls-page">Error: {error}</div>;
  }

  return (
    <div className="stalls-page">
      <h1>Food Stalls</h1>
      <div className="stalls-grid">
        {stalls.map((stall) => (
          <div key={stall._id} className="stall-card">
            <img src={stall.image} alt={stall.name} />
            <div className="stall-info">
              <h2>{stall.name}</h2>
              <p className="stall-category">{stall.category}</p>
              <p className="stall-description">{stall.description}</p>
              <p className="stall-location">{stall.location}</p>
              <Link to={`/stalls/${stall._id}`} className="view-menu-btn">
                View Menu
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StallsPage;
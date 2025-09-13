import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { stallAPI } from '../../services/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stalls, setStalls] = useState([]);
  const [stallsLoading, setStallsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // In a real app, you would fetch user data from the API
    // For now, we'll just simulate it
    setTimeout(() => {
      setUser({
        name: 'Test User',
        email: 'test@example.com',
        role: 'Customer'
      });
      setLoading(false);
    }, 500);
    
    // Fetch stalls
    fetchStalls();
  }, [navigate]);

  const fetchStalls = async () => {
    try {
      const response = await stallAPI.getStalls();
      setStalls(response.data.stalls || response.data);
      setStallsLoading(false);
    } catch (error) {
      console.error('Error fetching stalls:', error);
      setStallsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleViewMenu = (stallId) => {
    // Navigate to the menu page for this stall
    navigate(`/stall/${stallId}/menu`);
  };

  // Sample stall data for initial display
  const sampleStalls = [
    { _id: 1, name: 'Pizza Hub', category: 'Italian', description: 'Fresh hot pizzas' },
    { _id: 2, name: 'Burger Palace', category: 'Fast Food', description: 'Juicy burgers & fries' },
    { _id: 3, name: 'Noodle House', category: 'Asian', description: 'Authentic ramen bowls' },
    { _id: 4, name: 'Sushi Corner', category: 'Japanese', description: 'Premium sushi platters' },
    { _id: 5, name: 'Green Bowl', category: 'Healthy', description: 'Salads & smoothies' },
    { _id: 6, name: 'Spice Villa', category: 'Indian', description: 'Biryani & curries' },
    { _id: 7, name: 'Sweet Treats', category: 'Dessert', description: 'Cakes, ice cream' },
    { _id: 8, name: 'Coffee Stop', category: 'Beverages', description: 'Coffee & snacks' },
    { _id: 9, name: 'Taco Town', category: 'Mexican', description: 'Tacos & burritos' },
    { _id: 10, name: 'Fried Chicken Express', category: 'Fast Food', description: 'Crispy chicken buckets' }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px 0', 
        borderBottom: '1px solid #eee' 
      }}>
        <h1 style={{ margin: '0', color: '#2a9d8f' }}>TheTreeHousse</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Welcome, {user?.name}!</span>
          <button 
            onClick={() => navigate('/cart')}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#2a9d8f', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🛒 Cart
          </button>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#e76f51', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ marginTop: '30px' }}>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '30px', 
          borderRadius: '8px', 
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#264653', marginBottom: '20px' }}>Welcome to Your Food Court Dashboard</h2>
          <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto 30px' }}>
            Discover delicious food from various stalls in our food court. Place orders, track deliveries, and enjoy your favorite meals!
          </p>
        </div>

        {/* Available Stalls Section */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            color: '#264653', 
            marginBottom: '20px', 
            textAlign: 'center',
            fontSize: '28px'
          }}>
            Available Stalls
          </h2>
          
          {stallsLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Loading stalls...</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '25px',
              marginTop: '20px'
            }}>
              {(stalls.length > 0 ? stalls : sampleStalls).map((stall) => (
                <div 
                  key={stall._id} 
                  style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    backgroundColor: 'white',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Stall Image Placeholder */}
                  <div style={{ 
                    height: '180px', 
                    backgroundColor: '#e9c46a', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '60px'
                  }}>
                    🏬
                  </div>
                  
                  {/* Stall Info */}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ 
                      margin: '0 0 10px 0', 
                      color: '#264653',
                      fontSize: '20px'
                    }}>
                      {stall.name}
                    </h3>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '15px'
                    }}>
                      <span style={{ 
                        backgroundColor: '#2a9d8f', 
                        color: 'white', 
                        padding: '4px 10px', 
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}>
                        {stall.category}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#e9c46a', marginRight: '5px' }}>★</span>
                        <span>4.5</span>
                      </div>
                    </div>
                    
                    <p style={{ 
                      color: '#666', 
                      marginBottom: '20px',
                      minHeight: '40px'
                    }}>
                      {stall.description || 'Delicious food from our stall'}
                    </p>
                    
                    <button 
                      onClick={() => handleViewMenu(stall._id)}
                      style={{ 
                        width: '100%',
                        padding: '10px', 
                        backgroundColor: '#f4a261', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '6px', 
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e76f51';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f4a261';
                      }}
                    >
                      View Menu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* User Info */}
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px', 
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#264653', marginBottom: '15px' }}>Your Account Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <strong>Name:</strong> {user?.name}
            </div>
            <div>
              <strong>Email:</strong> {user?.email}
            </div>
            <div>
              <strong>Role:</strong> {user?.role}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        marginTop: '50px', 
        paddingTop: '20px', 
        borderTop: '1px solid #eee', 
        textAlign: 'center', 
        color: '#666' 
      }}>
        <p>© 2025 TheTreeHousse Food Court Management System</p>
        <div style={{ marginTop: '10px' }}>
          <a href="#" style={{ color: '#2a9d8f', textDecoration: 'none', margin: '0 10px' }}>Contact</a>
          <a href="#" style={{ color: '#2a9d8f', textDecoration: 'none', margin: '0 10px' }}>Privacy Policy</a>
          <a href="#" style={{ color: '#2a9d8f', textDecoration: 'none', margin: '0 10px' }}>Terms of Service</a>
        </div>
        <div style={{ marginTop: '10px' }}>
          <a href="#" style={{ color: '#2a9d8f', textDecoration: 'none', margin: '0 10px' }}>Facebook</a>
          <a href="#" style={{ color: '#2a9d8f', textDecoration: 'none', margin: '0 10px' }}>Twitter</a>
          <a href="#" style={{ color: '#2a9d8f', textDecoration: 'none', margin: '0 10px' }}>Instagram</a>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
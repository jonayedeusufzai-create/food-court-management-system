import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/slices/authSlice';
import './App.css';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import CustomerDashboard from './components/dashboard/CustomerDashboard';
import StallOwnerDashboard from './components/dashboard/StallOwnerDashboard';
import FoodCourtOwnerDashboard from './components/dashboard/FoodCourtOwnerDashboard';
import Profile from './components/profile/Profile';
import DashboardLayout from './components/dashboard/DashboardLayout';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const renderDashboard = () => {
    if (!isAuthenticated) {
      return <Login />;
    }

    switch (user?.role) {
      case 'Customer':
        return <CustomerDashboard />;
      case 'StallOwner':
        return <StallOwnerDashboard />;
      case 'FoodCourtOwner':
        return <FoodCourtOwnerDashboard />;
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <DashboardLayout user={user}>
              {renderDashboard()}
            </DashboardLayout>
          } />
          <Route path="/profile" element={
            <DashboardLayout user={user}>
              <Profile />
            </DashboardLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
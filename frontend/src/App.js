import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import MainLayout from './components/layout/MainLayout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VerifyEmail from './components/auth/VerifyEmail';
import CustomerDashboard from './components/dashboard/CustomerDashboard';
import StallOwnerDashboard from './components/dashboard/StallOwnerDashboard';
import FoodCourtOwnerDashboard from './components/dashboard/FoodCourtOwnerDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import StallsPage from './components/stalls/StallsPage';
import MenuPage from './components/menu/MenuPage';
import CartPage from './components/cart/CartPage';
import CheckoutPage from './components/cart/CheckoutPage';
import OrdersPage from './components/orders/OrdersPage';
import OrderDetailsPage from './components/orders/OrderDetailsPage';
import Profile from './components/profile/Profile';
import ErrorBoundary from './components/layout/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<CustomerDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/dashboard" element={<CustomerDashboard />} />
                <Route path="/dashboard/stall-owner" element={<StallOwnerDashboard />} />
                <Route path="/dashboard/food-court-owner" element={<FoodCourtOwnerDashboard />} />
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/stalls" element={<StallsPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:id" element={<OrderDetailsPage />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
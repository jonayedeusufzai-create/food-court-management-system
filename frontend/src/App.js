import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import MenuPage from './components/menu/MenuPage';
import AdminDashboard from './components/dashboard/AdminDashboard';
import ManageStalls from './components/admin/ManageStalls';
import CartPage from './components/cart/CartPage';
import CheckoutPage from './components/cart/CheckoutPage';
// Removed ManageMenu import as it's now integrated into ManageStalls
import AdminLogin from './components/auth/AdminLogin';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stall/:stallId/menu" element={<MenuPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/stalls" element={<ManageStalls />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          {/* Removed /admin/menu route as it's now integrated into /admin/stalls */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
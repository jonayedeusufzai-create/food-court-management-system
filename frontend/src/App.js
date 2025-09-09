import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/slices/authSlice';
import './App.css';
import MainLayout from './components/layout/MainLayout';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import CustomerDashboard from './components/dashboard/CustomerDashboard';
import StallOwnerDashboard from './components/dashboard/StallOwnerDashboard';
import FoodCourtOwnerDashboard from './components/dashboard/FoodCourtOwnerDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import Profile from './components/profile/Profile';
import DashboardLayout from './components/dashboard/DashboardLayout';
import StallsPage from './components/stalls/StallsPage';
import MenuPage from './components/menu/MenuPage';
import StallManagement from './components/stalls/StallManagement';
import MenuManagement from './components/menu/MenuManagement';
import CartPage from './components/cart/CartPage';
import CheckoutPage from './components/cart/CheckoutPage';
import OrdersPage from './components/orders/OrdersPage';
import OrderDetailsPage from './components/orders/OrderDetailsPage';
import OrderManagement from './components/orders/OrderManagement';
import ReportsPage from './components/dashboard/ReportsPage';
import ReportDetailsPage from './components/dashboard/ReportDetailsPage';
import AnalyticsDashboard from './components/dashboard/AnalyticsDashboard';

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
        return <AdminDashboard />;
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<CustomerDashboard />} />
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
          {/* Customer routes */}
          <Route path="/stalls" element={
            <DashboardLayout user={user}>
              <StallsPage />
            </DashboardLayout>
          } />
          <Route path="/stalls/:stallId" element={
            <DashboardLayout user={user}>
              <MenuPage />
            </DashboardLayout>
          } />
          <Route path="/cart" element={
            <DashboardLayout user={user}>
              <CartPage />
            </DashboardLayout>
          } />
          <Route path="/checkout" element={
            <DashboardLayout user={user}>
              <CheckoutPage />
            </DashboardLayout>
          } />
          <Route path="/orders" element={
            <DashboardLayout user={user}>
              <OrdersPage />
            </DashboardLayout>
          } />
          <Route path="/orders/:orderId" element={
            <DashboardLayout user={user}>
              <OrderDetailsPage />
            </DashboardLayout>
          } />
          {/* Stall Owner routes */}
          <Route path="/stalls/manage" element={
            <DashboardLayout user={user}>
              <StallManagement />
            </DashboardLayout>
          } />
          <Route path="/menu/manage" element={
            <DashboardLayout user={user}>
              <MenuManagement />
            </DashboardLayout>
          } />
          <Route path="/orders/manage" element={
            <DashboardLayout user={user}>
              <OrderManagement />
            </DashboardLayout>
          } />
          {/* Admin routes */}
          <Route path="/reports" element={
            <DashboardLayout user={user}>
              <ReportsPage />
            </DashboardLayout>
          } />
          <Route path="/reports/:reportId" element={
            <DashboardLayout user={user}>
              <ReportDetailsPage />
            </DashboardLayout>
          } />
          <Route path="/analytics" element={
            <DashboardLayout user={user}>
              <AnalyticsDashboard />
            </DashboardLayout>
          } />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
import axios from 'axios';

// Create an axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
});

// Add a request interceptor to include the token in headers
API.interceptors.request.use((config) => {
  console.log('Making API request:', config);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors
API.interceptors.response.use(
  (response) => {
    console.log('API response:', response);
    return response;
  },
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => {
    console.log('Calling register API with data:', userData);
    return API.post('/auth/register', userData);
  },
  login: (userData) => API.post('/auth/login', userData),
  verifyEmail: (token) => API.get(`/auth/verify/${token}`),
  registerAdmin: (userData) => API.post('/auth/admin/register', userData),
};

// User API calls
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (userData) => API.put('/users/profile', userData),
  getAllUsers: () => API.get('/users'),
  deleteUser: (id) => API.delete(`/users/${id}`),
};

// Analytics API calls
export const analyticsAPI = {
  getDashboardStats: () => API.get('/analytics/dashboard-stats'),
  getRecentOrders: () => API.get('/analytics/recent-orders'),
  getTopStalls: () => API.get('/analytics/top-stalls'),
  getSalesTrends: () => API.get('/analytics/sales-trends'),
};

// Order API calls
export const orderAPI = {
  createOrder: (orderData) => API.post('/orders', orderData),
  getOrders: () => API.get('/orders'),
  getOrderById: (id) => API.get(`/orders/${id}`),
  updateOrderStatus: (id, statusData) => API.put(`/orders/${id}/status`, statusData),
  getOrdersByCustomer: (customerId) => API.get(`/orders/customer/${customerId}`),
};

// Stall API calls
export const stallAPI = {
  getStalls: () => API.get('/stalls'),
  getStallById: (id) => API.get(`/stalls/${id}`),
  createStall: (stallData) => API.post('/stalls', stallData),
  updateStall: (id, stallData) => API.put(`/stalls/${id}`, stallData),
  deleteStall: (id) => API.delete(`/stalls/${id}`),
};

// Menu API calls
export const menuAPI = {
  getMenuItems: () => API.get('/menu'),
  getMenuItemById: (id) => API.get(`/menu/${id}`),
  getMenuItemsByStall: (stallId) => API.get(`/menu/stall/${stallId}`),
  createMenuItem: (menuItemData) => API.post('/menu', menuItemData),
  updateMenuItem: (id, menuItemData) => API.put(`/menu/${id}`, menuItemData),
  deleteMenuItem: (id) => API.delete(`/menu/${id}`),
};

export default API;
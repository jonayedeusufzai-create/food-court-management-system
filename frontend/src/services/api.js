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

export default API;
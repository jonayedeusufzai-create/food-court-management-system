const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Order = require('../../models/Order');
const User = require('../../models/User');
const { createOrder, getOrders, getOrderById } = require('../orderController');

// Create express app for testing
const app = express();
app.use(express.json());

// Mock authentication middleware
const mockAuth = (req, res, next) => {
  req.user = { _id: 'user123', role: 'Customer' };
  next();
};

// Mock admin middleware
const mockAdmin = (req, res, next) => {
  req.user = { _id: 'admin123', role: 'FoodCourtOwner' };
  next();
};

// Mock routes for testing
app.post('/api/orders', mockAuth, createOrder);
app.get('/api/orders', mockAdmin, getOrders);
app.get('/api/orders/:id', mockAuth, getOrderById);

describe('Order Controller', () => {
  beforeAll(async () => {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/foodcourt_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Clean up database and close connection
    await Order.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/orders', () => {
    let userId;
    let user;
    
    beforeEach(async () => {
      // Create a test user
      user = await User.create({
        name: 'Order Test User',
        email: 'order_test@example.com',
        password: 'Password123!'
      });
      userId = user._id;
    });

    afterEach(async () => {
      // Clean up users and orders
      await User.deleteMany({});
      await Order.deleteMany({});
    });

    it('should create a new order successfully', async () => {
      const orderData = {
        items: [
          {
            name: 'Burger',
            quantity: 2,
            price: 12.99
          }
        ],
        totalAmount: 25.98,
        deliveryAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        }
      };

      // Mock the authentication middleware to set user
      const mockAuth = (req, res, next) => {
        req.user = { _id: userId, role: 'Customer' };
        next();
      };
      
      // Create a new app instance for this test to avoid middleware conflicts
      const testApp = express();
      testApp.use(express.json());
      testApp.use(mockAuth);
      testApp.post('/api/orders', require('../orderController').createOrder);

      const response = await request(testApp)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.items).toHaveLength(1);
      expect(response.body.totalAmount).toBe(orderData.totalAmount);
    });

    it('should fail to create order without items', async () => {
      const orderData = {
        totalAmount: 25.98,
        deliveryAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        }
      };

      // Mock the authentication middleware to set user
      const mockAuth = (req, res, next) => {
        req.user = { _id: userId, role: 'Customer' };
        next();
      };
      
      // Create a new app instance for this test to avoid middleware conflicts
      const testApp = express();
      testApp.use(express.json());
      testApp.use(mockAuth);
      testApp.post('/api/orders', require('../orderController').createOrder);

      const response = await request(testApp)
        .post('/api/orders')
        .send(orderData)
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('GET /api/orders', () => {
    let userId;
    let user;
    
    beforeEach(async () => {
      // Create a test user
      user = await User.create({
        name: 'Order Get Test User',
        email: 'order_get_test@example.com',
        password: 'Password123!'
      });
      userId = user._id;
      
      // Create test orders
      await Order.create({
        customer: userId,
        items: [{ name: 'Burger', quantity: 1, price: 12.99 }],
        totalAmount: 12.99,
        deliveryAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        }
      });
    });

    afterEach(async () => {
      // Clean up orders and users
      await Order.deleteMany({});
      await User.deleteMany({});
    });

    it('should get all orders (admin only)', async () => {
      // Mock admin middleware
      const mockAdmin = (req, res, next) => {
        req.user = { _id: userId, role: 'FoodCourtOwner' };
        next();
      };
      
      // Create a new app instance for this test to avoid middleware conflicts
      const testApp = express();
      testApp.use(express.json());
      testApp.use(mockAdmin);
      testApp.get('/api/orders', require('../orderController').getOrders);

      const response = await request(testApp)
        .get('/api/orders')
        .expect(200);

      expect(Array.isArray(response.body.orders)).toBe(true);
      expect(response.body.orders).toHaveLength(1);
    });
  });
});
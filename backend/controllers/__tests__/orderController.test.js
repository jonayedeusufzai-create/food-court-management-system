const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const { createOrder, getOrders, getOrderById } = require('../controllers/orderController');

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

      const response = await request(app)
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

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('GET /api/orders', () => {
    beforeEach(async () => {
      // Create test orders
      await Order.create({
        customer: 'user123',
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
      // Clean up orders
      await Order.deleteMany({});
    });

    it('should get all orders (admin only)', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
    });
  });
});
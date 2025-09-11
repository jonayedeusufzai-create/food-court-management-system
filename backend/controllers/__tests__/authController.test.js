const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/User');
const { registerUser, loginUser } = require('../authController');

// Set JWT secret for testing
process.env.JWT_SECRET = 'test-secret-key';

// Create express app for testing
const app = express();
app.use(express.json());

// Mock routes for testing
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);

// Mock email service
jest.mock('../../services/emailService', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue()
}));

describe('Auth Controller', () => {
  beforeAll(async () => {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/foodcourt_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Clean up database and close connection
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    afterEach(async () => {
      // Clean up users after each test
      await User.deleteMany({});
    });

    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'register_test@example.com', // Unique email
        password: 'Str0ng!P@ssw0rd2023', // Much stronger password
        phone: '1234567890'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
      expect(response.body).toHaveProperty('token');
      expect(response.body.role).toBe('Customer'); // Default role
    });

    it('should fail to register with invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'Password123!' // Stronger password
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
    });

    it('should fail to register with short password', async () => {
      const userData = {
        name: 'Test User',
        email: 'short_password_test@example.com', // Unique email
        password: '1234567' // 7 characters, still too short
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('POST /api/auth/login', () => {
    let createdUser;
    
    beforeEach(async () => {
      // Create a test user with a strong password
      createdUser = new User({
        name: 'Login Test User',
        email: 'login_test@example.com', // Unique email
        password: 'Password123!' // Stronger password
      });
      await createdUser.save();
    });

    afterEach(async () => {
      // Clean up users
      await User.deleteMany({});
    });

    it('should login successfully with correct credentials', async () => {
      const loginData = {
        email: 'login_test@example.com',
        password: 'Password123!' // Stronger password
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.email).toBe(loginData.email);
      expect(response.body).toHaveProperty('token');
    });

    it('should fail to login with incorrect password', async () => {
      const loginData = {
        email: 'login_test@example.com',
        password: 'WrongPassword123!' // Wrong password
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should fail to login with invalid email format', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'Password123!' // Stronger password
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
    });
  });
});
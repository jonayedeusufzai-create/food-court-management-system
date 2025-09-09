const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// Load environment variables
dotenv.config();

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const stallRoutes = require('./routes/stallRoutes');
const menuRoutes = require('./routes/menuRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Initialize app
const app = express();
const server = http.createServer(app);

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  points: 100, // 100 requests
  duration: 15 * 60, // per 15 minutes
});

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({ message: 'Too many requests, please try again later.' });
    });
};

// Apply rate limiting to all requests
app.use(rateLimiterMiddleware);

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store connected users
const connectedUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining with their ID
  socket.on('join_user', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} joined with socket ID ${socket.id}`);
  });

  // Handle order status updates
  socket.on('order_status_update', (data) => {
    const { orderId, status, userId } = data;
    console.log(`Order ${orderId} status updated to ${status}`);
    
    // Emit to specific user if connected
    if (connectedUsers.has(userId)) {
      const userSocketId = connectedUsers.get(userId);
      io.to(userSocketId).emit('order_status_updated', { orderId, status });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove user from connected users map
    for (let [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

// Middleware
app.use(express.json({ limit: '10mb' })); // Limit request size
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stalls', stallRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'TheTreeHousse - Food Court Management System API' });
});

// Port
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodcourt', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// Export io for use in controllers
module.exports = { io, connectedUsers };
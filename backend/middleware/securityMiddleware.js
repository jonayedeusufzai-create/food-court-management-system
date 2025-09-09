const rateLimit = require('express-rate-limit');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Authentication rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    message: 'Too many authentication attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    message: 'Too many API requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Advanced rate limiting with rate-limiter-flexible
const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 points
  duration: 1, // per 1 second
});

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({ 
        error: 'Too Many Requests',
        message: 'You have exceeded the rate limit. Please try again later.'
      });
    });
};

// XSS protection middleware
const xssProtection = (req, res, next) => {
  // Sanitize input data
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Basic XSS protection - remove script tags
        req.body[key] = req.body[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        // Remove on-event attributes
        req.body[key] = req.body[key].replace(/on\w+="[^"]*"/gi, '');
      }
    }
  }
  
  next();
};

// Content Security Policy headers
const cspHeaders = (req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' ws: wss:; " +
    "frame-src 'none'; " +
    "object-src 'none';"
  );
  next();
};

module.exports = {
  generalLimiter,
  authLimiter,
  apiLimiter,
  rateLimiterMiddleware,
  xssProtection,
  cspHeaders
};
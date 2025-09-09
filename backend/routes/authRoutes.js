const express = require('express');
const { registerUser, loginUser, verifyEmail, registerAdmin } = require('../controllers/authController');
const { authLimiter } = require('../middleware/securityMiddleware');

const router = express.Router();

// Apply rate limiting to authentication routes
router.use(authLimiter);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/verify/:token').get(verifyEmail);
router.route('/admin/register').post(registerAdmin);

module.exports = router;
const express = require('express');
const {
  registerUser,
  loginUser,
  verifyEmail,
  registerAdmin
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);
router.post('/admin/register', protect, admin, registerAdmin);

module.exports = router;
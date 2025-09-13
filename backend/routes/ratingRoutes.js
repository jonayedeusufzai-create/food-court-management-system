const express = require('express');
const { rateStall, getStallRatings, getUserRating } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Rate a stall
router.post('/rate', rateStall);

// Get all ratings for a stall
router.get('/stall/:stallId', getStallRatings);

// Get user's rating for a stall
router.get('/user/:stallId', getUserRating);

module.exports = router;
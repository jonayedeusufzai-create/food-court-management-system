const express = require('express');
const {
  getStalls,
  getStallById,
  createStall,
  updateStall,
  deleteStall,
  getMyStalls
} = require('../controllers/stallController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getStalls)
  .post(protect, admin, createStall);

router.route('/my').get(protect, getMyStalls);

router.route('/:id')
  .get(getStallById)
  .put(protect, admin, updateStall)
  .delete(protect, admin, deleteStall);

module.exports = router;
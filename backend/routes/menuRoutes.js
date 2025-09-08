const express = require('express');
const {
  getMenuByStall,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuByCategory
} = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createMenuItem);

router.route('/stall/:stallId')
  .get(getMenuByStall);

router.route('/category/:category')
  .get(getMenuByCategory);

router.route('/:id')
  .get(getMenuItemById)
  .put(protect, updateMenuItem)
  .delete(protect, deleteMenuItem);

module.exports = router;
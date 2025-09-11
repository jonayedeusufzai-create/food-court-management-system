const express = require('express');
const {
  getMenuItems,
  getMenuItemsByStall,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getMenuItems)
  .post(protect, createMenuItem);

router.route('/stall/:stallId')
  .get(getMenuItemsByStall);

router.route('/:id')
  .get(getMenuItemById)
  .put(protect, updateMenuItem)
  .delete(protect, deleteMenuItem);

module.exports = router;
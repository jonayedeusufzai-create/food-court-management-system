const MenuItem = require('../models/MenuItem');
const { body, validationResult } = require('express-validator');

// Validation middleware for creating/updating menu items
const validateMenuItem = [
  body('name')
    .notEmpty()
    .withMessage('Menu item name is required')
    .isLength({ min: 2 })
    .withMessage('Menu item name must be at least 2 characters long'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

// @desc    Get all menu items with pagination
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = { isActive: true };
    
    // Add stall filter if provided
    if (req.query.stall) {
      filter.stall = req.query.stall;
    }
    
    // Add category filter if provided
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Add search filter if provided
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }
    
    const totalItems = await MenuItem.countDocuments(filter);
    const menuItems = await MenuItem.find(filter)
      .populate('stall', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);
    
    res.json({
      menuItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get menu item by ID
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate('stall', 'name');
    
    if (menuItem) {
      res.json(menuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get menu items by stall with pagination
// @route   GET /api/menu/stall/:stallId
// @access  Public
const getMenuItemsByStall = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const totalItems = await MenuItem.countDocuments({ 
      stall: req.params.stallId,
      isActive: true 
    });
    
    const menuItems = await MenuItem.find({ 
      stall: req.params.stallId,
      isActive: true 
    })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);
    
    res.json({
      menuItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Private
const createMenuItem = [
  validateMenuItem,
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name, description, price, category, stock, image } = req.body;
      
      // Create menu item
      const menuItem = await MenuItem.create({
        name,
        description,
        price,
        stall: req.user._id, // This should be the stall ID, not user ID
        category,
        stock,
        image
      });
      
      res.status(201).json(menuItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private
const updateMenuItem = [
  validateMenuItem,
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name, description, price, category, stock, image, isActive } = req.body;
      
      const menuItem = await MenuItem.findById(req.params.id);
      
      if (menuItem) {
        // Check if user is authorized to update this menu item
        // This would require checking if the user owns the stall this item belongs to
        // For now, we'll allow any authenticated user to update
        
        menuItem.name = name || menuItem.name;
        menuItem.description = description || menuItem.description;
        menuItem.price = price || menuItem.price;
        menuItem.category = category || menuItem.category;
        menuItem.stock = stock !== undefined ? stock : menuItem.stock;
        menuItem.image = image || menuItem.image;
        menuItem.isActive = isActive !== undefined ? isActive : menuItem.isActive;
        
        const updatedMenuItem = await menuItem.save();
        res.json(updatedMenuItem);
      } else {
        res.status(404).json({ message: 'Menu item not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (menuItem) {
      // Check if user is authorized to delete this menu item
      // This would require checking if the user owns the stall this item belongs to
      // For now, we'll allow any authenticated user to delete
      
      await menuItem.remove();
      res.json({ message: 'Menu item removed' });
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  getMenuItemsByStall,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};
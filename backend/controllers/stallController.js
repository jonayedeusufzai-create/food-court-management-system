const Stall = require('../models/Stall');
const { body, validationResult } = require('express-validator');

// Validation middleware for creating/updating stalls
const validateStall = [
  body('name')
    .notEmpty()
    .withMessage('Stall name is required')
    .isLength({ min: 2 })
    .withMessage('Stall name must be at least 2 characters long'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  body('rent')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Rent must be a positive number')
];

// @desc    Get all stalls with pagination and advanced filtering
// @route   GET /api/stalls
// @access  Public
const getStalls = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = { isActive: true };
    
    // Add category filter if provided
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Add search filter if provided
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Add min/max rent filters
    if (req.query.minRent || req.query.maxRent) {
      filter.rent = {};
      if (req.query.minRent) {
        filter.rent.$gte = parseFloat(req.query.minRent);
      }
      if (req.query.maxRent) {
        filter.rent.$lte = parseFloat(req.query.maxRent);
      }
    }
    
    // Add sorting
    let sort = '-createdAt';
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'name':
          sort = 'name';
          break;
        case 'name_desc':
          sort = '-name';
          break;
        case 'rent':
          sort = 'rent';
          break;
        case 'rent_desc':
          sort = '-rent';
          break;
        case 'createdAt':
          sort = 'createdAt';
          break;
        default:
          sort = '-createdAt';
      }
    }
    
    const totalStalls = await Stall.countDocuments(filter);
    const stalls = await Stall.find(filter)
      .populate('owner', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    res.json({
      stalls,
      currentPage: page,
      totalPages: Math.ceil(totalStalls / limit),
      totalStalls,
      filters: {
        category: req.query.category || null,
        search: req.query.search || null,
        minRent: req.query.minRent || null,
        maxRent: req.query.maxRent || null,
        sort: req.query.sort || 'createdAt_desc'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stall by ID
// @route   GET /api/stalls/:id
// @access  Public
const getStallById = async (req, res) => {
  try {
    const stall = await Stall.findById(req.params.id).populate('owner', 'name email');
    
    if (stall) {
      res.json(stall);
    } else {
      res.status(404).json({ message: 'Stall not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new stall
// @route   POST /api/stalls
// @access  Private/Admin
const createStall = [
  validateStall,
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

      const { name, description, category, rent } = req.body;
      
      // Create stall
      const stall = await Stall.create({
        name,
        description,
        owner: req.user._id,
        category,
        rent
      });
      
      res.status(201).json(stall);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

// @desc    Update stall
// @route   PUT /api/stalls/:id
// @access  Private
const updateStall = [
  validateStall,
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

      const { name, description, category, rent, isActive } = req.body;
      
      const stall = await Stall.findById(req.params.id);
      
      if (stall) {
        // Check if user is authorized to update this stall
        if (stall.owner.toString() !== req.user._id.toString() && req.user.role !== 'FoodCourtOwner') {
          return res.status(401).json({ message: 'Not authorized to update this stall' });
        }
        
        stall.name = name || stall.name;
        stall.description = description || stall.description;
        stall.category = category || stall.category;
        stall.rent = rent || stall.rent;
        stall.isActive = isActive !== undefined ? isActive : stall.isActive;
        
        const updatedStall = await stall.save();
        res.json(updatedStall);
      } else {
        res.status(404).json({ message: 'Stall not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

// @desc    Delete stall
// @route   DELETE /api/stalls/:id
// @access  Private
const deleteStall = async (req, res) => {
  try {
    const stall = await Stall.findById(req.params.id);
    
    if (stall) {
      // Check if user is authorized to delete this stall
      if (stall.owner.toString() !== req.user._id.toString() && req.user.role !== 'FoodCourtOwner') {
        return res.status(401).json({ message: 'Not authorized to delete this stall' });
      }
      
      await stall.remove();
      res.json({ message: 'Stall removed' });
    } else {
      res.status(404).json({ message: 'Stall not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stalls owned by logged in user
// @route   GET /api/stalls/my
// @access  Private
const getMyStalls = async (req, res) => {
  try {
    const stalls = await Stall.find({ owner: req.user._id });
    res.json(stalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStalls,
  getStallById,
  createStall,
  updateStall,
  deleteStall,
  getMyStalls
};
const MenuItem = require('../models/MenuItem');
const Stall = require('../models/Stall');

// @desc    Get all menu items for a stall
// @route   GET /api/menu/stall/:stallId
// @access  Public
const getMenuByStall = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ 
      stall: req.params.stallId, 
      isActive: true 
    }).sort({ category: 1, name: 1 });
    
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (menuItem && menuItem.isActive) {
      res.json(menuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Private/StallOwner
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, stall, category, stock, preparationTime } = req.body;

    // Check if stall exists and user is owner
    const stallDoc = await Stall.findById(stall);
    if (!stallDoc) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    if (stallDoc.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to add items to this stall' });
    }

    const menuItem = new MenuItem({
      name,
      description,
      price,
      stall,
      category,
      stock,
      preparationTime
    });

    const createdMenuItem = await menuItem.save();
    res.status(201).json(createdMenuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/StallOwner
const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, stock, isActive, preparationTime } = req.body;

    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      // Check if user is owner of the stall
      const stall = await Stall.findById(menuItem.stall);
      if (!stall) {
        return res.status(404).json({ message: 'Stall not found' });
      }

      if (stall.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this menu item' });
      }

      menuItem.name = name || menuItem.name;
      menuItem.description = description || menuItem.description;
      menuItem.price = price || menuItem.price;
      menuItem.category = category || menuItem.category;
      menuItem.stock = stock !== undefined ? stock : menuItem.stock;
      menuItem.isActive = isActive !== undefined ? isActive : menuItem.isActive;
      menuItem.preparationTime = preparationTime || menuItem.preparationTime;

      const updatedMenuItem = await menuItem.save();
      res.json(updatedMenuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/StallOwner
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      // Check if user is owner of the stall
      const stall = await Stall.findById(menuItem.stall);
      if (!stall) {
        return res.status(404).json({ message: 'Stall not found' });
      }

      if (stall.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this menu item' });
      }

      await menuItem.remove();
      res.json({ message: 'Menu item removed' });
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get menu items by category
// @route   GET /api/menu/category/:category
// @access  Public
const getMenuByCategory = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ 
      category: req.params.category,
      isActive: true
    }).populate('stall', 'name');
    
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMenuByStall,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuByCategory
};
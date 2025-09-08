const Stall = require('../models/Stall');
const MenuItem = require('../models/MenuItem');

// @desc    Get all stalls
// @route   GET /api/stalls
// @access  Public
const getStalls = async (req, res) => {
  try {
    const stalls = await Stall.find({ isActive: true })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(stalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single stall
// @route   GET /api/stalls/:id
// @access  Public
const getStallById = async (req, res) => {
  try {
    const stall = await Stall.findById(req.params.id)
      .populate('owner', 'name email');
    
    if (stall && stall.isActive) {
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
const createStall = async (req, res) => {
  try {
    const { name, description, category, rent, location, contactInfo } = req.body;

    const stall = new Stall({
      name,
      description,
      owner: req.user._id,
      category,
      rent,
      location,
      contactInfo
    });

    const createdStall = await stall.save();
    res.status(201).json(createdStall);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update stall
// @route   PUT /api/stalls/:id
// @access  Private/Admin
const updateStall = async (req, res) => {
  try {
    const { name, description, category, rent, isActive, location, contactInfo } = req.body;

    const stall = await Stall.findById(req.params.id);

    if (stall) {
      // Check if user is owner or admin
      if (stall.owner.toString() !== req.user._id.toString() && 
          req.user.role !== 'FoodCourtOwner') {
        return res.status(401).json({ message: 'Not authorized to update this stall' });
      }

      stall.name = name || stall.name;
      stall.description = description || stall.description;
      stall.category = category || stall.category;
      stall.rent = rent || stall.rent;
      stall.isActive = isActive !== undefined ? isActive : stall.isActive;
      stall.location = location || stall.location;
      stall.contactInfo = contactInfo || stall.contactInfo;

      const updatedStall = await stall.save();
      res.json(updatedStall);
    } else {
      res.status(404).json({ message: 'Stall not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete stall
// @route   DELETE /api/stalls/:id
// @access  Private/Admin
const deleteStall = async (req, res) => {
  try {
    const stall = await Stall.findById(req.params.id);

    if (stall) {
      // Check if user is owner or admin
      if (stall.owner.toString() !== req.user._id.toString() && 
          req.user.role !== 'FoodCourtOwner') {
        return res.status(401).json({ message: 'Not authorized to delete this stall' });
      }

      // Also delete all menu items for this stall
      await MenuItem.deleteMany({ stall: stall._id });

      await stall.remove();
      res.json({ message: 'Stall removed' });
    } else {
      res.status(404).json({ message: 'Stall not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stalls by owner
// @route   GET /api/stalls/my
// @access  Private/StallOwner
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
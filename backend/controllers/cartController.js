const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.menuItem',
      populate: {
        path: 'stall',
        select: 'name'
      }
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], totalAmount: 0 });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;

    // Validate menu item
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem || !menuItem.isActive) {
      return res.status(404).json({ message: 'Menu item not found or unavailable' });
    }

    // Check stock
    if (menuItem.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock for this item' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.menuItem.toString() === menuItemId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        menuItem: menuItemId,
        quantity,
        price: menuItem.price
      });
    }

    // Calculate total amount
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + (item.quantity * item.price),
      0
    );

    const updatedCart = await cart.save();

    // Populate menu item and stall details
    await updatedCart.populate({
      path: 'items.menuItem',
      populate: {
        path: 'stall',
        select: 'name'
      }
    });

    res.status(201).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Validate menu item stock
    const menuItem = await MenuItem.findById(cart.items[itemIndex].menuItem);
    if (!menuItem || !menuItem.isActive) {
      return res.status(404).json({ message: 'Menu item not found or unavailable' });
    }

    if (menuItem.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock for this item' });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    // Calculate total amount
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + (item.quantity * item.price),
      0
    );

    const updatedCart = await cart.save();

    // Populate menu item and stall details
    await updatedCart.populate({
      path: 'items.menuItem',
      populate: {
        path: 'stall',
        select: 'name'
      }
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove item
    cart.items.splice(itemIndex, 1);

    // Calculate total amount
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + (item.quantity * item.price),
      0
    );

    const updatedCart = await cart.save();

    // Populate menu item and stall details
    await updatedCart.populate({
      path: 'items.menuItem',
      populate: {
        path: 'stall',
        select: 'name'
      }
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalAmount = 0;

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
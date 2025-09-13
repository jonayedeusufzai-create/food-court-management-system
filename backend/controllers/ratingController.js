const Rating = require('../models/Rating');
const Stall = require('../models/Stall');

// Add or update a rating for a stall
exports.rateStall = async (req, res) => {
  try {
    const { stallId, rating, comment } = req.body;
    const userId = req.user.id;

    // Validate rating value
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if stall exists
    const stall = await Stall.findById(stallId);
    if (!stall) {
      return res.status(404).json({
        success: false,
        message: 'Stall not found'
      });
    }

    // Check if user has already rated this stall
    let existingRating = await Rating.findOne({ user: userId, stall: stallId });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.comment = comment;
      await existingRating.save();
    } else {
      // Create new rating
      existingRating = new Rating({
        user: userId,
        stall: stallId,
        rating,
        comment
      });
      await existingRating.save();
    }

    // Calculate new average rating for the stall
    const ratings = await Rating.find({ stall: stallId });
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    // Update stall with new average rating
    stall.averageRating = averageRating;
    stall.totalRatings = ratings.length;
    await stall.save();

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      data: existingRating
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting rating',
      error: error.message
    });
  }
};

// Get all ratings for a specific stall
exports.getStallRatings = async (req, res) => {
  try {
    const { stallId } = req.params;
    
    // Check if stall exists
    const stall = await Stall.findById(stallId);
    if (!stall) {
      return res.status(404).json({
        success: false,
        message: 'Stall not found'
      });
    }

    const ratings = await Rating.find({ stall: stallId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: ratings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ratings',
      error: error.message
    });
  }
};

// Get user's rating for a specific stall
exports.getUserRating = async (req, res) => {
  try {
    const { stallId } = req.params;
    const userId = req.user.id;

    const rating = await Rating.findOne({ user: userId, stall: stallId });

    res.status(200).json({
      success: true,
      data: rating
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user rating',
      error: error.message
    });
  }
};
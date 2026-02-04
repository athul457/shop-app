const Review = require('../MODELS/reviewModel');
const asyncHandler = require('express-async-handler');

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
  res.status(200).json(reviews);
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;

  // Check if user already reviewed this product
  const alreadyReviewed = await Review.findOne({
    productId: productId.toString(), // Ensure string comparison
    userId: req.user.id
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = await Review.create({
    productId: productId.toString(),
    userId: req.user.id,
    userName: req.user.name,
    rating: Number(rating),
    comment
  });

  res.status(201).json(review);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner/Admin)
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Ensure user owns the review or is admin
  if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete this review');
  }

  await review.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getReviews,
  createReview,
  deleteReview
};

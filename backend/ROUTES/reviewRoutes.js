const express = require('express');
const router = express.Router();
const { getReviews, createReview, deleteReview } = require('../CONTROLLERS/reviewController');
const { protect } = require('../MIDDLEWARES/authMiddleware');

router.get('/:productId', getReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;

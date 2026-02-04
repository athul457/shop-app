const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: String, // Keeping as String to support both ObjectId and Dummy IDs (e.g. "1")
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);

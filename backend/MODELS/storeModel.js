const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  storeName: {
    type: String,
    required: [true, 'Please add a store name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  logo: {
    type: String, 
    default: ''
  },
  banner: {
    type: String, 
    default: ''
  },
  phone: {
      type: String,
      default: ''
  },
  address: {
      type: String,
      default: ''
  },
  email: {
      type: String,
      default: ''
  },
  followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }],
  featuredProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
  }],
  isApproved: {
    type: Boolean,
    default: true // Auto-approve for now based on context
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Store', storeSchema);

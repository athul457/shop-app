const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storeName: {
    type: String,
    required: [true, 'Please add a store name'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  logo: {
    type: String, // URL to the logo image
    default: ''
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Store', storeSchema);

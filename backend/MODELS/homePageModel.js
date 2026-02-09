const mongoose = require('mongoose');

const homePageSchema = new mongoose.Schema({
  heroSlides: [{
    title: String,
    desc: String,
    bg: String,
    image: String,
  }],
  features: [{
    icon: String, 
    title: String,
    desc: String
  }],
  offers: [{
      id: Number,
      code: String,
      value: Number,
      type: { type: String, enum: ['PERCENTAGE', 'FIXED'] }, // 'PERCENTAGE' or 'FIXED'
      validUntil: String
  }],
  categories: [{
    name: String,
    color: String,
    icon: String
  }],
  promotionalBanner: {
    title: String,
    subtitle: String,
    description: String,
    image: String,
    buttonText: String
  },
  bigDiscounts: {
    title: String,
    subtitle: String,
    category: String,
    count: Number
  },
  newArrivals: {
    title: String,
    subtitle: String,
    categories: [String], // Array of categories to include
    count: Number
  },
  bestSales: {
    title: String,
    subtitle: String,
    category: String,
    count: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('HomePage', homePageSchema);

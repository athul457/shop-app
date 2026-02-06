const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Product = require('../MODELS/productModel');
const User = require('../MODELS/userModel');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // Manual Auth Check for Public Route to allow Admin visibility
  let user = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, process.env.SECRET_KEY);
          user = await User.findById(decoded.id).select('-password');
      } catch (error) {
          // Token invalid or expired, treat as guest
          console.log("Optional auth failed:", error.message);
      }
  }

  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i',
    },
  } : {};
  
  let query = { ...keyword };

  // Logic:
  // 1. If Admin -> Show All (no isApproved filter)
  // 2. If Vendor querying their own -> Show All (isApproved check removed for own items)
  // 3. Everyone else -> isApproved = true

  const isAdmin = user && user.role === 'admin';
  const isVendorQueryingOwn = user && req.query.vendorId && req.query.vendorId === `vendor_${user._id}`; // simplified check

  if (!isAdmin) {
      // Default to approved only...
      query.isApproved = true;

      // ...Unless matching vendor ID (if implemented strictly)
      // For now, let's stick to the Admin requirement: Admin sees all.
      // Vendors usually use a different logic or route, but if they use this one:
      if (req.query.vendorId) {
           // Allow viewing own products regardless of approval?
           // The original logic had: if (req.user._id === req.query.vendorId) delete query.isApproved
           // Let's replicate that if needed, but for now focusing on Admin.
           if (user && (user._id.toString() === req.query.vendorId || `vendor_${user._id}` === req.query.vendorId)) {
               delete query.isApproved;
           }
      }
  }

  // Allow filtering by vendorId explicitly if passed
  if (req.query.vendorId) {
      query.vendorId = req.query.vendorId;
  }

  const products = await Product.find(query);
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    if (!product.isApproved && (!req.user || (req.user.role !== 'admin' && product.ownerId.toString() !== req.user._id.toString()))) {
        res.status(404);
        throw new Error('Product not found');
    }
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin or Owner)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Check permissions: Admin or Owner
    if (req.user.role !== 'admin' && product.ownerId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this product');
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin/Vendor
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, stock, vendorId, rating } = req.body;

  // Determine approval status
  const isAdmin = req.user.role === 'admin';
  const isApproved = isAdmin ? (req.body.isApproved !== undefined ? req.body.isApproved : true) : false;

  const product = new Product({
    name,
    price,
    description,
    image,
    category,
    stock,
    // Store original vendorId if provided, else format it
    vendorId: vendorId || (req.user.role === 'vendor' ? `vendor_${req.user._id}` : req.user._id),
    isApproved, 
    rating: rating || 0,
    ownerId: req.user._id
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin/Vendor
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, stock, vendorId, isApproved, rating } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // Check permissions
    if (req.user.role !== 'admin' && product.ownerId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this product');
    }

    product.name = name || product.name;
    product.price = price !== undefined ? price : product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.vendorId = vendorId || product.vendorId;
    
    // Only Admin can update approval status
    if (req.user.role === 'admin' && isApproved !== undefined) {
        product.isApproved = isApproved;
    }

    if (rating !== undefined) product.rating = rating;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};

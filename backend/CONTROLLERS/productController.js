const asyncHandler = require('express-async-handler');
const Product = require('../MODELS/productModel');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i',
    },
  } : {};
  
  // Optional: Filter by approval status if needed publicly
  // const products = await Product.find({ ...keyword, isApproved: true });
  const products = await Product.find({ ...keyword });
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  console.log('CONTROLLER: createProduct called');
  console.log('Request Body:', req.body);
  console.log('User:', req.user ? req.user._id : 'No User');

  const { name, price, description, image, category, stock, vendorId, isApproved, rating } = req.body;

  const product = new Product({
    name,
    price,
    description,
    image,
    category,
    stock,
    vendorId,
    isApproved: isApproved !== undefined ? isApproved : true,
    rating: rating || 0,
    ownerId: req.user._id
  });

  const createdProduct = await product.save();
  console.log('Product Created:', createdProduct._id);
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  console.log('CONTROLLER: updateProduct called for ID:', req.params.id);
  console.log('Update Data:', req.body);

  const { name, price, description, image, category, stock, vendorId, isApproved, rating } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price !== undefined ? price : product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.vendorId = vendorId || product.vendorId;
    
    if (isApproved !== undefined) product.isApproved = isApproved;
    if (rating !== undefined) product.rating = rating;

    const updatedProduct = await product.save();
    console.log('Product Updated:', updatedProduct._id);
    res.json(updatedProduct);
  } else {
    console.log('Product not found for update');
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

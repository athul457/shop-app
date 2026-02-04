const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
} = require('../CONTROLLERS/productController');
const { protect, authorize } = require('../MIDDLEWARES/authMiddleware');

router.route('/').get(getProducts).post(protect, authorize('admin', 'vendor'), createProduct);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, authorize('admin'), deleteProduct)
  .put(protect, authorize('admin', 'vendor'), updateProduct);

module.exports = router;

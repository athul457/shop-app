const express = require('express');
const router = express.Router();
const {
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  addAddress,
  deleteAddress
} = require('../CONTROLLERS/userController');
const { protect, authorize } = require('../MIDDLEWARES/authMiddleware');

router.route('/').get(protect, authorize('admin'), getUsers);
router
  .route('/:id')
  .delete(protect, authorize('admin'), deleteUser)
  .get(protect, authorize('admin'), getUserById)
  .put(protect, authorize('admin'), updateUser);

router.route('/address').post(protect, addAddress);
router.route('/address/:addressId').delete(protect, deleteAddress);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  requestReturnExchange,
  updateReturnExchangeStatus
} = require('../CONTROLLERS/orderController');
const { protect, authorize } = require('../MIDDLEWARES/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, authorize('admin'), getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, authorize('admin'), updateOrderToDelivered);
router.route('/:id/return').post(protect, requestReturnExchange);
router.route('/:id/return-status').put(protect, authorize('admin'), updateReturnExchangeStatus);

module.exports = router;

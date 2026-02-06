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
  updateReturnExchangeStatus,
  updateOrderStatus,
  handleCancelRequest
} = require('../CONTROLLERS/orderController');
const { protect, authorize } = require('../MIDDLEWARES/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, authorize('admin', 'vendor'), getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, authorize('admin', 'vendor'), updateOrderToDelivered);
router.route('/:id/return').post(protect, requestReturnExchange);
router.route('/:id/return-status').put(protect, authorize('admin', 'vendor', 'user'), updateReturnExchangeStatus);
router.route('/:id/status').put(protect, authorize('admin', 'vendor'), updateOrderStatus);
router.route('/:id/cancel').put(protect, handleCancelRequest);

module.exports = router;

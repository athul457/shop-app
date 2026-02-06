const asyncHandler = require('express-async-handler');
const Order = require('../MODELS/orderModel');
const Product = require('../MODELS/productModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    // Check and Update Stock
    for (const item of orderItems) {
      if (item.product) {
        const product = await Product.findById(item.product);
        if (product) {
          const qty = Number(item.quantity) || 0;
          product.stock = Math.max(0, product.stock - qty);
          await product.save();
        }
      }
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Request return or exchange
// @route   POST /api/orders/:id/return
// @access  Private
const requestReturnExchange = asyncHandler(async (req, res) => {
  const { itemId, type, reason } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    // Verify user owns order
    if (order.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to manage this order');
    }

    if (!order.isDelivered) {
       res.status(400);
       throw new Error('Order must be delivered to request return/exchange');
    }

    const item = order.orderItems.find(x => x._id.toString() === itemId);

    if (!item) {
      res.status(404);
      throw new Error('Item not found in order');
    }

    if (item.returnExchange.status !== 'none') {
      res.status(400);
      throw new Error('A request has already been made for this item');
    }

    item.returnExchange = {
      type,
      reason,
      status: 'pending',
      requestedAt: Date.now()
    };

    await order.save();
    res.json({ message: 'Request submitted successfully' });

  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update return/exchange status
// @route   PUT /api/orders/:id/return-status
// @access  Private/Admin
const updateReturnExchangeStatus = asyncHandler(async (req, res) => {
  const { itemId, status } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    const item = order.orderItems.find(x => x._id.toString() === itemId);

    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }

    item.returnExchange.status = status;
    
    await order.save();
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  requestReturnExchange,
  updateReturnExchangeStatus
};

const express = require('express');
const router = express.Router();
const {
    createOrUpdateStore,
    getStoreByVendor,
    getStoreById,
    followStore,
    unfollowStore
} = require('../CONTROLLERS/storeController');
const { protect, authorize } = require('../MIDDLEWARES/authMiddleware');

router.route('/')
    .post(protect, authorize('vendor'), createOrUpdateStore);

router.route('/vendor/:vendorId')
    .get(getStoreByVendor);

router.route('/:id')
    .get(getStoreById);

router.route('/:id/follow')
    .put(protect, followStore);

router.route('/:id/unfollow')
    .put(protect, unfollowStore);

module.exports = router;

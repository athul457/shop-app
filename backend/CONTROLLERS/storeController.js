const asyncHandler = require('express-async-handler');
const Store = require('../MODELS/storeModel');
const User = require('../MODELS/userModel');
const Product = require('../MODELS/productModel');

// @desc    Create or Update Store Profile
// @route   POST /api/stores
// @access  Private/Vendor
const createOrUpdateStore = asyncHandler(async (req, res) => {
    const { storeName, description, logo, banner, phone, address, featuredProducts } = req.body;
    
    // Check if store exists for this vendor
    let store = await Store.findOne({ vendorId: req.user._id });

    if (store) {
        // Update
        store.storeName = storeName || store.storeName;
        store.description = description || store.description;
        store.logo = logo || store.logo;
        store.banner = banner || store.banner;
        store.phone = phone || store.phone;
        store.address = address || store.address;
        store.email = req.user.email; // Keep email synced with user
        store.featuredProducts = featuredProducts || store.featuredProducts;

        const updatedStore = await store.save();
        res.json(updatedStore);
    } else {
        // Create
        store = await Store.create({
            vendorId: req.user._id,
            storeName,
            description,
            logo,
            banner,
            phone,
            address,
            email: req.user.email,
            featuredProducts
        });
        res.status(201).json(store);
    }
});

// @desc    Get Store by Vendor ID (Public)
// @route   GET /api/stores/vendor/:vendorId
// @access  Public
const getStoreByVendor = asyncHandler(async (req, res) => {
    const store = await Store.findOne({ vendorId: req.params.vendorId })
        .populate('featuredProducts', 'name price image rating');
    
    if (store) {
        res.json(store);
    } else {
        // Return basic info if no store profile created yet, or 404
        // For better UX, we might return a 'default' store object if the user is a vendor
        const vendor = await User.findById(req.params.vendorId);
        if(vendor && vendor.role === 'vendor') {
             res.json({
                 storeName: vendor.name + "'s Store",
                 description: "",
                 vendorId: vendor._id,
                 followers: [],
                 isDefault: true
             });
        } else {
            res.status(404);
            throw new Error('Store not found');
        }
    }
});

// @desc    Get Store by Store ID (Public)
// @route   GET /api/stores/:id
// @access  Public
// @desc    Get Store by Store ID (Public)
// @route   GET /api/stores/:id
// @access  Public
const getStoreById = asyncHandler(async (req, res) => {
    if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
        res.status(404);
        throw new Error('Store not found');
    }

    const store = await Store.findById(req.params.id)
        .populate('featuredProducts', 'name price image rating');
    
    if (store) {
        res.json(store);
    } else {
        res.status(404);
        throw new Error('Store not found');
    }
});

// @desc    Follow a Store
// @route   PUT /api/stores/:id/follow
// @access  Private
const followStore = asyncHandler(async (req, res) => {
    if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
        res.status(404);
        throw new Error('Store not found');
    }

    const store = await Store.findById(req.params.id);

    if (!store) {
        res.status(404);
        throw new Error('Store not found');
    }

    // Check if already following
    if (store.followers.includes(req.user._id)) {
        res.status(400);
        throw new Error('Already following this store');
    }

    store.followers.push(req.user._id);
    await store.save();

    res.json(store.followers);
});

// @desc    Unfollow a Store
// @route   PUT /api/stores/:id/unfollow
// @access  Private
const unfollowStore = asyncHandler(async (req, res) => {
    if (!require('mongoose').Types.ObjectId.isValid(req.params.id)) {
        res.status(404);
        throw new Error('Store not found');
    }

    const store = await Store.findById(req.params.id);

    if (!store) {
        res.status(404);
        throw new Error('Store not found');
    }

    store.followers = store.followers.filter(
        (followerId) => followerId.toString() !== req.user._id.toString()
    );
    
    await store.save();

    res.json(store.followers);
});

module.exports = {
    createOrUpdateStore,
    getStoreByVendor,
    getStoreById,
    followStore,
    unfollowStore
};

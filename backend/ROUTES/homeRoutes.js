const express = require('express');
const router = express.Router();
const { getHomePageConfig, updateHomePageConfig } = require('../CONTROLLERS/homePageController');
const { protect, authorize } = require('../MIDDLEWARES/authMiddleware');

router.route('/').get(getHomePageConfig).put(protect, authorize('admin'), updateHomePageConfig);

module.exports = router;

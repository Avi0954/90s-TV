const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createBanner,
    getBanners,
    updateBanner,
    deleteBanner
} = require('../controllers/adminBannerController');

// All admin banner routes are protected
router.use(protect);

router.route('/')
    .post(createBanner)
    .get(getBanners);

router.route('/:id')
    .put(updateBanner)
    .delete(deleteBanner);

module.exports = router;

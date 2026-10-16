const express = require('express');
const router = express.Router();
const {
    getChannels,
    getChannelBySlug,
    getShows,
    getShowsByChannel,
    getShowBySlug,
    getFeaturedShows,
    getFranchise,
    getActiveHeroBanner
} = require('../controllers/publicController');

router.get('/channels', getChannels);
router.get('/channels/:slug', getChannelBySlug);
router.get('/shows', getShows);
router.get('/shows/featured', getFeaturedShows);
router.get('/shows/channel/:slug', getShowsByChannel);
router.get('/shows/:slug', getShowBySlug);
router.get('/franchise/:name', getFranchise);
router.get('/hero-banner/active', getActiveHeroBanner);

module.exports = router;

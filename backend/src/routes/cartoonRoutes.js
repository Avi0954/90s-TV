const express = require('express');
const router = express.Router();
const {
    getChannels,
    getCategories,
    getCartoons,
    getCartoonById
} = require('../controllers/cartoonController');

router.get('/channels', getChannels);
router.get('/categories', getCategories);
router.get('/cartoons', getCartoons);
router.get('/cartoons/:id', getCartoonById);

module.exports = router;

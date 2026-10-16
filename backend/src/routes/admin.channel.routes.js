const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createChannel,
    getChannels,
    updateChannel,
    deleteChannel
} = require('../controllers/adminChannelController');

// All admin channel routes are protected
router.use(protect);

router.route('/')
    .post(createChannel)
    .get(getChannels);

router.route('/:id')
    .put(updateChannel)
    .delete(deleteChannel);

module.exports = router;

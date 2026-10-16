const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createShow,
    getShows,
    updateShow,
    deleteShow
} = require('../controllers/adminShowController');

// All admin show routes are protected
router.use(protect);

router.route('/')
    .post(createShow)
    .get(getShows);

router.route('/:id')
    .put(updateShow)
    .delete(deleteShow);

module.exports = router;

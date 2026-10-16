const Show = require('../models/Show');
const Channel = require('../models/Channel');

// @desc    Get all channels
// @route   GET /api/channels
exports.getChannels = async (req, res) => {
    try {
        const channels = await Channel.find().sort({ name: 1 });
        res.json(channels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all categories
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all cartoons with filtering
// @route   GET /api/cartoons
exports.getCartoons = async (req, res) => {
    try {
        const { channelId, category, era, genre, featured, search } = req.query;
        let query = {};

        if (channelId) query.channelId = channelId;
        if (category) query.category = category;
        if (era) query.era = era;
        if (genre) query.genre = genre;
        if (featured === 'true') query.featured = true;

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const cartoons = await Cartoon.find(query);
        res.json(cartoons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single cartoon by ID
// @route   GET /api/cartoons/:id
exports.getCartoonById = async (req, res) => {
    try {
        const cartoon = await Cartoon.findOne({ id: req.params.id });
        if (!cartoon) {
            return res.status(404).json({ message: 'Cartoon not found' });
        }
        res.json(cartoon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

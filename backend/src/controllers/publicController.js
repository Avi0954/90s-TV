const Channel = require('../models/Channel');
const Show = require('../models/Show');
const Banner = require('../models/Banner');

// @desc    Get all active channels
// @route   GET /api/channels
exports.getChannels = async (req, res) => {
    try {
        const channels = await Channel.find({ isActive: true }).sort({ name: 1 });
        res.json(channels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single channel by slug
// @route   GET /api/channels/:slug
exports.getChannelBySlug = async (req, res) => {
    try {
        const channel = await Channel.findOne({ slug: req.params.slug, isActive: true });
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        res.json(channel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all active shows
// @route   GET /api/shows
exports.getShows = async (req, res) => {
    try {
        const { slugs } = req.query;
        let query = { isActive: true };

        if (slugs) {
            query.slug = { $in: slugs.split(',') };
        }

        const shows = await Show.find(query)
            .populate('channel', 'name logo slug themeColor accentColor')
            .sort({ createdAt: -1 });
        res.json(shows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get shows for a specific channel
// @route   GET /api/shows/channel/:slug
exports.getShowsByChannel = async (req, res) => {
    try {
        const channel = await Channel.findOne({ slug: req.params.slug });
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        const shows = await Show.find({ channel: channel._id, isActive: true })
            .populate('channel', 'name logo slug themeColor accentColor')
            .sort({ createdAt: -1 });

        res.json(shows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single show by slug
// @route   GET /api/shows/:slug
exports.getShowBySlug = async (req, res) => {
    try {
        const show = await Show.findOne({ slug: req.params.slug, isActive: true })
            .populate('channel', 'name logo slug themeColor accentColor');

        if (!show) {
            return res.status(404).json({ message: 'Show not found' });
        }
        res.json(show);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get featured shows
// @route   GET /api/shows/featured
exports.getFeaturedShows = async (req, res) => {
    try {
        const shows = await Show.find({ isFeatured: true, isActive: true })
            .populate('channel', 'name logo slug themeColor accentColor')
            .sort({ createdAt: -1 })
            .limit(5);
        res.json(shows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get shows grouped by franchise and category
// @route   GET /api/franchise/:name
exports.getFranchise = async (req, res) => {
    try {
        const { name } = req.params;
        const shows = await Show.find({ franchise: name, isActive: true })
            .populate('channel', 'name logo slug themeColor accentColor')
            .sort({ createdAt: 1 });

        const result = {
            franchise: name,
            banner: shows.length > 0 ? shows[0].thumbnail : null,
            episodes: shows.filter(s => s.category === 'episode'),
            movies: shows.filter(s => s.category === 'movie'),
            songs: shows.filter(s => s.category === 'song'),
            specials: shows.filter(s => s.category === 'special')
        };

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active hero banner
// @route   GET /api/hero-banner/active
exports.getActiveHeroBanner = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true })
            .populate('show', 'title slug description')
            .sort({ order: 1 })
            .lean();

        if (!banners || banners.length === 0) {
            return res.status(404).json({ message: 'No active banner found' });
        }
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

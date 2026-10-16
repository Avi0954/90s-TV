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
        const slug = String(req.params.slug || '').trim().toLowerCase();
        const channel = await Channel.findOne({ slug, isActive: true });
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        res.json(channel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all active shows with search and filtering
// @route   GET /api/shows
exports.getShows = async (req, res) => {
    try {
        const { slugs, channelSlug, search, genre, franchise, era, category } = req.query;
        let query = { isActive: true };

        if (slugs && typeof slugs === 'string') {
            const slugList = slugs.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
            if (slugList.length > 0) {
                query.slug = { $in: slugList };
            }
        }

        if (channelSlug && typeof channelSlug === 'string') {
            const channel = await Channel.findOne({ slug: channelSlug.trim().toLowerCase() });
            if (channel) {
                query.channel = channel._id;
            }
        }

        if (genre && typeof genre === 'string' && genre.trim()) {
            query.genre = { $regex: new RegExp(`^${genre.trim()}$`, 'i') };
        }

        if (franchise && typeof franchise === 'string' && franchise.trim()) {
            query.franchise = { $regex: new RegExp(`^${franchise.trim()}$`, 'i') };
        }

        if (era && typeof era === 'string' && era.trim()) {
            query.era = era.trim();
        }

        if (category && typeof category === 'string' && category.trim()) {
            query.category = category.trim().toLowerCase();
        }

        if (search && typeof search === 'string' && search.trim()) {
            const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const searchRegex = new RegExp(escaped, 'i');
            query.$or = [
                { title: searchRegex },
                { franchise: searchRegex },
                { genre: searchRegex },
                { description: searchRegex }
            ];
        }

        const sortOption = franchise ? { season: 1, episodeNumber: 1, createdAt: 1 } : { createdAt: -1 };

        const shows = await Show.find(query)
            .populate('channel', 'name logo slug themeColor accentColor')
            .sort(sortOption);
        res.json(shows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get shows for a specific channel
// @route   GET /api/shows/channel/:slug
exports.getShowsByChannel = async (req, res) => {
    try {
        const slug = String(req.params.slug || '').trim().toLowerCase();
        const channel = await Channel.findOne({ slug });
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
        const slug = String(req.params.slug || '').trim().toLowerCase();
        const show = await Show.findOne({ slug, isActive: true })
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
            .limit(10);
        res.json(shows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get shows grouped by franchise and category
// @route   GET /api/franchise/:name
exports.getFranchise = async (req, res) => {
    try {
        const franchiseName = String(req.params.name || '').trim();
        const shows = await Show.find({ franchise: franchiseName, isActive: true })
            .populate('channel', 'name logo slug themeColor accentColor')
            .sort({ createdAt: 1 });

        const result = {
            franchise: franchiseName,
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
            .populate('show', 'title slug description thumbnail')
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

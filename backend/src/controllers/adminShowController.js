const mongoose = require('mongoose');
const Show = require('../models/Show');
const Channel = require('../models/Channel');
const Banner = require('../models/Banner');
const { convertToEmbedUrl } = require('../utils/youtubeHelper');

// @desc    Create a new show
// @route   POST /api/admin/shows
exports.createShow = async (req, res) => {
    try {
        const {
            title,
            slug,
            thumbnail,
            era,
            genre,
            characters,
            season,
            episodeNumber,
            duration,
            channel,
            description,
            videoUrl,
            isFeatured,
            isActive,
            franchise,
            category
        } = req.body || {};

        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ message: 'Show title is required' });
        }

        if (!slug || typeof slug !== 'string' || !slug.trim()) {
            return res.status(400).json({ message: 'Show slug is required' });
        }

        if (!channel || !mongoose.Types.ObjectId.isValid(channel)) {
            return res.status(400).json({ message: 'Valid Channel ID is required' });
        }

        const channelExists = await Channel.findById(channel);
        if (!channelExists) {
            return res.status(400).json({ message: 'The referenced channel does not exist' });
        }

        const validCategories = ['episode', 'movie', 'song', 'special'];
        const chosenCategory = category && validCategories.includes(category) ? category : 'episode';

        const show = await Show.create({
            title: title.trim(),
            slug: slug.trim().toLowerCase(),
            thumbnail: thumbnail ? thumbnail.trim() : '',
            era: era || '90s',
            genre: genre || '',
            characters: Array.isArray(characters) ? characters : [],
            season: Number.isInteger(Number(season)) && Number(season) > 0 ? Number(season) : 1,
            episodeNumber: Number.isInteger(Number(episodeNumber)) && Number(episodeNumber) > 0 ? Number(episodeNumber) : 1,
            duration: duration ? String(duration).trim() : '22m',
            channel,
            description: description ? description.trim() : '',
            videoUrl: convertToEmbedUrl(videoUrl),
            isFeatured: Boolean(isFeatured),
            isActive: typeof isActive === 'boolean' ? isActive : true,
            franchise: franchise ? franchise.trim() : '',
            category: chosenCategory
        });

        res.status(201).json(show);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Show slug must be unique' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all shows
// @route   GET /api/admin/shows
exports.getShows = async (req, res) => {
    try {
        const shows = await Show.find()
            .populate('channel', 'name logo slug themeColor')
            .sort({ createdAt: -1 });
        res.json(shows);
    } catch (error) {
        console.error('Get Shows Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a show
// @route   PUT /api/admin/shows/:id
exports.updateShow = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid show ID format' });
        }

        const updateData = { ...req.body };

        if (updateData.slug) {
            updateData.slug = updateData.slug.trim().toLowerCase();
        }

        if (updateData.channel) {
            if (!mongoose.Types.ObjectId.isValid(updateData.channel)) {
                return res.status(400).json({ message: 'Invalid Channel ID format' });
            }
            const channelExists = await Channel.findById(updateData.channel);
            if (!channelExists) {
                return res.status(400).json({ message: 'The referenced channel does not exist' });
            }
        }

        if (updateData.videoUrl) {
            updateData.videoUrl = convertToEmbedUrl(updateData.videoUrl);
        }

        const show = await Show.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('channel', 'name logo slug themeColor');

        if (!show) {
            return res.status(404).json({ message: 'Show not found' });
        }

        res.json(show);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Show slug must be unique' });
        }
        console.error('Update Show Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a show
// @route   DELETE /api/admin/shows/:id
exports.deleteShow = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid show ID format' });
        }

        // Remove any banners referencing this show to avoid dangling references
        await Banner.deleteMany({ show: req.params.id });

        const show = await Show.findByIdAndDelete(req.params.id);

        if (!show) {
            return res.status(404).json({ message: 'Show not found' });
        }

        res.json({ message: 'Show removed successfully' });
    } catch (error) {
        console.error('Delete Show Error:', error);
        res.status(500).json({ message: error.message });
    }
};

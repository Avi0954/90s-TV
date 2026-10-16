const Show = require('../models/Show');
const { convertToEmbedUrl } = require('../utils/youtubeHelper');

// @desc    Create a new show
// @route   POST /api/admin/shows
exports.createShow = async (req, res) => {
    try {
        const { title, slug, thumbnail, era, channel, description, videoUrl, isFeatured, isActive, franchise, category } = req.body;

        if (!title || !slug || !channel) {
            return res.status(400).json({ message: 'Title, Slug, and Channel (ID) are required' });
        }

        const show = await Show.create({
            title,
            slug,
            thumbnail,
            era,
            channel,
            description,
            videoUrl: convertToEmbedUrl(videoUrl),
            isFeatured,
            isActive,
            franchise,
            category
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
        const shows = await Show.find().populate('channel', 'name logo').sort({ createdAt: -1 });
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
        const updateData = { ...req.body };
        if (updateData.videoUrl) {
            updateData.videoUrl = convertToEmbedUrl(updateData.videoUrl);
        }

        const show = await Show.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('channel', 'name logo');

        if (!show) {
            return res.status(404).json({ message: 'Show not found' });
        }

        res.json(show);
    } catch (error) {
        console.error('Update Show Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a show
// @route   DELETE /api/admin/shows/:id
exports.deleteShow = async (req, res) => {
    try {
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

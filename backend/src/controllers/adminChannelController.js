const mongoose = require('mongoose');
const Channel = require('../models/Channel');
const Show = require('../models/Show');

// @desc    Create a new channel
// @route   POST /api/admin/channels
exports.createChannel = async (req, res) => {
    try {
        const { name, slug, description, logo, themeColor, accentColor, type, isActive } = req.body || {};

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: 'Channel name is required' });
        }

        if (!slug || typeof slug !== 'string' || !slug.trim()) {
            return res.status(400).json({ message: 'Channel slug is required' });
        }

        const channel = await Channel.create({
            name: name.trim(),
            slug: slug.trim().toLowerCase(),
            description: description ? description.trim() : '',
            logo: logo ? logo.trim() : '',
            themeColor: themeColor || '#ffffff',
            accentColor: accentColor || '#ffffff',
            type: type || 'Cartoon',
            isActive: typeof isActive === 'boolean' ? isActive : true
        });

        res.status(201).json(channel);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Channel slug must be unique' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all channels
// @route   GET /api/admin/channels
exports.getChannels = async (req, res) => {
    try {
        const channels = await Channel.find().sort({ createdAt: -1 });
        res.json(channels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a channel
// @route   PUT /api/admin/channels/:id
exports.updateChannel = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid channel ID format' });
        }

        const updateData = { ...req.body };
        if (updateData.slug) {
            updateData.slug = updateData.slug.trim().toLowerCase();
        }

        const channel = await Channel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        res.json(channel);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Channel slug must be unique' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a channel
// @route   DELETE /api/admin/channels/:id
exports.deleteChannel = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid channel ID format' });
        }

        // Prevent dangling show references
        const linkedShowsCount = await Show.countDocuments({ channel: req.params.id });
        if (linkedShowsCount > 0) {
            return res.status(400).json({
                message: `Cannot delete channel: ${linkedShowsCount} shows are linked to this channel. Reassign or delete these shows first.`
            });
        }

        const channel = await Channel.findByIdAndDelete(req.params.id);

        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        res.json({ message: 'Channel removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Channel = require('../models/Channel');

// @desc    Create a new channel
// @route   POST /api/admin/channels
exports.createChannel = async (req, res) => {
    try {
        const { name, slug, description, logo, themeColor, isActive } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ message: 'Name and Slug are required' });
        }

        const channel = await Channel.create({
            name,
            slug,
            description,
            logo,
            themeColor,
            isActive
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
        const channel = await Channel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        res.json(channel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a channel
// @route   DELETE /api/admin/channels/:id
exports.deleteChannel = async (req, res) => {
    try {
        const channel = await Channel.findByIdAndDelete(req.params.id);

        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        res.json({ message: 'Channel removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

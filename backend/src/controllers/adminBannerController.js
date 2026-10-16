const mongoose = require('mongoose');
const Banner = require('../models/Banner');
const Show = require('../models/Show');

// @desc    Create a new hero banner
// @route   POST /api/admin/banners
// @access  Protect (Admin)
exports.createBanner = async (req, res) => {
    try {
        const { show, bannerImage, tagline, ctaText, isActive, order } = req.body || {};

        if (!show || !mongoose.Types.ObjectId.isValid(show)) {
            return res.status(400).json({ message: 'Valid associated Show ID is required' });
        }

        const showExists = await Show.findById(show);
        if (!showExists) {
            return res.status(400).json({ message: 'Referenced show does not exist' });
        }

        if (!bannerImage || typeof bannerImage !== 'string' || !bannerImage.trim()) {
            return res.status(400).json({ message: 'Banner image URL is required' });
        }

        if (!tagline || typeof tagline !== 'string' || !tagline.trim()) {
            return res.status(400).json({ message: 'Tagline is required' });
        }

        const banner = await Banner.create({
            show,
            bannerImage: bannerImage.trim(),
            tagline: tagline.trim(),
            ctaText: ctaText ? ctaText.trim() : 'Watch Now',
            isActive: Boolean(isActive),
            order: Number.isInteger(Number(order)) ? Number(order) : 0
        });

        const populatedBanner = await Banner.findById(banner._id).populate('show', 'title slug');
        res.status(201).json(populatedBanner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get all hero banners
// @route   GET /api/admin/banners
// @access  Protect (Admin)
exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.find().populate('show', 'title slug').sort({ order: 1 });
        res.status(200).json(banners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update a hero banner
// @route   PUT /api/admin/banners/:id
// @access  Protect (Admin)
exports.updateBanner = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid banner ID format' });
        }

        if (req.body.show) {
            if (!mongoose.Types.ObjectId.isValid(req.body.show)) {
                return res.status(400).json({ message: 'Invalid Show ID format' });
            }
            const showExists = await Show.findById(req.body.show);
            if (!showExists) {
                return res.status(400).json({ message: 'Referenced show does not exist' });
            }
        }

        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('show', 'title slug');

        if (!banner) return res.status(404).json({ message: 'Banner not found' });

        res.status(200).json(banner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Delete a hero banner
// @route   DELETE /api/admin/banners/:id
// @access  Protect (Admin)
exports.deleteBanner = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid banner ID format' });
        }

        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });

        res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

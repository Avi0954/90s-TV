const Banner = require('../models/Banner');

// @desc    Create a new hero banner
// @route   POST /api/admin/banners
// @access  Protect (Admin)
exports.createBanner = async (req, res) => {
    try {
        const { isActive } = req.body;

        const banner = new Banner({
            show: req.body.show,
            bannerImage: req.body.bannerImage,
            tagline: req.body.tagline,
            ctaText: req.body.ctaText || 'Watch Now',
            isActive,
            order: req.body.order
        });

        const createdBanner = await banner.save();
        res.status(201).json(createdBanner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get all hero banners
// @route   GET /api/admin/banners
// @access  Protect (Admin) - and maybe public too if not protected on public route
exports.getBanners = async (req, res) => {
    try {
        // Find and sort by order number
        const banners = await Banner.find().populate('show', 'title').sort({ order: 1 });
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
        const { isActive } = req.body;

        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('show', 'title');

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
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });

        res.status(200).json({ message: 'Banner deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

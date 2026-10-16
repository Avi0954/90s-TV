const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    show: {
        type: mongoose.Schema.ObjectId,
        ref: 'Show',
        required: [true, 'Associated show is required']
    },
    bannerImage: {
        type: String,
        required: [true, 'Please provide a banner image URL'],
        trim: true
    },
    tagline: {
        type: String,
        required: [true, 'Please provide a tagline'],
        trim: true
    },
    ctaText: {
        type: String,
        default: 'Watch Now',
        trim: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

bannerSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('Banner', bannerSchema);

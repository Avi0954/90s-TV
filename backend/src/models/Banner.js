const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    show: {
        type: mongoose.Schema.ObjectId,
        ref: 'Show',
        required: true
    },
    bannerImage: {
        type: String,
        required: [true, 'Please provide a banner image URL']
    },
    tagline: {
        type: String,
        required: [true, 'Please provide a tagline']
    },
    ctaText: {
        type: String,
        default: 'Watch Now'
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

module.exports = mongoose.model('Banner', bannerSchema);

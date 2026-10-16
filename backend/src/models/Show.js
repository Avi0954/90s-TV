const mongoose = require('mongoose');
const { convertToEmbedUrl } = require('../utils/youtubeHelper');

const showSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    thumbnail: {
        type: String
    },
    era: {
        type: String
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
    },
    description: {
        type: String
    },
    videoUrl: {
        type: String
    },
    franchise: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        enum: ['episode', 'movie', 'song', 'special'],
        default: 'episode'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hooks removed

module.exports = mongoose.model('Show', showSchema);


const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Show title is required'],
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'Show slug is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    thumbnail: {
        type: String,
        default: ''
    },
    era: {
        type: String,
        default: '90s'
    },
    genre: {
        type: String,
        default: ''
    },
    characters: {
        type: [String],
        default: []
    },
    season: {
        type: Number,
        default: 1
    },
    episodeNumber: {
        type: Number,
        default: 1
    },
    duration: {
        type: String,
        default: '22m'
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: [true, 'Channel reference is required']
    },
    description: {
        type: String,
        default: ''
    },
    videoUrl: {
        type: String,
        default: ''
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

// Indexes for performance optimization on frequent queries
showSchema.index({ channel: 1, isActive: 1 });
showSchema.index({ franchise: 1, isActive: 1 });
showSchema.index({ franchise: 1, season: 1, episodeNumber: 1 });
showSchema.index({ isFeatured: 1, isActive: 1 });
showSchema.index({ category: 1, isActive: 1 });
showSchema.index({ genre: 1, isActive: 1 });

module.exports = mongoose.model('Show', showSchema);

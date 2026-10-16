const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Channel name is required'],
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'Channel slug is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        default: ''
    },
    logo: {
        type: String,
        default: ''
    },
    themeColor: {
        type: String,
        default: '#ffffff'
    },
    accentColor: {
        type: String,
        default: '#ffffff'
    },
    type: {
        type: String,
        enum: ['Cartoon', 'IndianTV', 'Main', 'Optional'],
        default: 'Cartoon',
        set: (val) => {
            if (!val) return 'Cartoon';
            const normalized = String(val).trim();
            if (normalized.toLowerCase() === 'main') return 'Cartoon';
            if (normalized.toLowerCase() === 'optional') return 'IndianTV';
            return normalized;
        }
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

channelSchema.index({ isActive: 1, name: 1 });
channelSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Channel', channelSchema);

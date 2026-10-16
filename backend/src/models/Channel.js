const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    logo: {
        type: String
    },
    themeColor: {
        type: String
    },
    accentColor: {
        type: String
    },
    type: {
        type: String,
        enum: ['Cartoon', 'IndianTV'],
        default: 'Cartoon'
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

module.exports = mongoose.model('Channel', channelSchema);

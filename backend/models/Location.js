const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    accuracy: Number,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Auto-delete old locations after 7 days
locationSchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model('Location', locationSchema);
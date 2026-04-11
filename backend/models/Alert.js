const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['fall', 'panic', 'geofence', 'no_response', 'medical'],
        required: true
    },
    location: {
        lat: Number,
        lng: Number,
        address: String
    },
    status: {
        type: String,
        enum: ['active', 'acknowledged', 'resolved', 'false_alarm'],
        default: 'active'
    },
    acknowledgedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    acknowledgedAt: Date,
    resolvedAt: Date,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Alert', alertSchema);
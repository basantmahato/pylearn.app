const mongoose = require('mongoose');

const DeviceTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    platform: {
        type: String,
        enum: ['android', 'unknown'],
        default: 'android'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 90 // Auto-expire tokens after 90 days of inactivity
    }
});

module.exports = mongoose.model('DeviceToken', DeviceTokenSchema);

const mongoose = require('mongoose');

const NotificationConfigSchema = new mongoose.Schema({
    automationEnabled: {
        type: Boolean,
        default: false
    },
    timezone: {
        type: String,
        default: 'Asia/Kolkata'
    }
}, { timestamps: true });

module.exports = mongoose.model('NotificationConfig', NotificationConfigSchema);

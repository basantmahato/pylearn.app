const DeviceToken = require('../models/DeviceToken');
const NotificationConfig = require('../models/NotificationConfig');
const { Expo } = require('expo-server-sdk');

// Initialize Expo SDK client
const expo = new Expo();

/**
 * Core Push Notification Sending Logic (Reused by REST API and Cron Scheduler)
 */
const sendPushNotificationHelper = async ({ title, body, data }) => {
    // 1. Fetch all registered device tokens
    const devices = await DeviceToken.find();
    if (devices.length === 0) {
        return { success: false, msg: 'No registered Android devices found', sent: 0, total: 0 };
    }

    // 2. Prepare notifications array
    const messages = [];
    for (const device of devices) {
        if (!Expo.isExpoPushToken(device.token)) {
            console.warn(`Invalid Expo Push Token found: ${device.token}`);
            continue;
        }

        messages.push({
            to: device.token,
            sound: 'default',
            title,
            body,
            channelId: 'default', // matches Android notification channel
            data: data || {}, // Custom payload
        });
    }

    // 3. Batch messages using Expo Server SDK (maximum 100 per request)
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error('Error sending notification chunk:', error);
        }
    }

    // 4. Cleanup expired/unregistered tokens
    for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];
        if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
            // Device no longer accepts notifications, remove it
            await DeviceToken.deleteOne({ token: messages[i].to });
            console.log(`Cleaned up inactive token: ${messages[i].to}`);
        }
    }

    return {
        success: true,
        sent: tickets.length,
        total: devices.length
    };
};

/**
 * Register a device token
 * POST /api/v1/devices/register
 */
exports.registerDeviceToken = async (req, res) => {
    try {
        const { token, platform } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, msg: 'Token is required' });
        }

        // Verify that token is a valid Expo push token
        if (!Expo.isExpoPushToken(token)) {
            return res.status(400).json({ success: false, msg: 'Invalid Expo push token' });
        }

        // Find existing or save new device token
        await DeviceToken.findOneAndUpdate(
            { token },
            { token, platform: platform || 'android', createdAt: new Date() },
            { upsert: true, new: true }
        );

        res.status(200).json({ success: true, msg: 'Android device registered successfully' });
    } catch (err) {
        console.error('Error registering token:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

/**
 * Send Notification to All Registered Android Devices (Admin Protected REST Endpoint)
 * POST /api/v1/admin/notifications/send
 */
exports.sendPushNotification = async (req, res) => {
    try {
        const { title, body, data } = req.body;

        if (!title || !body) {
            return res.status(400).json({ success: false, msg: 'Title and body are required' });
        }

        const result = await sendPushNotificationHelper({ title, body, data });

        if (!result.success) {
            return res.status(404).json(result);
        }

        res.json({
            success: true,
            msg: `Notifications sent successfully to ${result.sent} Android devices`,
            stats: { total: result.total, sent: result.sent }
        });
    } catch (err) {
        console.error('Error sending notifications:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

/**
 * Get Notification Automation Settings Config
 * GET /api/v1/admin/notifications/config
 */
exports.getNotificationConfig = async (req, res) => {
    try {
        let config = await NotificationConfig.findOne();
        if (!config) {
            config = new NotificationConfig();
            await config.save();
        }
        res.json({ success: true, config });
    } catch (err) {
        console.error('Error fetching notification config:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

/**
 * Update Notification Automation Settings Config
 * POST /api/v1/admin/notifications/config
 */
exports.updateNotificationConfig = async (req, res) => {
    try {
        const { automationEnabled } = req.body;

        let config = await NotificationConfig.findOne();
        if (!config) {
            config = new NotificationConfig({ automationEnabled });
        } else {
            config.automationEnabled = automationEnabled;
        }

        await config.save();
        res.json({
            success: true,
            config,
            msg: `Notification automation ${automationEnabled ? 'enabled' : 'disabled'} successfully`
        });
    } catch (err) {
        console.error('Error updating notification config:', err);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

// Export sending helper so it can be imported by scheduler
exports.sendPushNotificationHelper = sendPushNotificationHelper;


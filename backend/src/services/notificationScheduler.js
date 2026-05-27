const cron = require('node-cron');
const NotificationConfig = require('../models/NotificationConfig');
const { sendPushNotificationHelper } = require('../controllers/notificationController');

// ── Premade Notification Templates ─────────────────────────────────────────
const TEMPLATES = {
    continueLearning: [
        {
            title: 'Continue Your Python Journey 🐍',
            body: 'Your next Python lesson is waiting. Pick up where you left off and keep building your skills!'
        },
        {
            title: 'Ready for the Next Chapter? 🚀',
            body: 'Unlock the next Python concept and level up your coding knowledge today.'
        },
        {
            title: "Don't Break the Flow 🔥",
            body: "You're making progress in Python. Continue learning and stay consistent."
        },
        {
            title: 'One More Lesson Today 📘',
            body: 'Just 10 minutes of Python practice can sharpen your coding skills. Continue now!'
        },
        {
            title: 'Your Coding Session Awaits 💻',
            body: 'Jump back into Python and keep moving toward mastery.'
        }
    ],
    dailyPractice: [
        {
            title: 'Practice Python Daily ⚡',
            body: "Small daily practice leads to big coding improvements. Start today's session now."
        },
        {
            title: 'Time to Code 🧠',
            body: 'Your daily Python practice is ready. Write code, solve problems, improve faster.'
        },
        {
            title: 'Daily Python Challenge 🎯',
            body: "Complete today's coding practice and strengthen your programming logic."
        },
        {
            title: 'Consistency Builds Coders 🔁',
            body: 'Practice Python every day and become confident with real coding skills.'
        },
        {
            title: '15 Minutes of Python Today? ⏳',
            body: 'A quick practice session today can boost your coding streak and confidence.'
        }
    ],
    streakEngagement: [
        {
            title: 'Your Streak Is Incomplete 🔥',
            body: "You're close to maintaining your learning streak. Complete today's lesson now!"
        },
        {
            title: "Don't Lose Your Streak ⚠️",
            body: 'Your Python streak is active. Finish one lesson today to keep it alive.'
        },
        {
            title: 'Streak Alert 🚨',
            body: 'A quick Python session today will protect your learning streak.'
        },
        {
            title: 'Keep the Momentum Going 💪',
            body: "You've been learning consistently. Don't stop now — continue your Python journey."
        },
        {
            title: 'Future Developer in Progress 👨‍💻',
            body: 'Every day you practice Python, you move one step closer to becoming a better developer.'
        }
    ]
};

// Helper function to pick a random item from an array
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to process and send automated notifications
const triggerAutomatedNotification = async (categoryKey, categoryName) => {
    try {
        // Fetch current configuration
        let config = await NotificationConfig.findOne();
        if (!config) {
            config = new NotificationConfig();
            await config.save();
        }

        // If automation is disabled, skip sending
        if (!config.automationEnabled) {
            console.log(`[Scheduler] [${new Date().toLocaleTimeString()}] Skipping scheduled "${categoryName}" notifications: Automation is toggled off.`);
            return;
        }

        // Select random template
        const templates = TEMPLATES[categoryKey];
        const selectedTemplate = getRandomItem(templates);

        console.log(`[Scheduler] [${new Date().toLocaleTimeString()}] Triggering automated broadcast: "${categoryName}"`);
        console.log(` - Selected template: "${selectedTemplate.title}"`);

        const result = await sendPushNotificationHelper({
            title: selectedTemplate.title,
            body: selectedTemplate.body,
            data: { type: 'automated', category: categoryKey }
        });

        console.log(`[Scheduler] Automated broadcast result: success=${result.success}, sent=${result.sent}, total=${result.total}`);
    } catch (error) {
        console.error(`[Scheduler] Error triggering automated notification for ${categoryName}:`, error);
    }
};

// Initialize Scheduler Schedules
const initScheduler = () => {
    console.log('[Scheduler] Initializing automated push notification schedules...');

    const TZ = 'Asia/Kolkata';

    // 1. Morning Motivation (9:00 AM Daily) -> Continue Learning
    cron.schedule('0 9 * * *', () => {
        triggerAutomatedNotification('continueLearning', 'Continue Learning');
    }, {
        scheduled: true,
        timezone: TZ
    });

    // 2. Afternoon Practice (1:00 PM Daily) -> Daily Practice
    cron.schedule('0 13 * * *', () => {
        triggerAutomatedNotification('dailyPractice', 'Daily Practice');
    }, {
        scheduled: true,
        timezone: TZ
    });

    // 3. Evening Streak Reminder (7:00 PM Daily) -> Streak & Engagement
    cron.schedule('0 19 * * *', () => {
        triggerAutomatedNotification('streakEngagement', 'Streak & Engagement');
    }, {
        scheduled: true,
        timezone: TZ
    });

    console.log('[Scheduler] Automation schedules active:');
    console.log(' - 🕘 09:00 AM Daily (IST) -> Continue Learning');
    console.log(' - 🕐 01:00 PM Daily (IST) -> Daily Practice');
    console.log(' - 🕖 07:00 PM Daily (IST) -> Streak & Engagement');
};

module.exports = { initScheduler };

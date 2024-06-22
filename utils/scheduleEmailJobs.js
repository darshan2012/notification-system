const cron = require('node-cron');
const User = require('../models/userModel');
const NotificationLog = require('../models/notificationLogModel');
const sendEmail = require('./sendEmail');
const cronJobs = require('./cronJobs');

const scheduleJob = (userId, frequency, time) => {
    const [hour, minute] = time.split(':');

    let cronTime;
    switch (frequency) {
        case 'daily':
            cronTime = `${minute} ${hour} * * *`;
            break;
        case 'weekly':
            cronTime = `${minute} ${hour} * * 0`;  // Every Sunday
            break;
        case 'monthly':
            cronTime = `${minute} ${hour} 1 * *`;  // First day of the month
            break;
        default:
            throw new Error('Invalid frequency');
    }

    return cron.schedule(cronTime, async () => {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');
            
            await sendEmail(user.email, 'Your Notification', 'This is your scheduled notification');
            await NotificationLog.create({ userId: user._id, sentAt: new Date(), status: 'success' });
        } catch (error) {
            await NotificationLog.create({ userId, sentAt: new Date(), status: 'failure', message: error.message });
        }
    });
};

const initializeJobs = async () => {
    const users = await User.find();

    users.forEach(user => {
        const { frequency, time } = user.notificationSettings;
        cronJobs[user._id] = scheduleJob(user._id, frequency, time);
    });
};

module.exports = { scheduleJob, initializeJobs };

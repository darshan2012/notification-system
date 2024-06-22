const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    notificationSettings: {
        frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
        time: { type: String, default: '08:00' }  // time in HH:MM format
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

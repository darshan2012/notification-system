const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationLogSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sentAt: { type: Date, required: true },
    status: { type: String, enum: ['success', 'failure'], default: 'success' },
    message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('NotificationLog', notificationLogSchema);

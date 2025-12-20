const mongoose = require('mongoose');

const notificationTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    token: {
        type: String,
        required: [true, 'FCM token is required'],
        unique: true
    },
    platform: {
        type: String,
        enum: ['android'],
        default: 'android'
    }
}, {
    timestamps: true
});

notificationTokenSchema.index({ userId: 1, platform: 1 });

module.exports = mongoose.model('NotificationToken', notificationTokenSchema);

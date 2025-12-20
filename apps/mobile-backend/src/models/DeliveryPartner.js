const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    currentOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: null
    },
    location: {
        lat: Number,
        lng: Number
    }
}, {
    timestamps: true
});

deliveryPartnerSchema.index({ isActive: 1 });

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);

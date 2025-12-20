const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem'
    },
    nameSnapshot: String,
    priceSnapshot: Number,
    quantity: Number,
    selectedOptions: [{
        optionName: String,
        choiceLabel: String,
        priceDelta: Number
    }],
    lineTotal: Number
});

const timelineSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    note: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function () { return this.orderType === 'user'; },
        index: true
    },
    orderType: {
        type: String,
        enum: ['user', 'guest'],
        default: 'user'
    },
    guestPhone: {
        type: String,
        required: function () { return this.orderType === 'guest'; }
    },
    addressSnapshot: {
        label: String,
        line1: { type: String, required: true },
        line2: String,
        locality: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    items: [orderItemSchema],
    subtotal: {
        type: Number,
        required: true
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    grandTotal: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['created', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'created'
    },
    paymentProvider: {
        type: String,
        enum: ['razorpay', 'cod'],
        required: true
    },
    paymentReferenceId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    placedAt: {
        type: Date,
        default: Date.now
    },
    timeline: [timelineSchema]
}, {
    timestamps: true
});

// Indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

// Add timeline entry when status changes
orderSchema.methods.addTimelineEntry = function (status, note = '') {
    this.timeline.push({ status, note });
    return this;
};

// Initialize timeline on creation
orderSchema.pre('save', function (next) {
    if (this.isNew) {
        this.timeline.push({
            status: this.orderStatus,
            note: 'Order created'
        });
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);

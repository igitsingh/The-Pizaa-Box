const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Coupon code is required'],
        unique: true,
        uppercase: true,
        trim: true,
        maxlength: [20, 'Code cannot exceed 20 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    discountType: {
        type: String,
        enum: ['flat', 'percent'],
        required: true
    },
    discountValue: {
        type: Number,
        required: [true, 'Discount value is required'],
        min: [0, 'Discount value cannot be negative']
    },
    minOrderAmount: {
        type: Number,
        default: 0,
        min: [0, 'Minimum order amount cannot be negative']
    },
    maxDiscountAmount: {
        type: Number,
        default: null
    },
    validFrom: {
        type: Date,
        required: true
    },
    validTo: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimitPerUser: {
        type: Number,
        default: 1,
        min: [1, 'Usage limit must be at least 1']
    }
}, {
    timestamps: true
});

// Index for faster queries
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, validFrom: 1, validTo: 1 });

// Method to check if coupon is valid
couponSchema.methods.isValid = function () {
    const now = new Date();
    return this.isActive &&
        this.validFrom <= now &&
        this.validTo >= now;
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function (orderAmount) {
    if (!this.isValid() || orderAmount < this.minOrderAmount) {
        return 0;
    }

    let discount = 0;
    if (this.discountType === 'flat') {
        discount = this.discountValue;
    } else if (this.discountType === 'percent') {
        discount = (orderAmount * this.discountValue) / 100;
        if (this.maxDiscountAmount) {
            discount = Math.min(discount, this.maxDiscountAmount);
        }
    }

    return Math.round(discount);
};

module.exports = mongoose.model('Coupon', couponSchema);

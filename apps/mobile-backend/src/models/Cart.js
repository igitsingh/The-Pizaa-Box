const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    nameSnapshot: {
        type: String,
        required: true
    },
    priceSnapshot: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    selectedOptions: [{
        optionName: String,
        choiceLabel: String,
        priceDelta: Number
    }],
    lineTotal: {
        type: Number,
        required: true
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    items: [cartItemSchema],
    couponCode: {
        type: String,
        uppercase: true,
        trim: true
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    subtotal: {
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
        default: 0
    }
}, {
    timestamps: true
});

// Method to calculate totals
cartSchema.methods.calculateTotals = async function () {
    // Calculate subtotal
    this.subtotal = this.items.reduce((sum, item) => sum + item.lineTotal, 0);

    // Apply coupon if exists
    if (this.couponCode) {
        const Coupon = mongoose.model('Coupon');
        const coupon = await Coupon.findOne({ code: this.couponCode });
        if (coupon && coupon.isValid()) {
            this.discountAmount = coupon.calculateDiscount(this.subtotal);
        } else {
            this.couponCode = null;
            this.discountAmount = 0;
        }
    }

    // Calculate delivery fee (from env or default)
    this.deliveryFee = parseFloat(process.env.DELIVERY_FEE) || 40;

    // Calculate tax
    const taxRate = parseFloat(process.env.TAX_RATE) || 0.05;
    this.taxAmount = Math.round((this.subtotal - this.discountAmount) * taxRate);

    // Calculate grand total
    this.grandTotal = this.subtotal - this.discountAmount + this.deliveryFee + this.taxAmount;

    return this;
};

module.exports = mongoose.model('Cart', cartSchema);

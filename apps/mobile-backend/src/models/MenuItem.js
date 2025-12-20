const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuCategory',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    imageUrl: {
        type: String,
        trim: true
    },
    basePrice: {
        type: Number,
        required: [true, 'Base price is required'],
        min: [0, 'Price cannot be negative']
    },
    isVeg: {
        type: Boolean,
        default: true
    },
    isBestseller: {
        type: Boolean,
        default: false
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    options: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ['single', 'multi'],
            required: true
        },
        choices: [{
            label: {
                type: String,
                required: true,
                trim: true
            },
            priceDelta: {
                type: Number,
                default: 0
            }
        }]
    }]
}, {
    timestamps: true
});

// Indexes for faster queries
menuItemSchema.index({ slug: 1 });
menuItemSchema.index({ categoryId: 1, isAvailable: 1 });
menuItemSchema.index({ isVeg: 1, isBestseller: 1 });
menuItemSchema.index({ tags: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);

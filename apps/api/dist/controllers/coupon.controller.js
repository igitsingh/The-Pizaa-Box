"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeaturedCoupon = exports.validateCoupon = void 0;
const db_1 = __importDefault(require("../config/db"));
const zod_1 = require("zod");
const validateCouponSchema = zod_1.z.object({
    code: zod_1.z.string(),
    cartTotal: zod_1.z.number(),
});
const validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = validateCouponSchema.parse(req.body);
        const coupon = await db_1.default.coupon.findUnique({
            where: { code },
        });
        if (!coupon) {
            res.status(400).json({ valid: false, message: 'Invalid coupon code' });
            return;
        }
        if (!coupon.isActive) {
            res.status(400).json({ valid: false, message: 'Coupon is inactive' });
            return;
        }
        if (new Date() > new Date(coupon.expiry)) {
            res.status(400).json({ valid: false, message: 'Coupon has expired' });
            return;
        }
        if (coupon.limit !== null && coupon.usedCount >= coupon.limit) {
            res.status(400).json({ valid: false, message: 'Coupon usage limit reached' });
            return;
        }
        let discountAmount = 0;
        if (coupon.type === 'PERCENTAGE') {
            discountAmount = (cartTotal * coupon.value) / 100;
        }
        else if (coupon.type === 'FLAT') {
            discountAmount = coupon.value;
        }
        // Cap discount at total
        if (discountAmount > cartTotal) {
            discountAmount = cartTotal;
        }
        res.json({
            valid: true,
            code: coupon.code,
            discount: discountAmount,
            finalTotal: cartTotal - discountAmount,
            message: 'Coupon applied successfully',
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: 'Invalid data', errors: error.issues });
        }
        else {
            console.error('Validate coupon error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
exports.validateCoupon = validateCoupon;
const getFeaturedCoupon = async (req, res) => {
    try {
        const coupons = await db_1.default.coupon.findMany({
            where: {
                isActive: true,
                expiry: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5, // Fetch a few to filter
        });
        // Find first valid one (checking limit)
        const coupon = coupons.find(c => c.limit === null || c.usedCount < c.limit);
        if (!coupon) {
            res.json({ code: null });
            return;
        }
        res.json(coupon);
    }
    catch (error) {
        console.error('Get featured coupon error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getFeaturedCoupon = getFeaturedCoupon;

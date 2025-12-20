"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCoupons = exports.deleteCoupon = exports.updateCoupon = exports.createCoupon = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCoupon = async (req, res) => {
    try {
        const { code, type, value, expiry, limit, isActive } = req.body;
        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                type,
                value: parseFloat(value),
                expiry: new Date(expiry),
                limit: limit ? parseInt(limit) : null,
                isActive: isActive !== undefined ? isActive : true,
            },
        });
        res.status(201).json(coupon);
    }
    catch (error) {
        console.error('Create coupon error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createCoupon = createCoupon;
const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, type, value, expiry, limit, isActive } = req.body;
        const coupon = await prisma.coupon.update({
            where: { id },
            data: {
                code: code.toUpperCase(),
                type,
                value: parseFloat(value),
                expiry: new Date(expiry),
                limit: limit ? parseInt(limit) : null,
                isActive,
            },
        });
        res.json(coupon);
    }
    catch (error) {
        console.error('Update coupon error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateCoupon = updateCoupon;
const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.coupon.delete({
            where: { id },
        });
        res.json({ message: 'Coupon deleted successfully' });
    }
    catch (error) {
        console.error('Delete coupon error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteCoupon = deleteCoupon;
const getAllCoupons = async (req, res) => {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(coupons);
    }
    catch (error) {
        console.error('Get all coupons error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllCoupons = getAllCoupons;

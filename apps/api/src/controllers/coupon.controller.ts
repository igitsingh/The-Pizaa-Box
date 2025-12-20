import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const validateCouponSchema = z.object({
    code: z.string(),
    cartTotal: z.number(),
});

export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
        const { code, cartTotal } = validateCouponSchema.parse(req.body);

        const coupon = await prisma.coupon.findUnique({
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
        } else if (coupon.type === 'FLAT') {
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
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: 'Invalid data', errors: error.issues });
        } else {
            console.error('Validate coupon error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

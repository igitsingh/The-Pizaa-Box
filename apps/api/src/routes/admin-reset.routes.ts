import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const router = Router();
const prisma = new PrismaClient();

// TEMPORARY ENDPOINT - Remove after fixing admin password
router.post('/reset-admin-password', async (req, res) => {
    try {
        const { secret } = req.body;

        // Simple secret check (you can change this)
        if (secret !== 'reset-admin-now-2026') {
            return res.status(403).json({ message: 'Invalid secret' });
        }

        const newPassword = 'adminpassword';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updated = await prisma.user.updateMany({
            where: {
                email: 'admin@thepizzabox.com'
            },
            data: {
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

        res.json({
            success: true,
            message: 'Admin password reset successfully',
            updatedCount: updated.count,
            credentials: {
                email: 'admin@thepizzabox.com',
                password: 'adminpassword'
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to reset password',
            error: error.message
        });
    }
});

export default router;

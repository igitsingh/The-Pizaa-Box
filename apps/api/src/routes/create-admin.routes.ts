import { Router } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const router = Router();
const prisma = new PrismaClient();

router.post('/create-admin', async (req, res) => {
    try {
        const { secret } = req.body;

        if (secret !== 'create-admin-2026') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const email = 'admin@thepizzabox.com';
        const password = 'adminpassword';
        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: Role.ADMIN
            },
            create: {
                id: randomUUID(),
                email,
                password: hashedPassword,
                name: 'Admin User',
                role: Role.ADMIN,
                phone: '1234567890',
            },
        });

        res.json({
            success: true,
            message: 'Admin user created/updated successfully',
            email: admin.email
        });
    } catch (error: any) {
        console.error('Create admin error:', error);
        res.status(500).json({ message: 'Internal server error', details: error.message });
    }
});

export default router;

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// TEMPORARY ENDPOINT - Fix database schema
router.post('/fix-schema', async (req, res) => {
    try {
        const { secret } = req.body;

        if (secret !== 'fix-schema-2026') {
            return res.status(403).json({ message: 'Invalid secret' });
        }

        // Add missing columns to Settings table
        await prisma.$executeRaw`
            ALTER TABLE "Settings" 
            ADD COLUMN IF NOT EXISTS "lastOrderTime" TEXT;
        `;

        await prisma.$executeRaw`
            ALTER TABLE "Settings" 
            ADD COLUMN IF NOT EXISTS "seoTitle" TEXT;
        `;

        await prisma.$executeRaw`
            ALTER TABLE "Settings" 
            ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;
        `;

        await prisma.$executeRaw`
            ALTER TABLE "Settings" 
            ADD COLUMN IF NOT EXISTS "seoOgImage" TEXT;
        `;

        // Add missing columns to OrderItem table
        await prisma.$executeRaw`
            ALTER TABLE "OrderItem" 
            ADD COLUMN IF NOT EXISTS "variants" JSONB;
        `;

        await prisma.$executeRaw`
            ALTER TABLE "OrderItem" 
            ADD COLUMN IF NOT EXISTS "options" JSONB;
        `;

        await prisma.$executeRaw`
            ALTER TABLE "OrderItem" 
            ADD COLUMN IF NOT EXISTS "addons" JSONB;
        `;

        res.json({
            success: true,
            message: 'Database schema updated successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to update schema',
            error: error.message
        });
    }
});

export default router;

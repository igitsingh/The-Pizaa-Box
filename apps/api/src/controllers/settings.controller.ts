import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPublicSettings = async (req: Request, res: Response) => {
    try {
        const settings = await prisma.settings.findFirst();
        res.json(settings);
    } catch (error) {
        console.error('Get public settings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

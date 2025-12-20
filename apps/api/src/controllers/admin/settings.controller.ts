import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSettings = async (req: Request, res: Response) => {
    try {
        let settings = await prisma.settings.findFirst();

        if (!settings) {
            // Create default settings if not exists
            settings = await prisma.settings.create({
                data: {
                    restaurantName: 'The Pizza Box',
                    contactPhone: '',
                    contactEmail: '',
                    address: '',
                    operatingHours: '10:00 AM - 10:00 PM',
                },
            });
        }

        res.json(settings);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    try {
        const {
            restaurantName,
            contactPhone,
            contactEmail,
            address,
            minOrderAmount,
            operatingHours,
            isOpen,
            isPaused,
            notificationsEnabled,
            whatsappEnabled,
            smsEnabled,
            emailEnabled,
            seoTitle,
            seoDescription,
            seoOgImage,
            closedMessage
        } = req.body;

        let settings = await prisma.settings.findFirst();

        const data = {
            restaurantName,
            contactPhone,
            contactEmail,
            address,
            minOrderAmount: parseFloat(minOrderAmount),
            operatingHours,
            isOpen,
            isPaused,
            notificationsEnabled,
            whatsappEnabled,
            smsEnabled,
            emailEnabled,
            seoTitle,
            seoDescription,
            seoOgImage,
            closedMessage
        };

        if (settings) {
            settings = await prisma.settings.update({
                where: { id: settings.id },
                data,
            });
        } else {
            settings = await prisma.settings.create({
                data,
            });
        }

        res.json(settings);
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSettings = async (req, res) => {
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
    }
    catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res) => {
    try {
        const { restaurantName, contactPhone, contactEmail, address, minOrderAmount, operatingHours, isOpen, isPaused, seoTitle, seoDescription, seoOgImage } = req.body;
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
            seoTitle,
            seoDescription,
            seoOgImage
        };
        if (settings) {
            settings = await prisma.settings.update({
                where: { id: settings.id },
                data,
            });
        }
        else {
            settings = await prisma.settings.create({
                data,
            });
        }
        res.json(settings);
    }
    catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateSettings = updateSettings;

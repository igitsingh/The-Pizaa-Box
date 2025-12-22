"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicSettings = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getPublicSettings = async (req, res) => {
    try {
        const settings = await prisma.settings.findFirst();
        res.json(settings);
    }
    catch (error) {
        console.error('Get public settings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getPublicSettings = getPublicSettings;

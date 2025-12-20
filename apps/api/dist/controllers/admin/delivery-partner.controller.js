"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePartner = exports.updatePartnerStatus = exports.createPartner = exports.getAllPartners = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllPartners = async (req, res) => {
    try {
        const partners = await prisma.deliveryPartner.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(partners);
    }
    catch (error) {
        console.error('Get partners error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllPartners = getAllPartners;
const createPartner = async (req, res) => {
    try {
        const { name, phone, email, vehicleType, vehicleNumber } = req.body;
        const partner = await prisma.deliveryPartner.create({
            data: {
                name,
                phone,
                email,
                vehicleType,
                vehicleNumber
            }
        });
        res.json(partner);
    }
    catch (error) {
        console.error('Create partner error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createPartner = createPartner;
const updatePartnerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const partner = await prisma.deliveryPartner.update({
            where: { id },
            data: { status }
        });
        res.json(partner);
    }
    catch (error) {
        console.error('Update partner status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updatePartnerStatus = updatePartnerStatus;
const deletePartner = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.deliveryPartner.delete({ where: { id } });
        res.json({ message: 'Partner deleted' });
    }
    catch (error) {
        console.error('Delete partner error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deletePartner = deletePartner;

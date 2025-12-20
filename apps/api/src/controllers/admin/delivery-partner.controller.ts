import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPartners = async (req: Request, res: Response) => {
    try {
        const partners = await prisma.deliveryPartner.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(partners);
    } catch (error) {
        console.error('Get partners error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createPartner = async (req: Request, res: Response) => {
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
    } catch (error) {
        console.error('Create partner error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updatePartnerStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const partner = await prisma.deliveryPartner.update({
            where: { id },
            data: { status }
        });
        res.json(partner);
    } catch (error) {
        console.error('Update partner status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deletePartner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.deliveryPartner.delete({ where: { id } });
        res.json({ message: 'Partner deleted' });
    } catch (error) {
        console.error('Delete partner error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

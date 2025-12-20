import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllComplaints = async (req: Request, res: Response) => {
    try {
        const complaints = await prisma.complaint.findMany({
            include: {
                user: {
                    select: { name: true, email: true, phone: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(complaints);
    } catch (error) {
        console.error('Get complaints error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateComplaintStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const complaint = await prisma.complaint.update({
            where: { id },
            data: { status }
        });
        res.json(complaint);
    } catch (error) {
        console.error('Update complaint status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createComplaint = async (req: Request, res: Response) => {
    try {
        const { userId, subject, message } = req.body;
        const complaint = await prisma.complaint.create({
            data: { userId, subject, message }
        });
        res.json(complaint);
    } catch (error) {
        console.error('Create complaint error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

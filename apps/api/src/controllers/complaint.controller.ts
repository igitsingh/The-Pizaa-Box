import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const submitComplaint = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { subject, message } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required' });
        }

        const complaint = await prisma.complaint.create({
            data: {
                userId,
                subject,
                message,
                status: 'OPEN'
            }
        });

        res.status(201).json({ message: 'Complaint submitted successfully', complaint });
    } catch (error) {
        console.error('Submit complaint error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMyComplaints = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const complaints = await prisma.complaint.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(complaints);
    } catch (error) {
        console.error('Get my complaints error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

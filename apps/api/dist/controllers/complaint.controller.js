"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyComplaints = exports.submitComplaint = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const submitComplaint = async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
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
    }
    catch (error) {
        console.error('Submit complaint error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.submitComplaint = submitComplaint;
const getMyComplaints = async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const complaints = await prisma.complaint.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(complaints);
    }
    catch (error) {
        console.error('Get my complaints error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getMyComplaints = getMyComplaints;

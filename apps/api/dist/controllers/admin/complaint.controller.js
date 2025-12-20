"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComplaint = exports.updateComplaintStatus = exports.getAllComplaints = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllComplaints = async (req, res) => {
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
    }
    catch (error) {
        console.error('Get complaints error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllComplaints = getAllComplaints;
const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const complaint = await prisma.complaint.update({
            where: { id },
            data: { status }
        });
        res.json(complaint);
    }
    catch (error) {
        console.error('Update complaint status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateComplaintStatus = updateComplaintStatus;
const createComplaint = async (req, res) => {
    try {
        const { userId, subject, message } = req.body;
        const complaint = await prisma.complaint.create({
            data: { userId, subject, message }
        });
        res.json(complaint);
    }
    catch (error) {
        console.error('Create complaint error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createComplaint = createComplaint;

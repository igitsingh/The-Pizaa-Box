"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFeedback = exports.toggleVisibility = exports.respondToFeedback = exports.getAllFeedbacks = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /api/admin/feedbacks - Get all feedbacks
const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await prisma.feedback.findMany({
            include: {
                order: {
                    select: {
                        orderNumber: true,
                        createdAt: true,
                        total: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(feedbacks);
    }
    catch (error) {
        console.error('Get all feedbacks error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllFeedbacks = getAllFeedbacks;
// PATCH /api/admin/feedbacks/:id/respond - Add admin response
const respondToFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminResponse } = req.body;
        if (!adminResponse) {
            return res.status(400).json({ message: 'Admin response is required' });
        }
        const feedback = await prisma.feedback.update({
            where: { id },
            data: { adminResponse }
        });
        res.json({
            message: 'Response added successfully',
            feedback
        });
    }
    catch (error) {
        console.error('Respond to feedback error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.respondToFeedback = respondToFeedback;
// PATCH /api/admin/feedbacks/:id/toggle-visibility - Toggle visibility
const toggleVisibility = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await prisma.feedback.findUnique({
            where: { id }
        });
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        const updated = await prisma.feedback.update({
            where: { id },
            data: { isVisible: !feedback.isVisible }
        });
        res.json({
            message: `Feedback ${updated.isVisible ? 'shown' : 'hidden'} successfully`,
            feedback: updated
        });
    }
    catch (error) {
        console.error('Toggle visibility error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.toggleVisibility = toggleVisibility;
// DELETE /api/admin/feedbacks/:id - Delete feedback
const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.feedback.delete({
            where: { id }
        });
        res.json({ message: 'Feedback deleted successfully' });
    }
    catch (error) {
        console.error('Delete feedback error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteFeedback = deleteFeedback;

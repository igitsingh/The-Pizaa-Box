"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnquiryStats = exports.deleteEnquiry = exports.updateNotes = exports.assignEnquiry = exports.updateStatus = exports.getEnquiry = exports.getAllEnquiries = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /api/admin/enquiries - Get all enquiries
const getAllEnquiries = async (req, res) => {
    try {
        const { status, source } = req.query;
        const where = {};
        if (status)
            where.status = status;
        if (source)
            where.source = source;
        const enquiries = await prisma.enquiry.findMany({
            where,
            include: {
                assignedUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(enquiries);
    }
    catch (error) {
        console.error('Get all enquiries error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllEnquiries = getAllEnquiries;
// GET /api/admin/enquiries/:id - Get single enquiry
const getEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const enquiry = await prisma.enquiry.findUnique({
            where: { id },
            include: {
                assignedUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }
        res.json(enquiry);
    }
    catch (error) {
        console.error('Get enquiry error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getEnquiry = getEnquiry;
// PATCH /api/admin/enquiries/:id/status - Update status
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }
        const validStatuses = ['NEW', 'IN_PROGRESS', 'CONTACTED', 'CONVERTED', 'CLOSED', 'SPAM'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const enquiry = await prisma.enquiry.update({
            where: { id },
            data: { status }
        });
        res.json({
            message: 'Status updated successfully',
            enquiry
        });
    }
    catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateStatus = updateStatus;
// PATCH /api/admin/enquiries/:id/assign - Assign to staff
const assignEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;
        // Verify user exists
        if (assignedTo) {
            const user = await prisma.user.findUnique({
                where: { id: assignedTo }
            });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
        }
        const enquiry = await prisma.enquiry.update({
            where: { id },
            data: { assignedTo: assignedTo || null }
        });
        res.json({
            message: assignedTo ? 'Enquiry assigned successfully' : 'Enquiry unassigned',
            enquiry
        });
    }
    catch (error) {
        console.error('Assign enquiry error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.assignEnquiry = assignEnquiry;
// PATCH /api/admin/enquiries/:id/notes - Update notes
const updateNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const enquiry = await prisma.enquiry.update({
            where: { id },
            data: { notes: notes || null }
        });
        res.json({
            message: 'Notes updated successfully',
            enquiry
        });
    }
    catch (error) {
        console.error('Update notes error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateNotes = updateNotes;
// DELETE /api/admin/enquiries/:id - Delete enquiry
const deleteEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.enquiry.delete({
            where: { id }
        });
        res.json({ message: 'Enquiry deleted successfully' });
    }
    catch (error) {
        console.error('Delete enquiry error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteEnquiry = deleteEnquiry;
// GET /api/admin/enquiries/stats - Get enquiry statistics
const getEnquiryStats = async (req, res) => {
    try {
        const [total, newCount, inProgress, contacted, converted, closed] = await Promise.all([
            prisma.enquiry.count(),
            prisma.enquiry.count({ where: { status: 'NEW' } }),
            prisma.enquiry.count({ where: { status: 'IN_PROGRESS' } }),
            prisma.enquiry.count({ where: { status: 'CONTACTED' } }),
            prisma.enquiry.count({ where: { status: 'CONVERTED' } }),
            prisma.enquiry.count({ where: { status: 'CLOSED' } })
        ]);
        const bySource = await prisma.enquiry.groupBy({
            by: ['source'],
            _count: {
                source: true
            }
        });
        res.json({
            total,
            byStatus: {
                new: newCount,
                inProgress,
                contacted,
                converted,
                closed
            },
            bySource: bySource.map(s => ({
                source: s.source,
                count: s._count.source
            }))
        });
    }
    catch (error) {
        console.error('Get enquiry stats error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getEnquiryStats = getEnquiryStats;

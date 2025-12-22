"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyEnquiries = exports.whatsappEnquiry = exports.requestCallback = exports.submitEnquiry = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// POST /api/enquiry - Submit enquiry (public)
const submitEnquiry = async (req, res) => {
    try {
        const { name, email, phone, message, source } = req.body;
        // Validation
        if (!name || !phone || !message) {
            return res.status(400).json({ message: 'Name, phone, and message are required' });
        }
        // Phone validation (basic)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            return res.status(400).json({ message: 'Invalid phone number. Must be 10 digits.' });
        }
        // Create enquiry
        const enquiry = await prisma.enquiry.create({
            data: {
                name,
                email: email || null,
                phone,
                message,
                source: source || 'CONTACT_FORM',
                status: 'NEW'
            }
        });
        res.status(201).json({
            message: 'Enquiry submitted successfully. We will contact you soon!',
            enquiry: {
                id: enquiry.id,
                name: enquiry.name,
                phone: enquiry.phone
            }
        });
    }
    catch (error) {
        console.error('Submit enquiry error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.submitEnquiry = submitEnquiry;
// POST /api/enquiry/callback - Request callback (public)
const requestCallback = async (req, res) => {
    try {
        const { name, phone } = req.body;
        if (!name || !phone) {
            return res.status(400).json({ message: 'Name and phone are required' });
        }
        const enquiry = await prisma.enquiry.create({
            data: {
                name,
                phone,
                message: 'Customer requested a callback',
                source: 'CALL_BACK',
                status: 'NEW'
            }
        });
        res.status(201).json({
            message: 'Callback request received! We will call you shortly.',
            enquiry: {
                id: enquiry.id,
                name: enquiry.name
            }
        });
    }
    catch (error) {
        console.error('Request callback error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.requestCallback = requestCallback;
// POST /api/enquiry/whatsapp - WhatsApp enquiry (public)
const whatsappEnquiry = async (req, res) => {
    try {
        const { name, phone, message } = req.body;
        if (!name || !phone) {
            return res.status(400).json({ message: 'Name and phone are required' });
        }
        const enquiry = await prisma.enquiry.create({
            data: {
                name,
                phone,
                message: message || 'Customer enquiry via WhatsApp',
                source: 'WHATSAPP',
                status: 'NEW'
            }
        });
        // In production, this would trigger WhatsApp Business API
        // For now, just save the enquiry
        res.status(201).json({
            message: 'WhatsApp enquiry received!',
            enquiry: {
                id: enquiry.id,
                name: enquiry.name
            }
        });
    }
    catch (error) {
        console.error('WhatsApp enquiry error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.whatsappEnquiry = whatsappEnquiry;
const getMyEnquiries = async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const conditions = [];
        if (user.phone)
            conditions.push({ phone: user.phone });
        if (user.email)
            conditions.push({ email: user.email });
        if (conditions.length === 0) {
            return res.json([]);
        }
        const enquiries = await prisma.enquiry.findMany({
            where: {
                OR: conditions
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(enquiries);
    }
    catch (error) {
        console.error('Get my enquiries error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getMyEnquiries = getMyEnquiries;

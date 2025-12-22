"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.sendOTP = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
// In-memory OTP storage (in production, use Redis)
const otpStore = new Map();
// Generate 6-digit OTP
const generateOTP = () => {
    // In development, use a fixed OTP for convenience
    if (process.env.NODE_ENV === 'development') {
        return '123456';
    }
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// Send OTP (Step 1)
const sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({ message: 'Invalid phone number' });
        }
        // Generate OTP
        const otp = generateOTP();
        // Store OTP with 5-minute expiry
        otpStore.set(phone, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
        });
        // TODO: Send OTP via SMS service (Twilio, MSG91, etc.)
        // For development, log OTP to console
        console.log(`📱 OTP for ${phone}: ${otp}`);
        // In development, also return OTP in response (REMOVE IN PRODUCTION!)
        if (process.env.NODE_ENV === 'development') {
            return res.json({
                message: 'OTP sent successfully',
                otp // ONLY FOR DEVELOPMENT
            });
        }
        res.json({ message: 'OTP sent successfully' });
    }
    catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};
exports.sendOTP = sendOTP;
// Verify OTP and Login/Signup (Step 2)
const verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res.status(400).json({ message: 'Phone and OTP are required' });
        }
        // Check if OTP exists and is valid
        const storedOTP = otpStore.get(phone);
        if (!storedOTP) {
            return res.status(400).json({ message: 'OTP not found. Please request a new one.' });
        }
        if (Date.now() > storedOTP.expiresAt) {
            otpStore.delete(phone);
            return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
        }
        if (storedOTP.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        // OTP is valid, delete it
        otpStore.delete(phone);
        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { phone }
        });
        let isNewUser = false;
        // If user doesn't exist, create new user
        if (!user) {
            user = await prisma.user.create({
                data: {
                    phone,
                    name: `User ${phone.slice(-4)}`, // Default name
                    email: `${phone}@thepizzabox.in`, // Placeholder email
                    password: '', // No password for OTP login
                    role: 'CUSTOMER'
                }
            });
            isNewUser = true;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '30d' });
        res.json({
            message: isNewUser ? 'Account created successfully' : 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            },
            isNewUser
        });
    }
    catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
};
exports.verifyOTP = verifyOTP;

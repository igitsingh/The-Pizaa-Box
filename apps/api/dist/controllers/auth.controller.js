"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.whatsappLogin = exports.googleLogin = exports.login = exports.signup = void 0;
const db_1 = __importDefault(require("../config/db"));
const auth_1 = require("../utils/auth");
const zod_1 = require("zod");
const signupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(2),
    phone: zod_1.z.string().optional(),
});
const loginSchema = zod_1.z.object({
    identifier: zod_1.z.string(),
    password: zod_1.z.string(),
});
const signup = async (req, res) => {
    try {
        const { email, password, name, phone } = signupSchema.parse(req.body);
        const existingUser = await db_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const user = await db_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
            },
        });
        const token = (0, auth_1.generateToken)(user.id, user.role);
        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ errors: error.issues });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { identifier, password } = loginSchema.parse(req.body);
        // Check if identifier is email or phone
        const isEmail = identifier.includes('@');
        let user;
        if (isEmail) {
            user = await db_1.default.user.findUnique({ where: { email: identifier } });
        }
        else {
            // Assuming phone is unique. If not defined as unique in schema, findFirst
            user = await db_1.default.user.findFirst({ where: { phone: identifier } });
        }
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const isMatch = await (0, auth_1.comparePassword)(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const token = (0, auth_1.generateToken)(user.id, user.role);
        if (user.role === 'ADMIN') {
            res.cookie('admin_token', token, {
                httpOnly: true,
                secure: false, // Allow on http for localhost
                sameSite: 'lax', // Shared across localhost ports
                domain: 'localhost', // Explicitly set domain
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });
        }
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone } });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ errors: error.issues });
        }
        else {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
exports.login = login;
const googleLogin = async (req, res) => {
    try {
        const { email, name, googleId } = req.body;
        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }
        let user = await db_1.default.user.findUnique({ where: { email } });
        if (!user) {
            // Create new user
            user = await db_1.default.user.create({
                data: {
                    email,
                    name: name || 'Google User',
                    password: await (0, auth_1.hashPassword)(Math.random().toString(36).slice(-8)), // Random password
                    // Store googleId if you had a field for it, or just rely on email
                },
            });
        }
        const token = (0, auth_1.generateToken)(user.id, user.role);
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone } });
    }
    catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.googleLogin = googleLogin;
const whatsappLogin = async (req, res) => {
    try {
        const { phone, otp, name } = req.body;
        // Mock OTP verification
        if (otp !== '1234') {
            res.status(400).json({ message: 'Invalid OTP' });
            return;
        }
        let user = await db_1.default.user.findFirst({ where: { phone } });
        if (!user) {
            // Create new user
            user = await db_1.default.user.create({
                data: {
                    email: `${phone}@whatsapp.com`, // Placeholder email
                    phone,
                    name: name || 'WhatsApp User',
                    password: await (0, auth_1.hashPassword)(Math.random().toString(36).slice(-8)),
                },
            });
        }
        const token = (0, auth_1.generateToken)(user.id, user.role);
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone } });
    }
    catch (error) {
        console.error('WhatsApp login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.whatsappLogin = whatsappLogin;
const getMe = async (req, res) => {
    try {
        // @ts-ignore - user is attached by middleware
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = await db_1.default.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, role: true, phone: true, addresses: true },
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getMe = getMe;

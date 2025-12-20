"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        // Check for cookie
        // @ts-ignore
        const cookieToken = req.cookies?.admin_token;
        console.log('Auth Middleware - Cookies:', req.cookies);
        console.log('Auth Middleware - Headers:', req.headers);
        if (cookieToken) {
            // Verify cookie token
            jsonwebtoken_1.default.verify(cookieToken, JWT_SECRET, (err, user) => {
                if (err)
                    return res.sendStatus(403);
                // @ts-ignore
                req.user = user;
                next();
            });
            return;
        }
        return res.sendStatus(401);
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403);
        // @ts-ignore
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;

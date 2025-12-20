import express from 'express';
import { sendOTP, verifyOTP } from '../controllers/otp.controller';

const router = express.Router();

// Send OTP to phone number
router.post('/send-otp', sendOTP);

// Verify OTP and login/signup
router.post('/verify-otp', verifyOTP);

export default router;

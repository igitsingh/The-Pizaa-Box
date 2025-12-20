import { Router } from 'express';
import { signup, login, getMe, googleLogin, whatsappLogin, sendOTP, verifyOTP } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/google', googleLogin);
router.post('/whatsapp', whatsappLogin);
router.get('/me', authenticate, getMe);

export default router;

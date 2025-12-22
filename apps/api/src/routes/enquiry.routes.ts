import { Router } from 'express';
import { submitEnquiry, requestCallback, whatsappEnquiry, getMyEnquiries } from '../controllers/enquiry.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/', submitEnquiry);
router.post('/callback', requestCallback);
router.post('/whatsapp', whatsappEnquiry);

// Protected routes
router.get('/my', authenticate, getMyEnquiries);

export default router;

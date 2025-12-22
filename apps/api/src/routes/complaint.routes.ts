import { Router } from 'express';
import { submitComplaint, getMyComplaints } from '../controllers/complaint.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, submitComplaint);
router.get('/my', authenticate, getMyComplaints);

export default router;

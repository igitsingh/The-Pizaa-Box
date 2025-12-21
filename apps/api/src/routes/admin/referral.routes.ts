import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';
import { getReferralOverview, getAllReferralTransactions } from '../../controllers/admin/referral.controller';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/overview', getReferralOverview);
router.get('/transactions', getAllReferralTransactions);

export default router;

import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';
import { getMembershipOverview, getAllMembers } from '../../controllers/admin/membership.controller';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/overview', getMembershipOverview);
router.get('/members', getAllMembers);

export default router;

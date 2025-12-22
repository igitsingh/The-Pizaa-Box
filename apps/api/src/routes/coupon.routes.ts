import { Router } from 'express';
import { validateCoupon, getFeaturedCoupon } from '../controllers/coupon.controller';

const router = Router();

router.get('/active', getFeaturedCoupon);
router.post('/validate', validateCoupon);

export default router;

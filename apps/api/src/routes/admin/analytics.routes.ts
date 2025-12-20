import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';
import { getDashboardStats, getSalesTrend, getTopItems, getOrdersByStatus } from '../../controllers/admin/analytics.controller';

const router = Router();

router.get('/stats', getDashboardStats);
router.get('/sales-trend', authenticate, authorizeAdmin, getSalesTrend);
router.get('/top-items', authenticate, authorizeAdmin, getTopItems);
router.get('/orders-by-status', authenticate, authorizeAdmin, getOrdersByStatus);

export default router;

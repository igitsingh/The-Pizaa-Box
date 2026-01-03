import { Router } from 'express';
import { getKitchenBoard, getKitchenStats, syncKitchen } from '../../controllers/admin/kitchen.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Kitchen board endpoints
router.get('/board', getKitchenBoard);
router.get('/stats', getKitchenStats);
router.get('/sync', syncKitchen);

export default router;

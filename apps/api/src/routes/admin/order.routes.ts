import { Router } from 'express';
import { getAllOrders, updateOrderStatus, assignDeliveryPartner, getOrderById, getOrderStats, getOrderNotifications } from '../../controllers/admin/order.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/stats', getOrderStats);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.get('/:id/notifications', getOrderNotifications);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/assign-partner', assignDeliveryPartner);

export default router;

import { Router } from 'express';
import { getAllOrders, updateOrderStatus, assignDeliveryPartner, getOrderById } from '../../controllers/admin/order.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/assign-partner', assignDeliveryPartner);

export default router;

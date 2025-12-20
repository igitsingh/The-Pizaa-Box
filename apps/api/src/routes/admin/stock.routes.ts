import { Router } from 'express';
import { updateItemStock, getLowStockItems } from '../../controllers/admin/stock.controller';

const router = Router();

router.put('/items/:id', updateItemStock);
router.get('/low-stock', getLowStockItems);

export default router;

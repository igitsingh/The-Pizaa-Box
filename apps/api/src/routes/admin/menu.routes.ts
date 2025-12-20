import { Router } from 'express';
import { createItem, updateItem, deleteItem, getAllItems } from '../../controllers/admin/menu.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getAllItems);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

// Variants
import { createVariant, updateVariant, toggleVariantAvailability } from '../../controllers/admin/menu.controller';
router.post('/variants', createVariant);
router.put('/variants/:id', updateVariant);
router.patch('/variants/:id/toggle', toggleVariantAvailability);

export default router;

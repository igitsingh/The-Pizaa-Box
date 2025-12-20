import { Router } from 'express';
import { getMenu, getItem, getCategoryBySlug } from '../controllers/menu.controller';
import { getTopItems } from '../controllers/admin/analytics.controller';

const router = Router();

router.get('/', getMenu);
router.get('/bestsellers', getTopItems);
router.get('/categories/:slug', getCategoryBySlug);
router.get('/:id', getItem);

export default router;

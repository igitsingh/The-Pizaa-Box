import { Router } from 'express';
import { addItem, updateItem, deleteItem } from '../controllers/admin.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';
import { getAnalytics } from '../controllers/analytics.controller';

const router = Router();

// Middleware to ensure admin
router.use(authenticate, authorizeAdmin);

router.get('/analytics', getAnalytics);
router.post('/menu', addItem);
router.put('/menu/:id', updateItem);
router.delete('/menu/:id', deleteItem);

export default router;

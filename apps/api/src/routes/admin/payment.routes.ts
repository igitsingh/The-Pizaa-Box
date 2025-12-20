import { Router } from 'express';
import { getAllTransactions, exportTransactions } from '../../controllers/admin/payment.controller';

const router = Router();

router.get('/', getAllTransactions);
router.get('/export', exportTransactions);

export default router;

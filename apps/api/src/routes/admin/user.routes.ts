import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, getStaff } from '../../controllers/admin/user.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/staff', getStaff);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);

export default router;

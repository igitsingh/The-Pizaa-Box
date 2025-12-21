import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';
import { createLocation, updateLocation, deleteLocation } from '../../controllers/admin/location.controller';

const router = Router();

router.post('/', authenticate, authorizeAdmin, createLocation);
router.put('/:id', authenticate, authorizeAdmin, updateLocation);
router.delete('/:id', authenticate, authorizeAdmin, deleteLocation);

export default router;

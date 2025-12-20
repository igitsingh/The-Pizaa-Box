import { Router } from 'express';
import { getLocationBySlug, getLocations } from '../controllers/location.controller';

const router = Router();

router.get('/', getLocations);
router.get('/:slug', getLocationBySlug);

export default router;

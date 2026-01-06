import { Router } from 'express';
import { getAllPartners, createPartner, updatePartner, updatePartnerStatus, deletePartner } from '../../controllers/admin/delivery-partner.controller';

const router = Router();

router.get('/', getAllPartners);
router.post('/', createPartner);
router.put('/:id', updatePartner);
router.put('/:id/status', updatePartnerStatus);
router.delete('/:id', deletePartner);

export default router;

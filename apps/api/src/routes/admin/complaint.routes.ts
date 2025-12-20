import { Router } from 'express';
import { getAllComplaints, updateComplaintStatus, createComplaint } from '../../controllers/admin/complaint.controller';

const router = Router();

router.get('/', getAllComplaints);
router.put('/:id/status', updateComplaintStatus);
router.post('/', createComplaint); // For frontend use mostly, but admin can create too

export default router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complaint_controller_1 = require("../../controllers/admin/complaint.controller");
const router = (0, express_1.Router)();
router.get('/', complaint_controller_1.getAllComplaints);
router.put('/:id/status', complaint_controller_1.updateComplaintStatus);
router.post('/', complaint_controller_1.createComplaint); // For frontend use mostly, but admin can create too
exports.default = router;

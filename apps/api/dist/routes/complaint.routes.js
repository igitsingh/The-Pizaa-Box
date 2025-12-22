"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complaint_controller_1 = require("../controllers/complaint.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authenticate, complaint_controller_1.submitComplaint);
router.get('/my', auth_middleware_1.authenticate, complaint_controller_1.getMyComplaints);
exports.default = router;

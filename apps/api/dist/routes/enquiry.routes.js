"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enquiry_controller_1 = require("../controllers/enquiry.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/', enquiry_controller_1.submitEnquiry);
router.post('/callback', enquiry_controller_1.requestCallback);
router.post('/whatsapp', enquiry_controller_1.whatsappEnquiry);
// Protected routes
router.get('/my', auth_middleware_1.authenticate, enquiry_controller_1.getMyEnquiries);
exports.default = router;

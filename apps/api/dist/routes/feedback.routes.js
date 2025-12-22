"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedback_controller_1 = require("../controllers/feedback.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/public', feedback_controller_1.getPublicFeedbacks);
router.get('/check/:orderId', feedback_controller_1.checkFeedback);
// Customer routes (optional auth - works for both logged-in and guest)
router.post('/', auth_middleware_1.optionalAuth, feedback_controller_1.submitFeedback);
exports.default = router;

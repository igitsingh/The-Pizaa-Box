"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const analytics_controller_1 = require("../controllers/analytics.controller");
const router = (0, express_1.Router)();
// Middleware to ensure admin
router.use(auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin);
router.get('/analytics', analytics_controller_1.getAnalytics);
router.post('/menu', admin_controller_1.addItem);
router.put('/menu/:id', admin_controller_1.updateItem);
router.delete('/menu/:id', admin_controller_1.deleteItem);
exports.default = router;

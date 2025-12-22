"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.optionalAuthenticate, order_controller_1.createOrder); // Optional for Guest
router.get('/my', auth_middleware_1.authenticate, order_controller_1.getMyOrders); // Logged-in history
router.post('/lookup', order_controller_1.lookupOrder); // Guest lookup
router.post('/repeat', auth_middleware_1.optionalAuthenticate, order_controller_1.repeatOrder); // Repeat order (Guest or User)
router.get('/', auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, order_controller_1.getOrders); // Admin only
router.get('/:id', auth_middleware_1.authenticate, order_controller_1.getOrder);
router.put('/:id/status', auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, order_controller_1.updateOrderStatus);
router.get('/:id/notifications', auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, order_controller_1.getOrderNotifications);
router.get('/:id/invoice', auth_middleware_1.optionalAuthenticate, order_controller_1.downloadInvoice);
exports.default = router;

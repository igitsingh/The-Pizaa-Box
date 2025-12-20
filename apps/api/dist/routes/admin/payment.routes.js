"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../../controllers/admin/payment.controller");
const router = (0, express_1.Router)();
router.get('/', payment_controller_1.getAllTransactions);
router.get('/export', payment_controller_1.exportTransactions);
exports.default = router;

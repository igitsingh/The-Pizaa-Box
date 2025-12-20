"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_2 = __importDefault(require("express"));
const router = (0, express_1.Router)();
router.post('/create-intent', auth_middleware_1.authenticate, payment_controller_1.createPaymentIntent);
router.post('/webhook', express_2.default.raw({ type: 'application/json' }), payment_controller_1.handleWebhook);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const otp_controller_1 = require("../controllers/otp.controller");
const router = express_1.default.Router();
// Send OTP to phone number
router.post('/send-otp', otp_controller_1.sendOTP);
// Verify OTP and login/signup
router.post('/verify-otp', otp_controller_1.verifyOTP);
exports.default = router;

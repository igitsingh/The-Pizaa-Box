"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const membership_controller_1 = require("../controllers/membership.controller");
const router = (0, express_1.Router)();
router.get('/my-tier', auth_middleware_1.authenticate, membership_controller_1.getMyMembership);
router.get('/benefits', membership_controller_1.getAllTierBenefits);
exports.default = router;

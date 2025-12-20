"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const location_controller_1 = require("../controllers/location.controller");
const router = (0, express_1.Router)();
router.get('/', location_controller_1.getLocations);
router.get('/:slug', location_controller_1.getLocationBySlug);
exports.default = router;

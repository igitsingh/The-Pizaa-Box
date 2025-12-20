"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menu_controller_1 = require("../controllers/menu.controller");
const router = (0, express_1.Router)();
router.get('/', menu_controller_1.getMenu);
router.get('/categories/:slug', menu_controller_1.getCategoryBySlug);
router.get('/:id', menu_controller_1.getItem);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menu_controller_1 = require("../../controllers/admin/menu.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateToken);
router.get('/', menu_controller_1.getAllItems);
router.post('/', menu_controller_1.createItem);
router.put('/:id', menu_controller_1.updateItem);
router.delete('/:id', menu_controller_1.deleteItem);
// Variants
const menu_controller_2 = require("../../controllers/admin/menu.controller");
router.post('/variants', menu_controller_2.createVariant);
router.put('/variants/:id', menu_controller_2.updateVariant);
router.patch('/variants/:id/toggle', menu_controller_2.toggleVariantAvailability);
exports.default = router;

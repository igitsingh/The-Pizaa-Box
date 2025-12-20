"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stock_controller_1 = require("../../controllers/admin/stock.controller");
const router = (0, express_1.Router)();
router.put('/items/:id', stock_controller_1.updateItemStock);
router.get('/low-stock', stock_controller_1.getLowStockItems);
exports.default = router;

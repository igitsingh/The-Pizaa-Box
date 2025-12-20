"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLowStockItems = exports.updateItemStock = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const updateItemStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock, isStockManaged } = req.body;
        const item = await prisma.item.update({
            where: { id },
            data: {
                stock,
                isStockManaged,
                isAvailable: stock > 0 // Auto update availability
            }
        });
        res.json(item);
    }
    catch (error) {
        console.error('Update stock error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateItemStock = updateItemStock;
const getLowStockItems = async (req, res) => {
    try {
        const items = await prisma.item.findMany({
            where: {
                isStockManaged: true,
                stock: { lte: 10 }
            }
        });
        res.json(items);
    }
    catch (error) {
        console.error('Get low stock items error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getLowStockItems = getLowStockItems;

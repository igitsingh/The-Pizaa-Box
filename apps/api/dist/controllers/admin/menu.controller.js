"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllItems = exports.deleteItem = exports.updateItem = exports.createItem = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createItem = async (req, res) => {
    try {
        const { name, description, price, image, categoryId, isVeg, isSpicy, isBestSeller } = req.body;
        const item = await prisma.item.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                image,
                categoryId,
                isVeg: isVeg || false,
                isSpicy: isSpicy || false,
                isBestSeller: isBestSeller || false,
            },
        });
        res.status(201).json(item);
    }
    catch (error) {
        console.error('Create item error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createItem = createItem;
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, image, categoryId, isVeg, isSpicy, isBestSeller, isAvailable } = req.body;
        console.log('Update item request:', { id, body: req.body });
        const item = await prisma.item.update({
            where: { id },
            data: {
                name,
                description,
                price: parseFloat(price),
                image,
                categoryId,
                isVeg,
                isSpicy,
                isBestSeller,
                isAvailable,
            },
        });
        console.log('Item updated:', item);
        res.json(item);
    }
    catch (error) {
        console.error('Update item error:', error);
        res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
};
exports.updateItem = updateItem;
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.item.delete({
            where: { id },
        });
        res.json({ message: 'Item deleted successfully' });
    }
    catch (error) {
        console.error('Delete item error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteItem = deleteItem;
const getAllItems = async (req, res) => {
    try {
        const items = await prisma.item.findMany({
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(items);
    }
    catch (error) {
        console.error('Get all items error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllItems = getAllItems;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleVariantAvailability = exports.updateVariant = exports.createVariant = exports.getAllItems = exports.deleteItem = exports.updateItem = exports.createItem = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createItem = async (req, res) => {
    try {
        const { name, description, price, image, categoryId, isVeg, isSpicy, isBestSeller, stock, isStockManaged, variants } = req.body;
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
                stock: stock ? parseInt(stock) : 100,
                isStockManaged: isStockManaged || false,
                variants: variants ? {
                    create: variants.map((v) => ({
                        type: v.type,
                        label: v.label,
                        price: parseFloat(v.price),
                        isAvailable: v.isAvailable ?? true
                    }))
                } : undefined
            },
            include: {
                variants: true
            }
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
        const { name, description, price, image, categoryId, isVeg, isSpicy, isBestSeller, isAvailable, stock, isStockManaged, variants } = req.body;
        // Delete existing variants and recreate if variants are provided
        if (variants) {
            await prisma.variant.deleteMany({ where: { itemId: id } });
        }
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
                stock: stock ? parseInt(stock) : undefined,
                isStockManaged: isStockManaged,
                variants: variants ? {
                    create: variants.map((v) => ({
                        type: v.type,
                        label: v.label,
                        price: parseFloat(v.price),
                        isAvailable: v.isAvailable ?? true
                    }))
                } : undefined
            },
            include: {
                variants: true
            }
        });
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
                variants: true
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
// Separate Variant CRUD
const createVariant = async (req, res) => {
    try {
        const { itemId, type, label, price, isAvailable } = req.body;
        const variant = await prisma.variant.create({
            data: { itemId, type, label, price: parseFloat(price), isAvailable }
        });
        res.status(201).json(variant);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createVariant = createVariant;
const updateVariant = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, label, price, isAvailable } = req.body;
        const variant = await prisma.variant.update({
            where: { id },
            data: { type, label, price: parseFloat(price), isAvailable }
        });
        res.json(variant);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateVariant = updateVariant;
const toggleVariantAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { isAvailable } = req.body;
        const variant = await prisma.variant.update({
            where: { id },
            data: { isAvailable }
        });
        res.json(variant);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.toggleVariantAvailability = toggleVariantAvailability;

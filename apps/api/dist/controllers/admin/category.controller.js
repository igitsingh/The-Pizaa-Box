"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = exports.deleteCategory = exports.updateCategory = exports.createCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const category = await prisma.category.create({
            data: {
                name,
            },
        });
        res.status(201).json(category);
    }
    catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
            },
        });
        res.json(category);
    }
    catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if category has items
        const itemsCount = await prisma.item.count({
            where: { categoryId: id },
        });
        if (itemsCount > 0) {
            return res.status(400).json({ message: 'Cannot delete category with items' });
        }
        await prisma.category.delete({
            where: { id },
        });
        res.json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteCategory = deleteCategory;
const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { items: true },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
        res.json(categories);
    }
    catch (error) {
        console.error('Get all categories error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllCategories = getAllCategories;

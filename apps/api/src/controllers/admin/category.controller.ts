import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCategory = async (req: Request, res: Response) => {
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
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
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
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
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
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
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
    } catch (error) {
        console.error('Get all categories error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

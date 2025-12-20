import { Request, Response } from 'express';
import prisma from '../config/db';

export const getMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                items: {
                    include: {
                        options: {
                            include: {
                                choices: true,
                            },
                        },
                        addons: true,
                        variants: true,
                    },
                },
            },
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const item = await prisma.item.findUnique({
            where: { id },
            include: {
                options: {
                    include: {
                        choices: true,
                    },
                },
                addons: true,
                variants: true,
            },
        });

        if (!item) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                items: {
                    include: {
                        options: {
                            include: {
                                choices: true,
                            },
                        },
                        addons: true,
                        variants: true,
                    },
                },
            },
        });

        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

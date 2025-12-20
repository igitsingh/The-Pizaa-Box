import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const itemSchema = z.object({
    categoryId: z.string(),
    name: z.string(),
    description: z.string().optional(),
    price: z.number(),
    image: z.string().optional(),
    isVeg: z.boolean().optional(),
});

export const addItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId, name, description, price, image, isVeg } = itemSchema.parse(req.body);

        const item = await prisma.item.create({
            data: {
                categoryId,
                name,
                description,
                price,
                image,
                isVeg: isVeg || true,
            },
        });

        res.status(201).json(item);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.issues });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const updateItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = itemSchema.partial().parse(req.body);

        const item = await prisma.item.update({
            where: { id },
            data,
        });

        res.json(item);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.issues });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.item.delete({ where: { id } });
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

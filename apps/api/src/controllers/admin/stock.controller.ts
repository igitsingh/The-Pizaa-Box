import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateItemStock = async (req: Request, res: Response) => {
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
    } catch (error) {
        console.error('Update stock error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getLowStockItems = async (req: Request, res: Response) => {
    try {
        const items = await prisma.item.findMany({
            where: {
                isStockManaged: true,
                stock: { lte: 10 }
            }
        });
        res.json(items);
    } catch (error) {
        console.error('Get low stock items error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

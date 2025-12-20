import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Parser } from 'json2csv';

const prisma = new PrismaClient();

export const getAllTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(transactions);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const exportTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: { createdAt: 'desc' }
        });

        const fields = ['id', 'orderId', 'amount', 'type', 'status', 'method', 'reference', 'createdAt'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(transactions);

        res.header('Content-Type', 'text/csv');
        res.attachment('transactions.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export transactions error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

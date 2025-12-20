"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportTransactions = exports.getAllTransactions = void 0;
const client_1 = require("@prisma/client");
const json2csv_1 = require("json2csv");
const prisma = new client_1.PrismaClient();
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(transactions);
    }
    catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllTransactions = getAllTransactions;
const exportTransactions = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: { createdAt: 'desc' }
        });
        const fields = ['id', 'orderId', 'amount', 'type', 'status', 'method', 'reference', 'createdAt'];
        const json2csvParser = new json2csv_1.Parser({ fields });
        const csv = json2csvParser.parse(transactions);
        res.header('Content-Type', 'text/csv');
        res.attachment('transactions.csv');
        res.send(csv);
    }
    catch (error) {
        console.error('Export transactions error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.exportTransactions = exportTransactions;

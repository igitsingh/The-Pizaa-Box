"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersByStatus = exports.getTopItems = exports.getSalesTrend = exports.getDashboardStats = void 0;
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const prisma = new client_1.PrismaClient();
const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        const startOfToday = (0, date_fns_1.startOfDay)(today);
        const endOfToday = (0, date_fns_1.endOfDay)(today);
        // 1. Total Sales Today
        const todayOrders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startOfToday,
                    lte: endOfToday
                },
                status: { not: 'CANCELLED' }
            }
        });
        const totalSalesToday = todayOrders.reduce((sum, order) => sum + order.total, 0);
        // 2. Total Orders Today
        const totalOrdersToday = todayOrders.length;
        // 3. Active Orders (Pending/Preparing/Out)
        const activeOrders = await prisma.order.count({
            where: {
                status: {
                    in: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY']
                }
            }
        });
        // 4. Low Stock Items
        const lowStockItems = await prisma.item.count({
            where: {
                isStockManaged: true,
                stock: { lte: 10 }
            }
        });
        res.json({
            totalSalesToday,
            totalOrdersToday,
            activeOrders,
            lowStockItems
        });
    }
    catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getDashboardStats = getDashboardStats;
const getSalesTrend = async (req, res) => {
    try {
        const { range } = req.query; // 'week', 'month'
        const today = new Date();
        let startDate = (0, date_fns_1.subDays)(today, 7);
        if (range === 'month') {
            startDate = (0, date_fns_1.subDays)(today, 30);
        }
        const orders = await prisma.order.findMany({
            where: {
                createdAt: { gte: startDate },
                status: { not: 'CANCELLED' }
            },
            select: {
                createdAt: true,
                total: true
            }
        });
        // Group by date
        const salesByDate = {};
        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            salesByDate[date] = (salesByDate[date] || 0) + order.total;
        });
        const chartData = Object.keys(salesByDate).map(date => ({
            date,
            sales: salesByDate[date]
        })).sort((a, b) => a.date.localeCompare(b.date));
        res.json(chartData);
    }
    catch (error) {
        console.error('Get sales trend error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getSalesTrend = getSalesTrend;
const getTopItems = async (req, res) => {
    try {
        // This is a simplified version. For large datasets, use raw SQL or aggregation pipeline.
        const orders = await prisma.order.findMany({
            where: { status: { not: 'CANCELLED' } },
            include: { items: true },
            take: 100 // Limit to last 100 orders for performance in this demo
        });
        const itemCounts = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                if (!itemCounts[item.itemId]) {
                    itemCounts[item.itemId] = { name: item.name, count: 0 };
                }
                itemCounts[item.itemId].count += item.quantity;
            });
        });
        const sortedItems = Object.values(itemCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        res.json(sortedItems);
    }
    catch (error) {
        console.error('Get top items error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getTopItems = getTopItems;
const getOrdersByStatus = async (req, res) => {
    try {
        const orders = await prisma.order.groupBy({
            by: ['status'],
            _count: {
                status: true
            }
        });
        const formattedData = orders.map(order => ({
            name: order.status,
            value: order._count.status
        }));
        res.json(formattedData);
    }
    catch (error) {
        console.error('Get orders by status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getOrdersByStatus = getOrdersByStatus;

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
        // 4. Low Stock Items (unavailable items)
        const lowStockItems = await prisma.item.count({
            where: {
                isAvailable: false
            }
        });
        // 5. Repeat Customer Rate
        const customersWithOrders = await prisma.user.findMany({
            where: {
                role: 'CUSTOMER',
                orders: {
                    some: {}
                }
            },
            include: {
                _count: {
                    select: { orders: true }
                }
            }
        });
        const totalCustomers = customersWithOrders.length;
        const repeatCustomers = customersWithOrders.filter(c => c._count.orders > 1).length;
        const repeatCustomerRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;
        // 6. Total Users (for context)
        const totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
        res.json({
            totalSalesToday,
            totalOrdersToday,
            activeOrders,
            lowStockItems,
            repeatCustomerRate,
            totalUsers
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
        const { range } = req.query; // '7d', '15d', '1m', '3m', '6m', '1y', 'all'
        const today = new Date();
        let startDate;
        switch (range) {
            case '15d':
                startDate = (0, date_fns_1.subDays)(today, 15);
                break;
            case '1m':
                startDate = (0, date_fns_1.subDays)(today, 30);
                break;
            case '3m':
                startDate = (0, date_fns_1.subDays)(today, 90);
                break;
            case '6m':
                startDate = (0, date_fns_1.subDays)(today, 180);
                break;
            case '1y':
                startDate = (0, date_fns_1.subDays)(today, 365);
                break;
            case 'all':
                startDate = new Date(0); // Beginning of time
                break;
            case '7d':
            default:
                startDate = (0, date_fns_1.subDays)(today, 7);
                break;
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
        // Get all non-cancelled orders with items
        const orders = await prisma.order.findMany({
            where: { status: { not: 'CANCELLED' } },
            include: { items: true },
            take: 200 // Last 200 orders for better data
        });
        const itemCounts = {};
        // Count quantities sold per item
        orders.forEach(order => {
            order.items.forEach(item => {
                if (!itemCounts[item.itemId]) {
                    itemCounts[item.itemId] = 0;
                }
                itemCounts[item.itemId] += item.quantity;
            });
        });
        // Get top 10 item IDs
        const topItemIds = Object.entries(itemCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([itemId]) => itemId);
        // Fetch full item details
        const items = await prisma.item.findMany({
            where: {
                id: { in: topItemIds }
            },
            include: {
                category: true
            }
        });
        // Map items with their counts and sort by count
        const topItems = items
            .map(item => ({
            ...item,
            soldCount: itemCounts[item.id]
        }))
            .sort((a, b) => b.soldCount - a.soldCount);
        res.json(topItems);
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

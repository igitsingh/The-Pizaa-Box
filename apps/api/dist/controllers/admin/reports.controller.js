"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverviewReport = exports.getCustomerReport = exports.getDeliveryPartnerReport = exports.getCouponReport = exports.getProductReport = exports.getSalesReport = void 0;
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const prisma = new client_1.PrismaClient();
// GET /api/admin/reports/sales - Sales Report
const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate, groupBy = 'day' } = req.query;
        const start = startDate ? new Date(startDate) : (0, date_fns_1.subDays)(new Date(), 30);
        const end = endDate ? new Date(endDate) : new Date();
        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: (0, date_fns_1.startOfDay)(start),
                    lte: (0, date_fns_1.endOfDay)(end)
                },
                status: { not: 'CANCELLED' }
            },
            include: {
                items: true
            },
            orderBy: { createdAt: 'asc' }
        });
        // Calculate totals
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const totalItems = orders.reduce((sum, order) => sum + order.items.reduce((s, item) => s + item.quantity, 0), 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        // Group by date
        const salesByDate = {};
        orders.forEach(order => {
            const dateKey = (0, date_fns_1.format)(new Date(order.createdAt), groupBy === 'month' ? 'yyyy-MM' : 'yyyy-MM-dd');
            if (!salesByDate[dateKey]) {
                salesByDate[dateKey] = { revenue: 0, orders: 0, items: 0 };
            }
            salesByDate[dateKey].revenue += order.total;
            salesByDate[dateKey].orders += 1;
            salesByDate[dateKey].items += order.items.reduce((s, item) => s + item.quantity, 0);
        });
        const chartData = Object.entries(salesByDate).map(([date, data]) => ({
            date,
            revenue: data.revenue,
            orders: data.orders,
            items: data.items
        }));
        res.json({
            summary: {
                totalRevenue,
                totalOrders,
                totalItems,
                averageOrderValue,
                period: {
                    start: (0, date_fns_1.format)(start, 'yyyy-MM-dd'),
                    end: (0, date_fns_1.format)(end, 'yyyy-MM-dd')
                }
            },
            chartData
        });
    }
    catch (error) {
        console.error('Sales report error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getSalesReport = getSalesReport;
// GET /api/admin/reports/products - Product Performance Report
const getProductReport = async (req, res) => {
    try {
        const { startDate, endDate, limit = 20 } = req.query;
        const start = startDate ? new Date(startDate) : (0, date_fns_1.subDays)(new Date(), 30);
        const end = endDate ? new Date(endDate) : new Date();
        const orderItems = await prisma.orderItem.findMany({
            where: {
                order: {
                    createdAt: {
                        gte: (0, date_fns_1.startOfDay)(start),
                        lte: (0, date_fns_1.endOfDay)(end)
                    },
                    status: { not: 'CANCELLED' }
                }
            },
            include: {
                order: true
            }
        });
        // Aggregate by item name
        const productStats = {};
        orderItems.forEach(item => {
            if (!productStats[item.name]) {
                productStats[item.name] = { quantity: 0, revenue: 0, orders: 0 };
            }
            productStats[item.name].quantity += item.quantity;
            productStats[item.name].revenue += item.price * item.quantity;
            productStats[item.name].orders += 1;
        });
        // Convert to array and sort
        const products = Object.entries(productStats).map(([name, stats]) => ({
            name,
            quantity: stats.quantity,
            revenue: stats.revenue,
            orders: stats.orders,
            averagePrice: stats.revenue / stats.quantity
        }));
        const topSelling = products.sort((a, b) => b.quantity - a.quantity).slice(0, Number(limit));
        const topRevenue = products.sort((a, b) => b.revenue - a.revenue).slice(0, Number(limit));
        const slowMoving = products.sort((a, b) => a.quantity - b.quantity).slice(0, Number(limit));
        res.json({
            topSelling,
            topRevenue,
            slowMoving,
            totalProducts: products.length
        });
    }
    catch (error) {
        console.error('Product report error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getProductReport = getProductReport;
// GET /api/admin/reports/coupons - Coupon Usage Report
const getCouponReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate) : (0, date_fns_1.subDays)(new Date(), 30);
        const end = endDate ? new Date(endDate) : new Date();
        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: (0, date_fns_1.startOfDay)(start),
                    lte: (0, date_fns_1.endOfDay)(end)
                },
                couponCode: { not: null },
                status: { not: 'CANCELLED' }
            }
        });
        // Aggregate by coupon code
        const couponStats = {};
        orders.forEach(order => {
            if (order.couponCode) {
                if (!couponStats[order.couponCode]) {
                    couponStats[order.couponCode] = { uses: 0, totalDiscount: 0, revenue: 0 };
                }
                couponStats[order.couponCode].uses += 1;
                couponStats[order.couponCode].totalDiscount += order.discountAmount;
                couponStats[order.couponCode].revenue += order.total;
            }
        });
        const coupons = Object.entries(couponStats).map(([code, stats]) => ({
            code,
            uses: stats.uses,
            totalDiscount: stats.totalDiscount,
            revenue: stats.revenue,
            averageDiscount: stats.totalDiscount / stats.uses
        }));
        const totalDiscountGiven = coupons.reduce((sum, c) => sum + c.totalDiscount, 0);
        const totalCouponOrders = orders.length;
        res.json({
            summary: {
                totalCouponOrders,
                totalDiscountGiven,
                uniqueCoupons: coupons.length
            },
            coupons: coupons.sort((a, b) => b.uses - a.uses)
        });
    }
    catch (error) {
        console.error('Coupon report error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getCouponReport = getCouponReport;
// GET /api/admin/reports/delivery-partners - Delivery Partner Performance
const getDeliveryPartnerReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate) : (0, date_fns_1.subDays)(new Date(), 30);
        const end = endDate ? new Date(endDate) : new Date();
        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: (0, date_fns_1.startOfDay)(start),
                    lte: (0, date_fns_1.endOfDay)(end)
                },
                deliveryPartnerId: { not: null },
                status: 'DELIVERED'
            },
            include: {
                deliveryPartner: true
            }
        });
        // Aggregate by partner
        const partnerStats = {};
        orders.forEach(order => {
            if (order.deliveryPartner) {
                const partnerId = order.deliveryPartner.id;
                if (!partnerStats[partnerId]) {
                    partnerStats[partnerId] = {
                        name: order.deliveryPartner.name,
                        orders: 0,
                        revenue: 0
                    };
                }
                partnerStats[partnerId].orders += 1;
                partnerStats[partnerId].revenue += order.total;
            }
        });
        const partners = Object.entries(partnerStats).map(([id, stats]) => ({
            id,
            name: stats.name,
            orders: stats.orders,
            revenue: stats.revenue,
            averageOrderValue: stats.revenue / stats.orders
        }));
        res.json({
            partners: partners.sort((a, b) => b.orders - a.orders),
            totalDeliveries: orders.length
        });
    }
    catch (error) {
        console.error('Delivery partner report error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getDeliveryPartnerReport = getDeliveryPartnerReport;
// GET /api/admin/reports/customers - Customer Report
const getCustomerReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate) : (0, date_fns_1.subDays)(new Date(), 30);
        const end = endDate ? new Date(endDate) : new Date();
        // New customers in period
        const newCustomers = await prisma.user.count({
            where: {
                createdAt: {
                    gte: (0, date_fns_1.startOfDay)(start),
                    lte: (0, date_fns_1.endOfDay)(end)
                },
                role: 'CUSTOMER'
            }
        });
        // Orders in period
        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: (0, date_fns_1.startOfDay)(start),
                    lte: (0, date_fns_1.endOfDay)(end)
                },
                status: { not: 'CANCELLED' }
            },
            include: {
                user: true
            }
        });
        // Customer stats
        const customerStats = {};
        orders.forEach(order => {
            if (order.user) {
                const userId = order.user.id;
                if (!customerStats[userId]) {
                    customerStats[userId] = {
                        name: order.user.name,
                        orders: 0,
                        revenue: 0
                    };
                }
                customerStats[userId].orders += 1;
                customerStats[userId].revenue += order.total;
            }
        });
        const customers = Object.entries(customerStats).map(([id, stats]) => ({
            id,
            name: stats.name,
            orders: stats.orders,
            revenue: stats.revenue,
            averageOrderValue: stats.revenue / stats.orders
        }));
        const topCustomers = customers.sort((a, b) => b.revenue - a.revenue).slice(0, 20);
        const returningCustomers = customers.filter(c => c.orders > 1).length;
        res.json({
            summary: {
                newCustomers,
                returningCustomers,
                totalCustomers: customers.length,
                repeatRate: customers.length > 0 ? (returningCustomers / customers.length) * 100 : 0
            },
            topCustomers
        });
    }
    catch (error) {
        console.error('Customer report error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getCustomerReport = getCustomerReport;
// GET /api/admin/reports/overview - Complete Overview
const getOverviewReport = async (req, res) => {
    try {
        const today = new Date();
        const last30Days = (0, date_fns_1.subDays)(today, 30);
        const [totalOrders, totalRevenue, totalCustomers, activeOrders, todayOrders, todayRevenue] = await Promise.all([
            prisma.order.count({ where: { status: { not: 'CANCELLED' } } }),
            prisma.order.aggregate({
                where: { status: { not: 'CANCELLED' } },
                _sum: { total: true }
            }),
            prisma.user.count({ where: { role: 'CUSTOMER' } }),
            prisma.order.count({
                where: {
                    status: {
                        in: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY']
                    }
                }
            }),
            prisma.order.count({
                where: {
                    createdAt: { gte: (0, date_fns_1.startOfDay)(today) },
                    status: { not: 'CANCELLED' }
                }
            }),
            prisma.order.aggregate({
                where: {
                    createdAt: { gte: (0, date_fns_1.startOfDay)(today) },
                    status: { not: 'CANCELLED' }
                },
                _sum: { total: true }
            })
        ]);
        res.json({
            allTime: {
                totalOrders,
                totalRevenue: totalRevenue._sum.total || 0,
                totalCustomers,
                averageOrderValue: totalOrders > 0 ? (totalRevenue._sum.total || 0) / totalOrders : 0
            },
            today: {
                orders: todayOrders,
                revenue: todayRevenue._sum.total || 0,
                activeOrders
            }
        });
    }
    catch (error) {
        console.error('Overview report error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getOverviewReport = getOverviewReport;

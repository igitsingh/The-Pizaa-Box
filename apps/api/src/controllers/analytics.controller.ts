import { Request, Response } from 'express';
import prisma from '../config/db';

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        // 1. Total Revenue
        const revenueAgg = await prisma.order.aggregate({
            _sum: {
                total: true,
            },
        });
        const totalRevenue = revenueAgg._sum.total || 0;

        // 2. Total Orders
        const totalOrders = await prisma.order.count();

        // 3. Orders by Status
        const ordersByStatus = await prisma.order.groupBy({
            by: ['status'],
            _count: {
                id: true,
            },
        });

        // Format for frontend
        const statusDistribution = ordersByStatus.map((item: { status: string; _count: { id: number } }) => ({
            name: item.status,
            value: item._count.id,
        }));

        // 4. Repeat Customer Rate
        const customersWithOrders = await prisma.user.findMany({
            where: {
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
        const repeatCustomerRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

        // 5. Top Selling Items
        const topItems = await prisma.orderItem.groupBy({
            by: ['itemId', 'name'],
            _sum: {
                quantity: true
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: 5
        });

        // 6. Recent Orders (Last 5)
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: { name: true, phone: true },
                },
            },
        });

        res.json({
            totalRevenue,
            totalOrders,
            statusDistribution,
            repeatCustomerRate,
            topItems,
            recentOrders,
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Failed to fetch analytics' });
    }
};

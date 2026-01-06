import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isVIP: true,
                createdAt: true,
                _count: {
                    select: { orders: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                orders: {
                    include: { Item: true },
                    orderBy: { createdAt: 'desc' },
                },
                addresses: true
            }
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Calculate LTV
        const ltv = user.orders.reduce((acc, order) => acc + (order.status !== 'CANCELLED' ? order.total : 0), 0);

        res.json({
            ...user,
            ltv,
            totalOrders: user.orders.length
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { notes, isVIP } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: { notes, isVIP }
        });
        res.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getStaff = async (req: Request, res: Response) => {
    try {
        const staff = await prisma.user.findMany({
            where: {
                role: {
                    in: ['ADMIN', 'MANAGER', 'CHEF', 'DELIVERY_PARTNER', 'ACCOUNTANT']
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            },
            orderBy: {
                name: 'asc'
            }
        });
        res.json(staff);
    } catch (error) {
        console.error('Get staff error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

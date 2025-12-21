import { Request, Response } from 'express';
import prisma from '../../config/db';

export const getMembershipOverview = async (req: Request, res: Response) => {
    try {
        const [tierCounts, topMembers] = await Promise.all([
            prisma.user.groupBy({
                by: ['membershipTier'],
                _count: {
                    _all: true
                }
            }),
            prisma.user.findMany({
                where: {
                    lifetimeSpending: {
                        gt: 0
                    }
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    membershipTier: true,
                    membershipPoints: true,
                    lifetimeSpending: true
                },
                orderBy: {
                    lifetimeSpending: 'desc'
                },
                take: 10
            })
        ]);

        const stats = {
            BRONZE: 0,
            SILVER: 0,
            GOLD: 0,
            PLATINUM: 0
        };

        tierCounts.forEach(tc => {
            // @ts-ignore
            stats[tc.membershipTier] = tc._count._all;
        });

        res.json({
            stats,
            topMembers
        });
    } catch (error) {
        console.error('Get membership overview error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllMembers = async (req: Request, res: Response) => {
    try {
        const members = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                membershipTier: true,
                membershipPoints: true,
                lifetimeSpending: true,
                createdAt: true
            },
            orderBy: {
                lifetimeSpending: 'desc'
            }
        });
        res.json(members);
    } catch (error) {
        console.error('Get all members error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

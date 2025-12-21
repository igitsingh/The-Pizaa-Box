import { Request, Response } from 'express';
import prisma from '../../config/db';

export const getReferralOverview = async (req: Request, res: Response) => {
    try {
        const [totalReferrals, totalRewards, topReferrers] = await Promise.all([
            prisma.user.aggregate({
                _sum: {
                    totalReferrals: true
                }
            }),
            prisma.user.aggregate({
                _sum: {
                    referralReward: true
                }
            }),
            prisma.user.findMany({
                where: {
                    totalReferrals: {
                        gt: 0
                    }
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    referralCode: true,
                    totalReferrals: true,
                    referralReward: true
                },
                orderBy: {
                    totalReferrals: 'desc'
                },
                take: 10
            })
        ]);

        res.json({
            stats: {
                totalCount: totalReferrals._sum.totalReferrals || 0,
                totalRewardsDistributed: totalRewards._sum.referralReward || 0
            },
            topReferrers
        });
    } catch (error) {
        console.error('Get referral overview error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllReferralTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await prisma.referralTransaction.findMany({
            include: {
                referrer: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                referee: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(transactions);
    } catch (error) {
        console.error('Get referral transactions error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

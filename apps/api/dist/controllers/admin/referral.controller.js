"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllReferralTransactions = exports.getReferralOverview = void 0;
const db_1 = __importDefault(require("../../config/db"));
const getReferralOverview = async (req, res) => {
    try {
        const [totalReferrals, totalRewards, topReferrers] = await Promise.all([
            db_1.default.user.aggregate({
                _sum: {
                    totalReferrals: true
                }
            }),
            db_1.default.user.aggregate({
                _sum: {
                    referralReward: true
                }
            }),
            db_1.default.user.findMany({
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
    }
    catch (error) {
        console.error('Get referral overview error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getReferralOverview = getReferralOverview;
const getAllReferralTransactions = async (req, res) => {
    try {
        const transactions = await db_1.default.referralTransaction.findMany({
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
    }
    catch (error) {
        console.error('Get referral transactions error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllReferralTransactions = getAllReferralTransactions;

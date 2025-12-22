"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMembers = exports.getMembershipOverview = void 0;
const db_1 = __importDefault(require("../../config/db"));
const getMembershipOverview = async (req, res) => {
    try {
        const [tierCounts, topMembers] = await Promise.all([
            db_1.default.user.groupBy({
                by: ['membershipTier'],
                _count: {
                    _all: true
                }
            }),
            db_1.default.user.findMany({
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
    }
    catch (error) {
        console.error('Get membership overview error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getMembershipOverview = getMembershipOverview;
const getAllMembers = async (req, res) => {
    try {
        const members = await db_1.default.user.findMany({
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
    }
    catch (error) {
        console.error('Get all members error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllMembers = getAllMembers;

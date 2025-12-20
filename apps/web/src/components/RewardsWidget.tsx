'use client';

import { useEffect, useState } from 'react';
import { Trophy, Gift } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

const TIER_COLORS = {
    BRONZE: 'text-amber-700',
    SILVER: 'text-gray-500',
    GOLD: 'text-yellow-500',
    PLATINUM: 'text-purple-500'
};

export default function RewardsWidget() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/membership/my-tier');
            setData(res.data);
        } catch (error) {
            // User not logged in or error
        }
    };

    if (!data) return null;

    const tierColor = TIER_COLORS[data.tier as keyof typeof TIER_COLORS];

    return (
        <Link href="/rewards" className="block">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-orange-100">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Trophy className={`w-5 h-5 ${tierColor}`} />
                        <span className={`font-bold text-sm ${tierColor}`}>{data.tier}</span>
                    </div>
                    <span className="text-xs text-gray-600">{data.points} pts</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Gift className="w-4 h-4" />
                    <span>{data.benefits.discount}% off • {data.benefits.freeDelivery ? 'Free' : 'Paid'} delivery</span>
                </div>
                {data.nextTier && (
                    <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className="bg-orange-500 h-1.5 rounded-full transition-all"
                                style={{ width: `${Math.min(data.progressToNext, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {data.progressToNext.toFixed(0)}% to {data.nextTier}
                        </p>
                    </div>
                )}
            </div>
        </Link>
    );
}

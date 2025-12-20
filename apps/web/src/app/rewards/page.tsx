'use client';

import { useState, useEffect } from 'react';
import { Gift, Users, Copy, Check, Share2, Trophy, Crown, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import api from '@/lib/api';
import { format } from 'date-fns';

const TIER_COLORS = {
    BRONZE: 'from-amber-700 to-amber-900',
    SILVER: 'from-gray-400 to-gray-600',
    GOLD: 'from-yellow-400 to-yellow-600',
    PLATINUM: 'from-purple-400 to-purple-600'
};

const TIER_ICONS = {
    BRONZE: Award,
    SILVER: Star,
    GOLD: Trophy,
    PLATINUM: Crown
};

export default function RewardsPage() {
    const [referralData, setReferralData] = useState<any>(null);
    const [membershipData, setMembershipData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [referralRes, membershipRes] = await Promise.all([
                api.get('/referral/my-code'),
                api.get('/membership/my-tier')
            ]);
            setReferralData(referralRes.data);
            setMembershipData(membershipRes.data);
        } catch (error: any) {
            if (error.response?.status === 401) {
                toast.error('Please login to view your rewards');
            } else {
                toast.error('Failed to load rewards data');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const copyReferralCode = () => {
        if (referralData?.referralCode) {
            navigator.clipboard.writeText(referralData.referralCode);
            setCopied(true);
            toast.success('Referral code copied!');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareReferral = () => {
        const text = `Join The Pizza Box using my referral code ${referralData?.referralCode} and get ₹50 off on your first order! 🍕`;
        const url = `${window.location.origin}?ref=${referralData?.referralCode}`;

        if (navigator.share) {
            navigator.share({ title: 'Join The Pizza Box', text, url });
        } else {
            navigator.clipboard.writeText(`${text}\n${url}`);
            toast.success('Referral link copied!');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your rewards...</p>
                </div>
            </div>
        );
    }

    const TierIcon = membershipData ? TIER_ICONS[membershipData.tier as keyof typeof TIER_ICONS] : Award;
    const tierGradient = membershipData ? TIER_COLORS[membershipData.tier as keyof typeof TIER_COLORS] : TIER_COLORS.BRONZE;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Rewards & Benefits</h1>
                    <p className="text-gray-600 text-lg">Earn rewards, refer friends, and unlock exclusive benefits</p>
                </div>

                {/* Membership Card */}
                {membershipData && (
                    <Card className={`mb-8 overflow-hidden border-0 shadow-xl bg-gradient-to-br ${tierGradient}`}>
                        <CardContent className="p-8 text-white">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <TierIcon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold">{membershipData.tier} MEMBER</h2>
                                        <p className="text-white/80">Member since {format(new Date(membershipData.memberSince), 'MMM yyyy')}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/80 text-sm">Membership Points</p>
                                    <p className="text-4xl font-bold">{membershipData.points.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                    <p className="text-white/80 text-sm mb-1">Discount</p>
                                    <p className="text-2xl font-bold">{membershipData.benefits.discount}%</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                    <p className="text-white/80 text-sm mb-1">Free Delivery</p>
                                    <p className="text-2xl font-bold">{membershipData.benefits.freeDelivery ? '✓' : '✗'}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                    <p className="text-white/80 text-sm mb-1">Priority Support</p>
                                    <p className="text-2xl font-bold">{membershipData.benefits.prioritySupport ? '✓' : '✗'}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                    <p className="text-white/80 text-sm mb-1">Points</p>
                                    <p className="text-2xl font-bold">{membershipData.benefits.pointsMultiplier}x</p>
                                </div>
                            </div>

                            {membershipData.nextTier && (
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Progress to {membershipData.nextTier}</span>
                                        <span>{membershipData.progressToNext.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-white h-full rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(membershipData.progressToNext, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-white/80 text-sm mt-2">
                                        Spend ₹{(membershipData.nextTierThreshold - membershipData.lifetimeSpending).toLocaleString()} more to unlock {membershipData.nextTier}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Referral Card */}
                    <Card className="shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                            <CardTitle className="flex items-center gap-2">
                                <Gift className="w-6 h-6" />
                                Refer & Earn
                            </CardTitle>
                            <CardDescription className="text-white/90">
                                Share your code and earn ₹100 per referral
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {referralData?.referralCode ? (
                                <>
                                    <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
                                        <p className="text-sm text-gray-600 mb-2">Your Referral Code</p>
                                        <div className="flex items-center justify-center gap-3">
                                            <p className="text-3xl font-bold font-mono text-orange-600">
                                                {referralData.referralCode}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={copyReferralCode}
                                                className="hover:bg-orange-100"
                                            >
                                                {copied ? (
                                                    <Check className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <Copy className="w-5 h-5 text-gray-600" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                                            <p className="text-sm text-green-700 mb-1">Total Referrals</p>
                                            <p className="text-3xl font-bold text-green-600">{referralData.totalReferrals}</p>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                                            <p className="text-sm text-blue-700 mb-1">Rewards Earned</p>
                                            <p className="text-3xl font-bold text-blue-600">₹{referralData.referralReward}</p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={shareReferral}
                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12"
                                    >
                                        <Share2 className="mr-2 h-5 w-5" />
                                        Share Referral Code
                                    </Button>

                                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <p className="text-sm font-semibold text-yellow-900 mb-2">How it works:</p>
                                        <ul className="text-sm text-yellow-800 space-y-1">
                                            <li>• Share your code with friends</li>
                                            <li>• They get ₹50 off their first order</li>
                                            <li>• You earn ₹100 credit per referral</li>
                                            <li>• Unlimited referrals!</li>
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Loading referral code...</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tier Benefits */}
                    <Card className="shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-6 h-6" />
                                Membership Tiers
                            </CardTitle>
                            <CardDescription className="text-white/90">
                                Unlock exclusive benefits as you spend
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {[
                                    { tier: 'BRONZE', threshold: 0, discount: 0, delivery: false, support: false, points: '1x' },
                                    { tier: 'SILVER', threshold: 5000, discount: 5, delivery: false, support: false, points: '1.5x' },
                                    { tier: 'GOLD', threshold: 15000, discount: 10, delivery: true, support: true, points: '2x' },
                                    { tier: 'PLATINUM', threshold: 50000, discount: 15, delivery: true, support: true, points: '3x' }
                                ].map((tier) => {
                                    const isCurrent = membershipData?.tier === tier.tier;
                                    const TierIconComponent = TIER_ICONS[tier.tier as keyof typeof TIER_ICONS];

                                    return (
                                        <div
                                            key={tier.tier}
                                            className={`p-4 rounded-lg border-2 transition-all ${isCurrent
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <TierIconComponent className={`w-5 h-5 ${isCurrent ? 'text-orange-600' : 'text-gray-400'}`} />
                                                    <span className={`font-bold ${isCurrent ? 'text-orange-600' : 'text-gray-700'}`}>
                                                        {tier.tier}
                                                    </span>
                                                    {isCurrent && (
                                                        <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded-full">
                                                            Current
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-sm text-gray-600">₹{tier.threshold.toLocaleString()}+</span>
                                            </div>
                                            <div className="flex gap-4 text-xs text-gray-600">
                                                <span>{tier.discount}% off</span>
                                                <span>{tier.delivery ? '✓' : '✗'} Free delivery</span>
                                                <span>{tier.support ? '✓' : '✗'} Priority</span>
                                                <span>{tier.points} points</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

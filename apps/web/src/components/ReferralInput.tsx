'use client';

import { useState } from 'react';
import { Gift, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { toast } from 'sonner';

interface ReferralInputProps {
    onApplied?: () => void;
}

export default function ReferralInput({ onApplied }: ReferralInputProps) {
    const [code, setCode] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [applied, setApplied] = useState(false);

    const applyCode = async () => {
        if (!code.trim()) {
            toast.error('Please enter a referral code');
            return;
        }

        setIsApplying(true);
        try {
            const res = await api.post('/referral/apply', { referralCode: code.toUpperCase() });
            toast.success(res.data.message || 'Referral code applied! You\'ll get ₹50 off your first order.');
            setApplied(true);
            if (onApplied) onApplied();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid referral code');
        } finally {
            setIsApplying(false);
        }
    };

    if (applied) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-green-900">Referral Applied!</p>
                    <p className="text-sm text-green-700">You'll get ₹50 off your first order</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
                <Gift className="w-5 h-5 text-orange-600" />
                <p className="font-semibold text-orange-900">Have a referral code?</p>
            </div>
            <p className="text-sm text-orange-700 mb-3">
                Enter a friend's code and get ₹50 off your first order!
            </p>
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Enter code (e.g., SAC8X2K9)"
                    value={code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value.toUpperCase())}
                    className="flex-1 uppercase font-mono"
                    maxLength={10}
                />
                <Button
                    onClick={applyCode}
                    disabled={isApplying || !code.trim()}
                    className="bg-orange-600 hover:bg-orange-700"
                >
                    {isApplying ? 'Applying...' : 'Apply'}
                </Button>
            </div>
        </div>
    );
}

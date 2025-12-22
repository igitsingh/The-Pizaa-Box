'use client';

import { Gift, PartyPopper } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function HolidayBanner() {
    const [isVisible, setIsVisible] = useState(true);
    const [couponCode, setCouponCode] = useState('NY2026');

    useEffect(() => {
        const fetchCoupon = async () => {
            try {
                const res = await api.get('/coupons/active');
                if (res.data && res.data.code) {
                    setCouponCode(res.data.code);
                }
            } catch (error) {
                console.error('Failed to fetch active coupon:', error);
            }
        };
        fetchCoupon();
    }, []);

    if (!isVisible) return null;

    return (
        <div className="relative bg-[#C62828] text-white py-2 px-4 shadow-sm">
            <div className="container mx-auto flex items-center justify-center gap-3 relative z-10 text-xs md:text-sm font-medium tracking-wide">
                <Gift className="w-4 h-4 text-white/90" />
                <p className="text-center">
                    <span className="opacity-95">Merry Christmas & Happy New Year!</span>
                    <span className="hidden md:inline mx-3 opacity-50">|</span>
                    <span className="block md:inline mt-1 md:mt-0">
                        Use Code: <span className="font-bold bg-white text-[#1B5E20] px-1.5 py-0.5 rounded ml-1">{couponCode}</span>
                    </span>
                </p>
                <PartyPopper className="w-4 h-4 text-white/90" />

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:opacity-70 transition-opacity"
                    aria-label="Close banner"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

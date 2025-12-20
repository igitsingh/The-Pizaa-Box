'use client';

import { Gift, Sparkles, PartyPopper } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HolidayBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white py-3 px-4 overflow-hidden">
            {/* Animated background sparkles */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
                <div className="absolute top-1 right-1/3 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-ping delay-100" />
                <div className="absolute bottom-1 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-200" />
            </div>

            <div className="container mx-auto flex items-center justify-center gap-4 relative z-10">
                <Gift className="w-5 h-5 animate-bounce" />
                <p className="text-sm md:text-base font-semibold text-center">
                    🎄 <span className="animate-pulse">Merry Christmas & Happy New Year!</span> 🎉
                    <span className="ml-2 hidden md:inline">Get 20% OFF on all orders with code: <span className="font-bold bg-white text-red-600 px-2 py-1 rounded">NEWYEAR2025</span></span>
                </p>
                <PartyPopper className="w-5 h-5 animate-bounce delay-100" />

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 transition-colors"
                    aria-label="Close banner"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

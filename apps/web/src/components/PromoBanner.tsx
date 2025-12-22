'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PromoBanner() {
    return (
        <div className="px-4 py-3 md:py-6">
            <div
                className="rounded-2xl p-4 md:p-10 text-white shadow-lg relative overflow-hidden"
                style={{
                    backgroundImage: 'url(/cheese-volcano-banner.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Dark overlay for text readability - fades out at 60% to keep pizza clear */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 via-40% to-transparent to-60% z-0"></div>

                <div className="relative z-10 max-w-lg">
                    <span className="inline-block bg-[#1B5E20] text-white text-[8px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded mb-2 md:mb-3">
                        NEW ARRIVAL
                    </span>
                    <h2 className="font-extrabold mb-2 md:mb-4 leading-tight" style={{ fontSize: 'clamp(1.25rem, 5vw, 3rem)' }}>
                        Cheese Volcano Pizza 🌋
                    </h2>
                    <p className="text-gray-100 mb-4 md:mb-8 font-medium leading-snug" style={{ fontSize: 'clamp(0.75rem, 2.5vw, 1.125rem)' }}>
                        Exploding with molten cheese in the center. Dip your crusts!
                    </p>
                    <Link href="/menu">
                        <Button className="bg-[#C62828] text-white hover:bg-[#B71C1C] font-bold rounded-full border-none h-8 text-xs px-4 md:h-11 md:text-base md:px-8">
                            Order Now
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

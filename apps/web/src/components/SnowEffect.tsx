'use client';

import { useEffect, useState } from 'react';

interface Snowflake {
    id: number;
    left: number;
    animationDuration: number;
    opacity: number;
    size: number;
}

export default function SnowEffect() {
    const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Create 50 snowflakes
        const flakes: Snowflake[] = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            animationDuration: Math.random() * 3 + 2, // 2-5 seconds
            opacity: Math.random() * 0.6 + 0.4, // 0.4-1
            size: Math.random() * 4 + 2, // 2-6px
        }));
        setSnowflakes(flakes);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute animate-snowfall"
                    style={{
                        left: `${flake.left}%`,
                        animationDuration: `${flake.animationDuration}s`,
                        opacity: flake.opacity,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                    }}
                >
                    <div className="w-full h-full bg-white rounded-full shadow-lg" />
                </div>
            ))}
        </div>
    );
}

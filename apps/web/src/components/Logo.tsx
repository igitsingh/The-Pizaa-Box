'use client';

import { Pizza } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LightBulb {
    id: number;
    color: string;
    position: { x: number; y: number };
    delay: number;
}

export default function Logo({ className = "" }: { className?: string }) {
    const [lights, setLights] = useState<LightBulb[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Create jhaalaar path around logo (arc shape)
        const bulbCount = 16; // Total bulbs
        const colors = ['#E63946', '#2A9D55']; // Red and Green
        const bulbs: LightBulb[] = [];

        // Create arc path coordinates (top and sides)
        for (let i = 0; i < bulbCount; i++) {
            const angle = (i / (bulbCount - 1)) * Math.PI; // Semi-circle from 0 to π
            const radius = 45; // Distance from center
            const centerX = 50; // Center of logo
            const centerY = 60; // Slightly below top

            const x = centerX + radius * Math.cos(angle + Math.PI); // Offset to start from left
            const y = centerY - radius * Math.sin(angle) * 0.6; // Flatten the arc slightly

            bulbs.push({
                id: i,
                color: colors[i % 2], // Alternate red and green
                position: { x, y },
                delay: i * 0.15, // Stagger animation
            });
        }

        setLights(bulbs);
    }, []);

    if (!mounted) {
        return (
            <div className={`flex items-center gap-2 font-bold text-xl tracking-tight ${className}`}>
                <div className="bg-orange-500 p-1.5 rounded-lg text-white">
                    <Pizza size={24} />
                </div>
                <span className="text-orange-900">The Pizza Box</span>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            {/* Jhaalaar String Lights Container */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                {/* Thin wire path (SVG for smooth curve) */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    style={{ overflow: 'visible' }}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M 5 60 Q 50 10, 95 60"
                        fill="none"
                        stroke="rgba(139, 69, 19, 0.3)"
                        strokeWidth="0.5"
                        className="drop-shadow-sm"
                    />
                </svg>

                {/* Light Bulbs */}
                {lights.map((bulb) => (
                    <div
                        key={bulb.id}
                        className="absolute festive-bulb"
                        style={{
                            left: `${bulb.position.x}%`,
                            top: `${bulb.position.y}%`,
                            transform: 'translate(-50%, -50%)',
                            animationDelay: `${bulb.delay}s`,
                        }}
                    >
                        {/* Glow halo */}
                        <div
                            className="absolute inset-0 rounded-full blur-md"
                            style={{
                                width: '16px',
                                height: '16px',
                                backgroundColor: bulb.color,
                                opacity: 0.4,
                                transform: 'translate(-25%, -25%)',
                            }}
                        />
                        {/* Bulb */}
                        <div
                            className="relative rounded-full"
                            style={{
                                width: '7px',
                                height: '7px',
                                backgroundColor: bulb.color,
                                boxShadow: `
                  0 0 8px ${bulb.color}80,
                  0 0 12px ${bulb.color}60,
                  0 2px 4px rgba(0, 0, 0, 0.2)
                `,
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Original Logo (on top) */}
            <div className="relative flex items-center gap-2 font-bold text-xl tracking-tight" style={{ zIndex: 10 }}>
                <div className="bg-orange-500 p-1.5 rounded-lg text-white">
                    <Pizza size={24} />
                </div>
                <span className="text-orange-900">The Pizza Box</span>
            </div>
        </div>
    );
}

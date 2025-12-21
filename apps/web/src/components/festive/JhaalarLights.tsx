"use client";

import { useEffect, useState } from 'react';
import { FESTIVE_CONFIG } from '@/lib/festive-config';
import { cn } from '@/lib/utils';

interface JhaalarProps {
    className?: string;
    bulbCount?: number;
    size?: 'sm' | 'md' | 'lg';
}

export function JhaalarLights({ className, bulbCount = 12, size = 'md' }: JhaalarProps) {
    if (!FESTIVE_CONFIG.isEnabled) return null;

    return (
        <div className={cn("flex justify-between items-start pointer-events-none select-none z-50 absolute w-full -top-1", className)}>
            {Array.from({ length: bulbCount }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "rounded-full shadow-lg transition-all duration-1000",
                        "animate-[pulse_2s_ease-in-out_infinite]",
                        size === 'sm' && "w-1 h-1",
                        size === 'md' && "w-1.5 h-1.5",
                        size === 'lg' && "w-2 h-2"
                    )}
                    style={{
                        backgroundColor: i % 3 === 0 ? FESTIVE_CONFIG.theme.colors.red :
                            i % 3 === 1 ? FESTIVE_CONFIG.theme.colors.green :
                                FESTIVE_CONFIG.theme.colors.gold,
                        boxShadow: `0 0 ${size === 'lg' ? '12px' : '8px'} 2px ${i % 3 === 0 ? FESTIVE_CONFIG.theme.colors.red :
                                i % 3 === 1 ? FESTIVE_CONFIG.theme.colors.green :
                                    FESTIVE_CONFIG.theme.colors.gold
                            }`,
                        animationDelay: `${i * 0.2}s`,
                        marginTop: i % 2 === 0 ? '0px' : size === 'lg' ? '10px' : '6px' // Organic offset
                    }}
                />
            ))}

            {/* Thread Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-800/20" />
        </div>
    );
}

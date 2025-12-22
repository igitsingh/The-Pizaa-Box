import React from 'react';
import { Crown, Flame } from 'lucide-react';

interface ItemTagsProps {
    isVeg?: boolean;
    isSpicy?: boolean;
    isBestSeller?: boolean;
    isAvailable?: boolean;
    className?: string;
}

export default function ItemTags({
    isVeg = true,
    isSpicy = false,
    isBestSeller = false,
    isAvailable = true,
    className = ''
}: ItemTagsProps) {
    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            {/* Availability - Green Dot */}
            {isAvailable && (
                <div className="flex items-center gap-1" title="Available">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
            )}

            {/* Vegetarian/Non-Vegetarian */}
            {isVeg ? (
                <div className="border-2 border-green-600 w-4 h-4 flex items-center justify-center rounded-sm" title="Vegetarian">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
            ) : (
                <div className="border-2 border-red-600 w-4 h-4 flex items-center justify-center rounded-sm" title="Non-Vegetarian">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                </div>
            )}

            {/* Spicy - Red Chilli */}
            {isSpicy && (
                <div className="text-red-600" title="Spicy">
                    <Flame className="w-4 h-4 fill-red-600" />
                </div>
            )}

            {/* Bestseller - Crown */}
            {isBestSeller && (
                <div className="text-yellow-600" title="Bestseller">
                    <Crown className="w-4 h-4 fill-yellow-600" />
                </div>
            )}
        </div>
    );
}

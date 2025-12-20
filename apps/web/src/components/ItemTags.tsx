import React from 'react';
import { Crown, Flame } from 'lucide-react';

interface ItemTagsProps {
    isVeg?: boolean;
    isSpicy?: boolean;
    isBestSeller?: boolean;
    isAvailable?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function ItemTags({
    isVeg = true,
    isSpicy = false,
    isBestSeller = false,
    isAvailable = true,
    size = 'md',
    className = ''
}: ItemTagsProps) {
    const sizeClasses = {
        sm: 'gap-1',
        md: 'gap-1.5',
        lg: 'gap-2'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const dotSizes = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-2.5 h-2.5'
    };

    return (
        <div className={`flex items-center ${sizeClasses[size]} ${className}`}>
            {/* Availability - Green Dot */}
            {isAvailable && (
                <div className="flex items-center" title="Available">
                    <div className={`${dotSizes[size]} rounded-full bg-green-600`}></div>
                </div>
            )}

            {/* Vegetarian/Non-Vegetarian */}
            {isVeg ? (
                <div className={`border-2 border-green-600 ${iconSizes[size]} flex items-center justify-center rounded-sm`} title="Vegetarian">
                    <div className={`${dotSizes[size]} rounded-full bg-green-600`}></div>
                </div>
            ) : (
                <div className={`border-2 border-red-600 ${iconSizes[size]} flex items-center justify-center rounded-sm`} title="Non-Vegetarian">
                    <div className={`${dotSizes[size]} rounded-full bg-red-600`}></div>
                </div>
            )}

            {/* Spicy - Red Chilli */}
            {isSpicy && (
                <div className="text-red-600" title="Spicy">
                    <Flame className={`${iconSizes[size]} fill-red-600`} />
                </div>
            )}

            {/* Bestseller - Crown */}
            {isBestSeller && (
                <div className="text-yellow-600" title="Bestseller">
                    <Crown className={`${iconSizes[size]} fill-yellow-600`} />
                </div>
            )}
        </div>
    );
}

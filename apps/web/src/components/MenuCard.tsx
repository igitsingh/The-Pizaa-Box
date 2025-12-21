'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import ItemTags from '@/components/ItemTags';
import { FestiveBadge } from '@/components/festive/FestiveBadge';

interface Item {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    isVeg: boolean;
    isSpicy?: boolean;
    isBestSeller?: boolean;
    isAvailable?: boolean;
    options: any[];
    addons: any[];
}

export default function MenuCard({ item }: { item: Item }) {
    const { addToCart, cart, removeFromCart } = useStore();
    const isInCart = cart.some((cartItem) => cartItem.id === item.id);

    const handleAddToCart = () => {
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            options: {},
            addons: []
        });
    };

    const handleRemoveFromCart = () => {
        removeFromCart(item.id);
    };

    // Logic for Festive Badges (Demo Logic)
    let badgeType: 'christmas' | 'newyear' | 'family' | undefined;
    if (item.isBestSeller) {
        badgeType = 'newyear';
    } else if (item.price > 800) {
        badgeType = 'family';
    } else if (item.price > 400) {
        badgeType = 'christmas';
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-all group flex flex-col h-full relative">
            {/* Image Section - Clickable */}
            <Link href={`/menu/${item.id}`} className="relative h-48 bg-gray-100 overflow-hidden block">
                {/* Festive Badge */}
                {badgeType && <FestiveBadge type={badgeType} />}

                {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-50">🍕</div>
                )}

                {/* Tags */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1.5 rounded shadow-sm">
                    <ItemTags
                        isVeg={item.isVeg}
                        isSpicy={item.isSpicy}
                        isBestSeller={item.isBestSeller}
                        isAvailable={item.isAvailable}
                        size="sm"
                    />
                </div>

                {/* Price Tag Overlay */}
                <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-bold backdrop-blur-sm">
                    ₹{item.price}
                </div>
            </Link>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <Link href={`/menu/${item.id}`} className="hover:text-primary transition-colors">
                        <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.name}</h3>
                    </Link>
                </div>

                <p className="text-gray-500 text-xs mb-4 line-clamp-2 flex-grow">
                    {item.description || 'Delicious cheesy goodness with fresh toppings.'}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-dashed">
                    <Link href={`/menu/${item.id}`} className="text-xs font-bold flex items-center text-gray-600 hover:text-primary transition-colors">
                        Customise <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Link>

                    {isInCart ? (
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleRemoveFromCart}
                                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                            <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-md">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        const cartItem = cart.find(c => c.id === item.id);
                                        if (cartItem && cartItem.quantity > 1) {
                                            // Decrease quantity
                                            addToCart({
                                                id: item.id,
                                                name: item.name,
                                                price: item.price,
                                                quantity: -1,
                                                options: {},
                                                addons: []
                                            });
                                        } else {
                                            // Remove if quantity is 1
                                            removeFromCart(item.id);
                                        }
                                    }}
                                    className="h-8 w-8 p-0 text-green-700 hover:bg-green-100"
                                >
                                    -
                                </Button>
                                <span className="text-sm font-bold text-green-700 min-w-[20px] text-center">
                                    {cart.find(c => c.id === item.id)?.quantity || 0}
                                </span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleAddToCart}
                                    className="h-8 w-8 p-0 text-green-700 hover:bg-green-100"
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            onClick={handleAddToCart}
                            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 font-bold px-4 h-8"
                        >
                            ADD <Plus className="h-3 w-3 ml-1" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

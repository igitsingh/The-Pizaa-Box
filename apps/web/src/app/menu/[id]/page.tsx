'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { Loader2, X, Check } from 'lucide-react';

// Interfaces
interface OptionChoice {
    id: string;
    name: string;
    price: number;
}

interface ItemOption {
    id: string;
    name: string;
    choices: OptionChoice[];
}

interface ItemAddon {
    id: string;
    name: string;
    price: number;
}

interface Item {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    isVeg: boolean;
    options: ItemOption[];
    addons: ItemAddon[];
}

export default function ItemPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart, cart, removeFromCart } = useStore();

    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, OptionChoice>>({});
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

    // Get cart item for this product
    const cartItem = cart.find(c => c.id === id);
    const isInCart = !!cartItem;

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await api.get(`/menu/${id}`);
                setItem(res.data);
                // Set default options
                const defaults: Record<string, OptionChoice> = {};
                res.data.options.forEach((opt: ItemOption) => {
                    if (opt.choices.length > 0) {
                        defaults[opt.id] = opt.choices[0];
                    }
                });
                setSelectedOptions(defaults);
            } catch (error) {
                console.error('Failed to fetch item', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchItem();
    }, [id]);

    const calculateTotal = () => {
        if (!item) return 0;
        let total = item.price;

        // Add options price
        Object.values(selectedOptions).forEach(choice => {
            total += choice.price;
        });

        // Add addons price
        selectedAddons.forEach(addonId => {
            const addon = item.addons.find(a => a.id === addonId);
            if (addon) total += addon.price;
        });

        return total;
    };

    const handleAddToCart = () => {
        if (!item) return;

        addToCart({
            id: item.id,
            name: item.name,
            price: calculateTotal(),
            quantity: 1,
            options: selectedOptions,
            addons: selectedAddons.map(id => item.addons.find(a => a.id === id)),
        });
    };

    const handleIncrement = () => {
        if (!item) return;
        addToCart({
            id: item.id,
            name: item.name,
            price: calculateTotal(),
            quantity: 1,
            options: selectedOptions,
            addons: selectedAddons.map(id => item.addons.find(a => a.id === id)),
        });
    };

    const handleDecrement = () => {
        if (!item || !cartItem) return;
        if (cartItem.quantity > 1) {
            addToCart({
                id: item.id,
                name: item.name,
                price: calculateTotal(),
                quantity: -1,
                options: selectedOptions,
                addons: selectedAddons.map(id => item.addons.find(a => a.id === id)),
            });
        } else {
            removeFromCart(item.id);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!item) {
        return <div className="text-center py-20">Item not found</div>;
    }

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Header with Image */}
            <div className="relative h-64 md:h-80 bg-gradient-to-br from-orange-50 to-yellow-50">
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
                >
                    <X className="h-5 w-5" />
                </button>

                {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-9xl">🍕</div>
                )}

                {/* Veg/Non-Veg Badge */}
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full shadow-md flex items-center gap-2">
                    <div className={`border-2 ${item.isVeg ? 'border-green-600' : 'border-red-600'} w-4 h-4 flex items-center justify-center`}>
                        <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700">{item.name}</span>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <p className="text-gray-600 text-sm mb-6">{item.description || 'Classic delight with 100% real mozzarella cheese'}</p>

                {/* Options (Size, Crust, etc.) */}
                {item.options.map((option) => (
                    <div key={option.id} className="mb-8">
                        <h3 className="font-bold text-lg mb-4">{option.name}</h3>
                        <div className="space-y-2">
                            {option.choices.map((choice) => (
                                <label
                                    key={choice.id}
                                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${selectedOptions[option.id]?.id === choice.id
                                        ? 'border-green-600 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOptions[option.id]?.id === choice.id
                                            ? 'border-green-600 bg-green-600'
                                            : 'border-gray-300'
                                            }`}>
                                            {selectedOptions[option.id]?.id === choice.id && (
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                        <span className="font-medium text-gray-800">{choice.name}</span>
                                    </div>
                                    <span className="font-bold text-gray-700">₹{choice.price > 0 ? `+${choice.price}` : item.price + choice.price}</span>
                                    <input
                                        type="radio"
                                        name={option.id}
                                        checked={selectedOptions[option.id]?.id === choice.id}
                                        onChange={() => setSelectedOptions(prev => ({ ...prev, [option.id]: choice }))}
                                        className="sr-only"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Add-ons (Toppings) */}
                {item.addons.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="font-bold text-lg">Add veg toppings</h3>
                            <span className="text-green-600 text-sm">✚</span>
                        </div>
                        <div className="space-y-2">
                            {item.addons.map((addon) => (
                                <label
                                    key={addon.id}
                                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${selectedAddons.includes(addon.id)
                                        ? 'border-green-600 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedAddons.includes(addon.id)
                                            ? 'border-green-600 bg-green-600'
                                            : 'border-gray-300'
                                            }`}>
                                            {selectedAddons.includes(addon.id) && (
                                                <Check className="h-3 w-3 text-white" />
                                            )}
                                        </div>
                                        <span className="font-medium text-gray-800">{addon.name}</span>
                                    </div>
                                    <span className="font-bold text-gray-700">+ ₹{addon.price}</span>
                                    <input
                                        type="checkbox"
                                        checked={selectedAddons.includes(addon.id)}
                                        onChange={() => {
                                            setSelectedAddons(prev =>
                                                prev.includes(addon.id)
                                                    ? prev.filter(id => id !== addon.id)
                                                    : [...prev, addon.id]
                                            );
                                        }}
                                        className="sr-only"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <div>
                        <div className="text-xs text-gray-500">Regular | New Hand Tossed</div>
                        <div className="text-lg font-bold text-gray-800">₹ {calculateTotal()}</div>
                    </div>
                    {isInCart ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-green-50 border-2 border-green-200 rounded-lg px-2">
                                <Button
                                    size="lg"
                                    variant="ghost"
                                    onClick={handleDecrement}
                                    className="h-12 w-12 p-0 text-green-700 hover:bg-green-100 text-xl font-bold"
                                >
                                    -
                                </Button>
                                <span className="text-lg font-bold text-green-700 min-w-[30px] text-center">
                                    {cartItem?.quantity || 0}
                                </span>
                                <Button
                                    size="lg"
                                    variant="ghost"
                                    onClick={handleIncrement}
                                    className="h-12 w-12 p-0 text-green-700 hover:bg-green-100 text-xl font-bold"
                                >
                                    +
                                </Button>
                            </div>
                            <Button
                                size="lg"
                                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6"
                                onClick={() => router.push('/menu')}
                            >
                                Add More
                            </Button>
                        </div>
                    ) : (
                        <Button
                            size="lg"
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8"
                            onClick={handleAddToCart}
                        >
                            Add to Cart +
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

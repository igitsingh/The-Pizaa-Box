'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowRight, MapPin, Edit2, Plus, Check } from 'lucide-react';
import AddressModal from '@/components/AddressModal';
import LocationModal from '@/components/LocationModal';
import api from '@/lib/api';
import { toast } from 'sonner';

interface SavedAddress {
    id: string;
    street: string;
    city: string;
    zip: string;
}

export default function CartPage() {
    const { cart, user, removeFromCart, clearCart, deliveryAddress, setDeliveryAddress, location, setLocation, selectedAddressId, setSelectedAddressId } = useStore();
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGuestLoading, setIsGuestLoading] = useState(false);
    const router = useRouter();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    useEffect(() => {
        console.log('CartPage mounted. User:', user);
        fetchAddresses();
    }, [user]);

    const handleGuestLogin = async () => {
        try {
            setIsGuestLoading(true);
            const res = await api.post('/auth/guest');
            localStorage.setItem('token', res.data.token);
            // Update store
            useStore.getState().setUser(res.data.user);
            toast.success('Continued as guest');
            // Address modal will be available now since user is set
        } catch (err: any) {
            console.error('Guest login failed:', err);
            toast.error('Failed to create guest session');
        } finally {
            setIsGuestLoading(false);
        }
    };

    const fetchAddresses = async () => {
        if (!user) return;
        try {
            const res = await api.get('/users/addresses');
            setSavedAddresses(res.data);
            if (res.data.length > 0 && !selectedAddressId) {
                setSelectedAddressId(res.data[0].id);
            }
        } catch (error: any) {
            console.error('Failed to fetch addresses:', error);
            // If 401, it might be handled by interceptor, but for guest we shouldn't force logout if the token is valid but just this endpoint fails (unlikely if token is valid)
            // However, if we are guest, we might not have addresses yet, so 401 is bad.
            // If we are guest, we should have a valid token.
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAddress = (address: any) => {
        setDeliveryAddress(address);
        fetchAddresses(); // Refresh list
    };

    const handleSelectAddress = (addressId: string) => {
        setSelectedAddressId(addressId);
        const selected = savedAddresses.find(a => a.id === addressId);
        if (selected) {
            setDeliveryAddress({
                location: `${selected.city}`,
                houseNo: selected.street.split(',')[0] || '',
                buildingName: selected.street,
                type: 'Home'
            });
        }
    };

    const handleChangeLocation = () => {
        setIsAddressModalOpen(false);
        setIsLocationModalOpen(true);
    };

    const handleLocationSelect = (newLocation: string) => {
        setLocation(newLocation);
        setIsLocationModalOpen(false);
        setIsAddressModalOpen(true);
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-8">Looks like you haven't added any delicious pizzas yet.</p>
                <Link href="/menu">
                    <Button size="lg">Browse Menu</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Address Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-orange-500" />
                                Saved Addresses
                            </h3>
                        </div>

                        {loading ? (
                            <p className="text-gray-500 text-sm">Loading addresses...</p>
                        ) : savedAddresses.length > 0 ? (
                            <div className="space-y-3">
                                {savedAddresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        className={`p-4 rounded-lg border-2 transition-all ${selectedAddressId === addr.id
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div
                                                className="flex items-start gap-3 flex-1 cursor-pointer"
                                                onClick={() => handleSelectAddress(addr.id)}
                                            >
                                                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAddressId === addr.id
                                                    ? 'border-orange-500 bg-orange-500'
                                                    : 'border-gray-300'
                                                    }`}>
                                                    {selectedAddressId === addr.id && (
                                                        <Check className="h-3 w-3 text-white" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-800">{addr.street}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{addr.city}, {addr.zip}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // TODO: Implement edit functionality
                                                        toast.info('Edit functionality coming soon!');
                                                    }}
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (confirm('Delete this address?')) {
                                                            try {
                                                                await api.delete(`/users/addresses/${addr.id}`);
                                                                toast.success('Address deleted');
                                                                fetchAddresses();
                                                            } catch (error) {
                                                                toast.error('Failed to delete address');
                                                            }
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 text-center">
                                <p className="text-gray-500 mb-3">No saved addresses</p>
                                {!user ? (
                                    <div className="flex flex-col gap-3 justify-center items-center">
                                        <p className="text-sm text-gray-600">Login to access your saved addresses or continue as a guest.</p>
                                        <div className="flex gap-3">
                                            <Button onClick={() => router.push('/login')}>
                                                Login
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={handleGuestLogin}
                                                disabled={isGuestLoading}
                                                className="border-orange-500 text-orange-600 hover:bg-orange-50"
                                            >
                                                {isGuestLoading ? 'Creating Guest Session...' : 'Continue as Guest'}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => setIsAddressModalOpen(true)}
                                        variant="outline"
                                        className="border-orange-500 text-orange-600 hover:bg-orange-50"
                                    >
                                        <Plus className="h-4 w-4 mr-2" /> Add New Address
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {cart.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>

                                {item.options && Object.values(item.options).length > 0 && (
                                    <div className="text-sm text-gray-500 mt-1">
                                        {Object.values(item.options).map((opt: any) => opt.name).join(', ')}
                                    </div>
                                )}

                                {item.addons && item.addons.length > 0 && (
                                    <div className="text-sm text-gray-500 mt-1">
                                        + {item.addons.map((addon: any) => addon.name).join(', ')}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-end gap-4">
                                <span className="font-bold">₹{item.price * item.quantity}</span>
                                <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    <Button variant="outline" onClick={clearCart} className="w-full">
                        Clear Cart
                    </Button>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-24">
                        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Taxes (5%)</span>
                                <span>₹{Math.round(total * 0.05)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2 font-bold text-lg">
                                <span>Total</span>
                                <span>₹{Math.round(total * 1.05)}</span>
                            </div>
                        </div>

                        <Link href="/checkout">
                            <Button className="w-full" size="lg" disabled={!selectedAddressId}>
                                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        {!selectedAddressId && (
                            <p className="text-xs text-red-500 text-center mt-2">Please select an address to proceed</p>
                        )}
                    </div>
                </div>
            </div>

            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSaveAddress={handleSaveAddress}
                currentLocation={location || "Meerut, India"}
                onChangeLocation={handleChangeLocation}
            />

            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onSelectLocation={handleLocationSelect}
            />
        </div>
    );
}

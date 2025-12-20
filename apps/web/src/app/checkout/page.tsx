'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PaymentMethodSelector from '@/components/PaymentMethodSelector';
import UPIPayment from '@/components/UPIPayment';
import CardPayment from '@/components/CardPayment';

interface Address {
    id: string;
    street: string;
    city: string;
    zip: string;
    isDefault: boolean;
}

export default function CheckoutPage() {
    const { cart, user, clearCart, deliveryAddress, selectedAddressId, setSelectedAddressId } = useStore();
    const router = useRouter();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [creatingOrder, setCreatingOrder] = useState(false);

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [paymentDetails, setPaymentDetails] = useState<any>({});
    const [isPaymentValid, setIsPaymentValid] = useState(true); // Default true for COD

    // Redirect if empty cart
    useEffect(() => {
        if (cart.length === 0) router.push('/menu');
    }, [cart, router]);

    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get('/users/addresses');
                setAddresses(res.data);
            } catch (error) {
                console.error('Failed to fetch addresses', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, [user]);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = Math.round(total * 1.05);

    const handlePaymentMethodChange = (method: string) => {
        setPaymentMethod(method);
        setPaymentDetails({});
        // COD is always valid, others need validation
        setIsPaymentValid(method === 'COD');
    };

    const handleUPIChange = (upiId: string) => {
        setPaymentDetails({ upiId });
        setIsPaymentValid(!!upiId && upiId.includes('@'));
    };

    const handleCardChange = (details: { last4: string; cardType: string }) => {
        setPaymentDetails(details);
        setIsPaymentValid(!!details.last4);
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId && user) {
            alert('Please select an address');
            return;
        }

        if (!isPaymentValid) {
            alert('Please enter valid payment details');
            return;
        }

        setCreatingOrder(true);
        try {
            const orderRes = await api.post('/orders', {
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    options: item.options,
                    addons: item.addons,
                })),
                total: finalTotal,
                addressId: selectedAddressId,
                paymentMethod,
                paymentStatus: 'PAID', // Auto-mark as paid for demo
                paymentDetails,
            });

            clearCart();
            toast.success('Order placed successfully!');
            // Use window.location.href for hard redirect to ensure confirmation page loads
            setTimeout(() => {
                window.location.href = `/order-confirmation/${orderRes.data.id}`;
            }, 500);
        } catch (error: any) {
            console.error('Failed to place order', error);
            const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Failed to place order. Please try again.';
            toast.error(message);
        } finally {
            setCreatingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Address Selection */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Selected Delivery Address</h2>
                    {user ? (
                        <div>
                            {selectedAddressId && addresses.length > 0 ? (
                                <div className="p-4 rounded-lg border-2 border-primary bg-orange-50">
                                    <p className="font-bold">{user.name}</p>
                                    <p>{addresses.find(a => a.id === selectedAddressId)?.street}</p>
                                    <p>{addresses.find(a => a.id === selectedAddressId)?.city}, {addresses.find(a => a.id === selectedAddressId)?.zip}</p>
                                    <Link href="/cart">
                                        <Button variant="link" className="text-orange-700 p-0 h-auto font-bold mt-2">
                                            Change Address
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-4 p-4 bg-orange-50 text-orange-800 rounded-lg text-sm border border-orange-200">
                                    <p>No address selected. Please go back to cart to select an address.</p>
                                    <Button
                                        variant="link"
                                        className="text-orange-700 p-0 h-auto font-bold mt-1"
                                        onClick={() => router.push('/cart')}
                                    >
                                        Go to Cart
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <p className="text-yellow-800 mb-2">You are checking out as a guest.</p>
                            <Button onClick={() => router.push('/login')}>Login to Save Address</Button>
                        </div>
                    )}
                </div>

                {/* Payment Section */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Payment</h2>

                    <div className="bg-gray-50 p-6 rounded-xl mb-6">
                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>₹{total}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total to Pay</span>
                            <span>₹{finalTotal}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <PaymentMethodSelector
                            selectedMethod={paymentMethod}
                            onMethodChange={handlePaymentMethodChange}
                        />

                        {paymentMethod === 'UPI' && (
                            <UPIPayment onUPIChange={handleUPIChange} />
                        )}

                        {paymentMethod === 'CARD' && (
                            <CardPayment onCardChange={handleCardChange} />
                        )}

                        {paymentMethod === 'NET_BANKING' && (
                            <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                                You will be redirected to your bank's website to complete the payment.
                            </div>
                        )}
                    </div>

                    <Button
                        className="w-full py-6 text-lg font-bold"
                        onClick={handlePlaceOrder}
                        disabled={creatingOrder || (!!user && !selectedAddressId) || !isPaymentValid}
                    >
                        {creatingOrder ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                            </>
                        ) : (
                            `Pay ₹${finalTotal}`
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, Tag, X } from 'lucide-react';
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

    // Coupon State
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [validatingCoupon, setValidatingCoupon] = useState(false);

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

    // Calculate final total with discount
    // Logic: (Subtotal - Discount) + 5% Tax on (Subtotal - Discount)
    const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
    const taxableAmount = Math.max(0, total - discountAmount);
    const tax = Math.round(taxableAmount * 0.05); // 5% tax
    const finalTotal = taxableAmount + tax;

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;

        setValidatingCoupon(true);
        try {
            const res = await api.post('/coupons/validate', {
                code: couponInput,
                cartTotal: total
            });

            setAppliedCoupon({
                ...res.data,
                code: couponInput // Ensure code is preserved
            });
            toast.success(`Coupon '${couponInput}' applied! You saved ₹${res.data.discount}`);
        } catch (error: any) {
            console.error('Coupon validation error:', error);
            const msg = error.response?.data?.message || 'Invalid coupon code';
            toast.error(msg);
            setAppliedCoupon(null);
        } finally {
            setValidatingCoupon(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponInput('');
        toast.info('Coupon removed');
    };

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
                    itemId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    options: item.options,
                    addons: item.addons,
                    variants: item.type === 'variational' ? item.variants : undefined,
                })),
                total: finalTotal,
                addressId: selectedAddressId,
                paymentMethod,
                paymentStatus: 'PAID', // Auto-mark as paid for demo
                paymentDetails,
                couponCode: appliedCoupon ? appliedCoupon.code : undefined,
                discountAmount: appliedCoupon ? appliedCoupon.discount : 0
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

                {/* Payment & Coupon Section */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Payment Details</h2>

                    {/* Coupon Input */}
                    <div className="bg-white border rounded-xl p-4 mb-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 font-medium text-gray-700">
                            <Tag className="w-4 h-4" />
                            Apply Coupon
                        </div>
                        {appliedCoupon ? (
                            <div className="flex items-center justify-between bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200">
                                <div className="flex flex-col">
                                    <span className="font-bold flex items-center gap-2">
                                        {appliedCoupon.code}
                                        <span className="text-xs bg-green-200 px-1.5 py-0.5 rounded text-green-800">APPLIED</span>
                                    </span>
                                    <span className="text-xs">You saved ₹{appliedCoupon.discount}</span>
                                </div>
                                <button onClick={removeCoupon} className="p-1 hover:bg-green-100 rounded-full transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Code (e.g. NY2026)"
                                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase"
                                    value={couponInput}
                                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                />
                                <Button
                                    onClick={handleApplyCoupon}
                                    disabled={validatingCoupon || !couponInput.trim()}
                                    variant="outline"
                                    className="border-orange-200 text-orange-700 hover:bg-orange-50"
                                >
                                    {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl mb-6">
                        <div className="flex justify-between mb-2 text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{total}</span>
                        </div>

                        {appliedCoupon && (
                            <div className="flex justify-between mb-2 text-green-600 font-medium">
                                <span>Discount ({appliedCoupon.code})</span>
                                <span>-₹{appliedCoupon.discount}</span>
                            </div>
                        )}

                        <div className="flex justify-between mb-2 text-gray-600">
                            <span>Tax (5%)</span>
                            <span>₹{tax}</span>
                        </div>

                        <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-3 mt-2">
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
                        className="w-full py-6 text-lg font-bold bg-[#C62828] hover:bg-[#B71C1C]"
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

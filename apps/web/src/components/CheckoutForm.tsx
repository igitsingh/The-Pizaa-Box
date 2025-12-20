'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export default function CheckoutForm({ orderId, amount }: { orderId: string; amount: number }) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const { clearCart } = useStore();
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        const { error: submitError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/orders/${orderId}`,
            },
            redirect: 'if_required',
        });

        if (submitError) {
            setError(submitError.message || 'Payment failed');
            setProcessing(false);
        } else {
            // Payment succeeded
            clearCart();
            router.push(`/orders/${orderId}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-4 rounded-lg border">
                <PaymentElement />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button
                type="submit"
                disabled={!stripe || processing}
                className="w-full py-6 text-lg font-bold"
            >
                {processing ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                    </>
                ) : (
                    `Pay ₹${amount}`
                )}
            </Button>
        </form>
    );
}

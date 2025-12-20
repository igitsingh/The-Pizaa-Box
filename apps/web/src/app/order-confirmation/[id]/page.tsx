'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, FileText, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderConfirmationPage() {
    const router = useRouter();
    const params = useParams();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
                <p className="text-gray-500 mb-8">
                    Thank you for your order. We've received it and will begin processing it right away.
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Order ID</p>
                    <p className="text-lg font-mono font-bold text-gray-900">#{params.id}</p>
                </div>

                <div className="space-y-3">
                    <Link href={`/orders/${params.id}`} className="block w-full">
                        <Button variant="outline" className="w-full h-12 text-base border-gray-200 hover:bg-gray-50 hover:text-gray-900">
                            <FileText className="mr-2 h-4 w-4" /> View Order Details
                        </Button>
                    </Link>

                    <Link href="/" className="block w-full">
                        <Button className="w-full h-12 text-base bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all">
                            <Home className="mr-2 h-4 w-4" /> Go to Home
                        </Button>
                    </Link>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin"></div>
                    <p>Redirecting to home in {countdown}s</p>
                </div>
            </div>
        </div>
    );
}

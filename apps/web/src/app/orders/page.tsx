'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';

interface Order {
    id: string;
    orderNumber: number;
    status: string;
    total: number;
    createdAt: string;
    items: { name: string }[];
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(res.data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 mb-4">No orders found.</p>
                    <Link href="/menu">
                        <Button>Order Now</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-mono text-sm font-bold text-orange-600">
                                        TPB{String(order.orderNumber).padStart(5, '0')}
                                    </p>
                                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${{
                                        'PENDING': 'bg-yellow-100 text-yellow-800',
                                        'ACCEPTED': 'bg-blue-100 text-blue-800',
                                        'PREPARING': 'bg-orange-100 text-orange-800',
                                        'BAKING': 'bg-orange-200 text-orange-900',
                                        'READY_FOR_PICKUP': 'bg-purple-100 text-purple-800',
                                        'OUT_FOR_DELIVERY': 'bg-indigo-100 text-indigo-800',
                                        'DELIVERED': 'bg-green-100 text-green-800',
                                        'CANCELLED': 'bg-red-100 text-red-800'
                                    }[order.status] || 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                    <p className="font-bold mt-1">₹{order.total}</p>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-4">
                                {order.items.map(i => i.name).join(', ')}
                            </p>

                            <Link href={`/orders/${order.id}`}>
                                <Button variant="outline" size="sm" className="w-full">
                                    Track Order <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

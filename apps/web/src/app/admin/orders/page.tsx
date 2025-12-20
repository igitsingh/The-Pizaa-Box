'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { io } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface Order {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    items: { name: string; quantity: number }[];
    user: { name: string; phone: string };
}

const statuses = ['PLACED', 'PREPARING', 'BAKING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
    const router = useRouter();
    const { user } = useStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Check authentication and fetch orders
    useEffect(() => {
        console.log('useEffect running...');
        const token = localStorage.getItem('token');
        console.log('Token:', token ? 'exists' : 'missing');

        if (!token) {
            console.log('No token, redirecting to login');
            router.push('/login');
            return;
        }

        console.log('Token found, fetching orders...');

        const fetchOrders = async () => {
            try {
                console.log('Making API call to /orders...');
                const res = await api.get('/orders');
                console.log('Orders fetched:', res.data);
                setOrders(res.data);
                setError('');
            } catch (error: any) {
                console.error('Failed to fetch orders', error);
                const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch orders';
                setError(errorMsg);
            } finally {
                console.log('Setting loading to false');
                setLoading(false);
            }
        };

        fetchOrders();

        const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '/orders') || 'http://localhost:5000/orders');

        socket.on('connect', () => {
            console.log('Admin connected to socket');
            // Admin might need to join a special room or just listen to all
        });

        socket.on('new_order', (order: Order) => {
            setOrders((prev) => [order, ...prev]);
            // Play sound?
        });

        socket.on('order_status_updated', (data: { orderId: string; status: string }) => {
            setOrders((prev) => prev.map(o => o.id === data.orderId ? { ...o, status: data.status } : o));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            console.log('Updating order status:', { id, status });
            const token = localStorage.getItem('token');
            console.log('Token exists:', !!token);

            const response = await api.put(`/orders/${id}/status`, { status });
            console.log('Status update response:', response.data);

            // Update local state immediately
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        } catch (error: any) {
            console.error('Failed to update status', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            alert(`Failed to update status: ${error.response?.data?.message || error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-4">
                <p className="text-red-600 font-bold">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Live Orders</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {orders.map((order) => (
                    <div key={order.id} className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${order.status === 'DELIVERED' ? 'border-green-500 opacity-75' : 'border-orange-500'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="font-bold text-lg">#{order.id.slice(0, 6)}</p>
                                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                            </div>
                            <span className="font-bold text-xl">₹{order.total}</span>
                        </div>

                        <div className="mb-4 space-y-1">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span>{item.quantity}x {item.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {statuses.map((status) => (
                                <Button
                                    key={status}
                                    size="sm"
                                    variant={order.status === status ? 'default' : 'outline'}
                                    onClick={() => updateStatus(order.id, status)}
                                    className={`text-xs ${order.status === status ? '' : 'text-gray-500'}`}
                                >
                                    {status.replace(/_/g, ' ')}
                                </Button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

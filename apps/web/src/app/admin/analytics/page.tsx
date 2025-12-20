'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

interface AnalyticsData {
    totalRevenue: number;
    totalOrders: number;
    statusDistribution: { name: string; value: number }[];
    recentOrders: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/admin/analytics');
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data) return <div>Failed to load data</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Revenue</h3>
                    <p className="text-4xl font-bold mt-2">₹{data.totalRevenue}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Orders</h3>
                    <p className="text-4xl font-bold mt-2">{data.totalOrders}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Order Status Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: { name?: string; percent?: number }) => `${name || 'Unknown'} ${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {data.statusDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                        {data.recentOrders.map((order) => (
                            <div key={order.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                <div>
                                    <p className="font-bold">{order.user?.name || 'Guest'}</p>
                                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">₹{order.total}</p>
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{order.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

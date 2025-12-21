"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Users, IndianRupee, Activity, TrendingUp, ArrowUpRight, ArrowDownRight, AlertTriangle } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import api from "@/lib/api";
import { toast } from "sonner";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalSalesToday: 0,
        totalOrdersToday: 0,
        activeOrders: 0,
        lowStockItems: 0,
        repeatCustomerRate: 0,
        totalUsers: 0
    });
    const [salesTrend, setSalesTrend] = useState([]);
    const [topItems, setTopItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7d');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, trendRes, topItemsRes] = await Promise.all([
                    api.get('/analytics/stats'),
                    api.get(`/analytics/sales-trend?range=${timeRange}`),
                    api.get('/analytics/top-items')
                ]);

                setStats(statsRes.data);
                setSalesTrend(trendRes.data);
                setTopItems(topItemsRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, [timeRange]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex-1 space-y-4 md:space-y-8 p-4 md:p-8 pt-4 md:pt-6 bg-slate-50/50 min-h-screen">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                    <p className="text-slate-500 mt-1 text-sm md:text-base">Overview of your restaurant's performance.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-5">
                <Link href="/payments" className="block">
                    <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                            <CardTitle className="text-xs md:text-sm font-medium text-slate-500">
                                Total Sales Today
                            </CardTitle>
                            <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <IndianRupee className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3 md:pb-4">
                            <div className="text-lg md:text-2xl font-bold text-slate-900">{formatCurrency(stats.totalSalesToday)}</div>
                            <div className="flex items-center text-[10px] md:text-xs text-slate-500 mt-0.5 md:mt-1">
                                Today's revenue
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/orders" className="block">
                    <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                            <CardTitle className="text-xs md:text-sm font-medium text-slate-500">
                                Orders Today
                            </CardTitle>
                            <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-orange-100 flex items-center justify-center">
                                <ShoppingBag className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3 md:pb-4">
                            <div className="text-lg md:text-2xl font-bold text-slate-900">{stats.totalOrdersToday}</div>
                            <div className="flex items-center text-[10px] md:text-xs text-slate-500 mt-0.5 md:mt-1">
                                Orders placed today
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/orders?status=active" className="block">
                    <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                            <CardTitle className="text-xs md:text-sm font-medium text-slate-500">Active Orders</CardTitle>
                            <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Activity className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3 md:pb-4">
                            <div className="text-lg md:text-2xl font-bold text-slate-900">{stats.activeOrders}</div>
                            <div className="flex items-center text-[10px] md:text-xs text-blue-600 mt-0.5 md:mt-1">
                                In progress
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/menu" className="block">
                    <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                            <CardTitle className="text-xs md:text-sm font-medium text-slate-500">Low Stock Items</CardTitle>
                            <div className={`h-6 w-6 md:h-8 md:w-8 rounded-full flex items-center justify-center ${stats.lowStockItems > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                                <AlertTriangle className={`h-3 w-3 md:h-4 md:w-4 ${stats.lowStockItems > 0 ? 'text-red-600' : 'text-green-600'}`} />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3 md:pb-4">
                            <div className="text-lg md:text-2xl font-bold text-slate-900">{stats.lowStockItems}</div>
                            <div className={`flex items-center text-[10px] md:text-xs mt-0.5 md:mt-1 ${stats.lowStockItems > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                Items need restocking
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/customers" className="block col-span-2 lg:col-span-1">
                    <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                            <CardTitle className="text-xs md:text-sm font-medium text-slate-500">Repeat Rate</CardTitle>
                            <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3 md:pb-4">
                            <div className="text-lg md:text-2xl font-bold text-slate-900">{stats.repeatCustomerRate}%</div>
                            <div className="flex items-center text-[10px] md:text-xs text-purple-600 mt-0.5 md:mt-1">
                                Retained customers
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-none shadow-sm">
                    <CardHeader className="pb-3 md:pb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <CardTitle className="text-base md:text-lg">
                                Sales Trend ({
                                    timeRange === '7d' ? 'Last 7 Days' :
                                        timeRange === '15d' ? 'Last 15 Days' :
                                            timeRange === '1m' ? 'Last Month' :
                                                timeRange === '3m' ? 'Last 3 Months' :
                                                    timeRange === '6m' ? 'Last 6 Months' :
                                                        timeRange === '1y' ? 'Last Year' :
                                                            'All Time'
                                })
                            </CardTitle>
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger className="w-full md:w-[180px] h-8 md:h-9 text-xs md:text-sm">
                                    <SelectValue placeholder="Select range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d">Last 7 Days</SelectItem>
                                    <SelectItem value="15d">Last 15 Days</SelectItem>
                                    <SelectItem value="1m">Last Month</SelectItem>
                                    <SelectItem value="3m">Last 3 Months</SelectItem>
                                    <SelectItem value="6m">Last 6 Months</SelectItem>
                                    <SelectItem value="1y">Last Year</SelectItem>
                                    <SelectItem value="all">All Time</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={250} className="md:!h-[350px]">
                            <BarChart data={salesTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => [`₹${value}`, 'Sales']}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Bar dataKey="sales" fill="#ea580c" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-none shadow-sm bg-white h-full">
                    <CardHeader className="pb-3 md:pb-6">
                        <CardTitle className="text-base md:text-lg">Top Selling Items</CardTitle>
                        <div className="text-xs md:text-sm text-slate-500">
                            Most popular items this week.
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6 md:space-y-8">
                            {topItems.map((item: any, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-700 text-sm md:text-base">
                                        {index + 1}
                                    </div>
                                    <div className="ml-3 md:ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.name}</p>
                                    </div>
                                    <div className="ml-auto font-medium text-sm md:text-base">{item.soldCount} sold</div>
                                </div>
                            ))}
                            {topItems.length === 0 && (
                                <div className="text-center text-slate-500 py-4">No sales data yet.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

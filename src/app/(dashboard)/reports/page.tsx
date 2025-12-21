"use client"

import { useState, useEffect } from "react"
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { toast } from "sonner"
import { format, subDays } from "date-fns"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState("30")
    const [isLoading, setIsLoading] = useState(true)
    const [overview, setOverview] = useState<any>(null)
    const [salesData, setSalesData] = useState<any>(null)
    const [productData, setProductData] = useState<any>(null)
    const [couponData, setCouponData] = useState<any>(null)
    const [customerData, setCustomerData] = useState<any>(null)

    useEffect(() => {
        fetchAllReports()
    }, [dateRange])

    const getDateRange = () => {
        const end = new Date()
        const start = subDays(end, Number(dateRange))
        return {
            startDate: format(start, 'yyyy-MM-dd'),
            endDate: format(end, 'yyyy-MM-dd')
        }
    }

    const fetchAllReports = async () => {
        setIsLoading(true)
        try {
            const { startDate, endDate } = getDateRange()
            const params = `startDate=${startDate}&endDate=${endDate}`

            const [overviewRes, salesRes, productRes, couponRes, customerRes] = await Promise.all([
                api.get('/admin/reports/overview'),
                api.get(`/admin/reports/sales?${params}`),
                api.get(`/admin/reports/products?${params}`),
                api.get(`/admin/reports/coupons?${params}`),
                api.get(`/admin/reports/customers?${params}`)
            ])

            setOverview(overviewRes.data)
            setSalesData(salesRes.data)
            setProductData(productRes.data)
            setCouponData(couponRes.data)
            setCustomerData(customerRes.data)
        } catch (error) {
            toast.error("Failed to fetch reports")
        } finally {
            setIsLoading(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    if (isLoading) {
        return (
            <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-500">Loading reports...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Reports & Analytics</h2>
                    <p className="text-slate-500 mt-1">Comprehensive business insights and performance metrics</p>
                </div>
                <div className="flex gap-3">
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <Calendar className="mr-2 h-4 w-4" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Last 7 days</SelectItem>
                            <SelectItem value="30">Last 30 days</SelectItem>
                            <SelectItem value="90">Last 90 days</SelectItem>
                            <SelectItem value="365">Last year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={fetchAllReports}>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Overview Cards */}
            {overview && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(overview.allTime.totalRevenue)}</div>
                            <p className="text-xs text-muted-foreground">
                                Today: {formatCurrency(overview.today.revenue)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{overview.allTime.totalOrders}</div>
                            <p className="text-xs text-muted-foreground">
                                Today: {overview.today.orders} orders
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{overview.allTime.totalCustomers}</div>
                            <p className="text-xs text-muted-foreground">
                                Active: {overview.today.activeOrders}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(overview.allTime.averageOrderValue)}</div>
                            <p className="text-xs text-muted-foreground">
                                Per order average
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="sales" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="sales">Sales</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="coupons">Coupons</TabsTrigger>
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                </TabsList>

                {/* Sales Tab */}
                <TabsContent value="sales" className="space-y-4">
                    {salesData && (
                        <>
                            <div className="grid gap-4 md:grid-cols-3">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Total Revenue</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-orange-600">
                                            {formatCurrency(salesData.summary.totalRevenue)}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Total Orders</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{salesData.summary.totalOrders}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Avg Order Value</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">
                                            {formatCurrency(salesData.summary.averageOrderValue)}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Sales Trend</CardTitle>
                                    <CardDescription>Revenue and orders over time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={350}>
                                        <LineChart data={salesData.chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis yAxisId="left" />
                                            <YAxis yAxisId="right" orientation="right" />
                                            <Tooltip />
                                            <Legend />
                                            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} name="Revenue (₹)" />
                                            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} name="Orders" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </TabsContent>

                {/* Products Tab */}
                <TabsContent value="products" className="space-y-4">
                    {productData && (
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Selling Products</CardTitle>
                                    <CardDescription>By quantity sold</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {productData.topSelling.slice(0, 10).map((product: any, index: number) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{product.name}</p>
                                                    <p className="text-xs text-slate-500">{product.quantity} sold</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-sm">{formatCurrency(product.revenue)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Revenue Products</CardTitle>
                                    <CardDescription>By revenue generated</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={productData.topRevenue.slice(0, 8)}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="revenue" fill="#f97316" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

                {/* Coupons Tab */}
                <TabsContent value="coupons" className="space-y-4">
                    {couponData && (
                        <>
                            <div className="grid gap-4 md:grid-cols-3">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Total Discount Given</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-red-600">
                                            {formatCurrency(couponData.summary.totalDiscountGiven)}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Coupon Orders</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{couponData.summary.totalCouponOrders}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Unique Coupons</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{couponData.summary.uniqueCoupons}</div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Coupon Performance</CardTitle>
                                    <CardDescription>Usage and discount statistics</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {couponData.coupons.slice(0, 10).map((coupon: any, index: number) => (
                                            <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm">{coupon.code}</p>
                                                    <p className="text-xs text-slate-500">{coupon.uses} uses</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-sm text-red-600">-{formatCurrency(coupon.totalDiscount)}</p>
                                                    <p className="text-xs text-slate-500">Revenue: {formatCurrency(coupon.revenue)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </TabsContent>

                {/* Customers Tab */}
                <TabsContent value="customers" className="space-y-4">
                    {customerData && (
                        <>
                            <div className="grid gap-4 md:grid-cols-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>New Customers</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-green-600">{customerData.summary.newCustomers}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Returning</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{customerData.summary.returningCustomers}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Total Active</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{customerData.summary.totalCustomers}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Repeat Rate</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-purple-600">
                                            {customerData.summary.repeatRate.toFixed(1)}%
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Customers</CardTitle>
                                    <CardDescription>By total revenue</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {customerData.topCustomers.map((customer: any, index: number) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{customer.name}</p>
                                                        <p className="text-xs text-slate-500">{customer.orders} orders</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-sm">{formatCurrency(customer.revenue)}</p>
                                                    <p className="text-xs text-slate-500">Avg: {formatCurrency(customer.averageOrderValue)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

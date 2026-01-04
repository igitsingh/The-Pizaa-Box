"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import {
    ChevronLeft,
    Bike,
    Bell,
    FileText,
    Clock,
    MapPin,
    Phone,
    Mail,
    User as UserIcon,
    CreditCard,
    Package,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Receipt
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import api from "@/lib/api"
import { formatCurrency, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

type OrderStatus = "SCHEDULED" | "PENDING" | "ACCEPTED" | "PREPARING" | "BAKING" | "READY_FOR_PICKUP" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED"

interface OrderItem {
    id: string
    name: string
    quantity: number
    price: number
    options?: any
    addons?: any
    variants?: any
}

interface Order {
    id: string
    orderNumber: number
    user?: {
        name: string
        email: string
        phone?: string
    }
    customerName?: string
    customerPhone?: string
    status: OrderStatus
    total: number
    subtotal: number
    tax: number
    deliveryFee: number
    paymentMethod: string
    paymentStatus: string
    items: OrderItem[]
    createdAt: string
    orderType: "INSTANT" | "SCHEDULED"
    scheduledFor?: string
    invoiceNumber?: string
    taxBreakup?: {
        cgstRate: number
        cgstAmount: number
        sgstRate: number
        sgstAmount: number
        totalTax: number
    }
    address?: {
        street: string
        city: string
        zip: string
    }
    guestAddress?: {
        street: string
        city: string
        zip: string
    }
    deliveryPartner?: {
        name: string
        phone: string
    }
    notes?: string
    instructions?: string
}

const STATUS_CONFIG: Record<OrderStatus, { label: string, color: string, icon: any }> = {
    SCHEDULED: { label: "Scheduled", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Calendar },
    PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
    ACCEPTED: { label: "Accepted", color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle2 },
    PREPARING: { label: "Preparing", color: "bg-orange-100 text-orange-800 border-orange-200", icon: Package },
    BAKING: { label: "Baking", color: "bg-orange-200 text-orange-900 border-orange-300", icon: Package },
    READY_FOR_PICKUP: { label: "Ready", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Package },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: Bike },
    DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 },
    CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle },
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [notifications, setNotifications] = useState<any[]>([])

    const fetchOrder = async () => {
        try {
            const [orderRes, notifRes] = await Promise.all([
                api.get(`/admin/orders/${id}`),
                api.get(`/admin/orders/${id}/notifications`)
            ])
            setOrder(orderRes.data)
            setNotifications(notifRes.data)
        } catch (error) {
            console.error("Failed to fetch order details", error)
            toast.error("Failed to load order details")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrder()
    }, [id])

    const updateStatus = async (newStatus: OrderStatus) => {
        try {
            await api.put(`/admin/orders/${id}/status`, { status: newStatus })
            toast.success(`Order status updated to ${newStatus}`)
            fetchOrder()
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    const handleDownloadInvoice = async () => {
        try {
            const response = await api.get(`/admin/orders/${id}/invoice`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice-TPB${String(order?.orderNumber).padStart(5, '0')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download invoice', error);
            toast.error('Failed to download invoice');
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium">Fetching Order Data...</p>
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <h2 className="text-xl font-bold">Order Not Found</h2>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    const statusInfo = STATUS_CONFIG[order.status]
    const StatusIcon = statusInfo.icon

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* Breadcrumbs / Back */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Board
                </Button>
                <Separator orientation="vertical" className="h-4" />
                <div className="text-sm font-medium text-slate-500">
                    Order #TPB{String(order.orderNumber).padStart(5, '0')}
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Order #TPB{String(order.orderNumber).padStart(5, '0')}
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <Badge className={cn("px-3 py-1 gap-1.5 border uppercase text-[10px] font-bold", statusInfo.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                        </Badge>
                        <span className="text-slate-500 text-sm whitespace-nowrap">
                            Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2" onClick={handleDownloadInvoice}>
                        <FileText className="h-4 w-4" />
                        Invoice
                    </Button>
                    {order.status === "PENDING" && (
                        <Button onClick={() => updateStatus("ACCEPTED")} className="bg-orange-600 hover:bg-orange-700">
                            Accept Order
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items Card */}
                    <Card className="overflow-hidden border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50 border-b border-slate-200">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Package className="h-5 w-5 text-orange-600" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {order.items.map((item) => (
                                    <div key={item.id} className="p-6 flex justify-between items-start hover:bg-slate-50/50 transition-colors">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-900">{item.name}</span>
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold">
                                                    x{item.quantity}
                                                </Badge>
                                            </div>

                                            {/* Variants */}
                                            {item.variants && Object.values(item.variants).length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {Object.values(item.variants).map((v: any, idx) => (
                                                        <span key={idx} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium border border-orange-100">
                                                            {v.label}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Add-ons */}
                                            {item.addons && (Array.isArray(item.addons) ? item.addons : Object.values(item.addons)).length > 0 && (
                                                <div className="text-xs text-slate-500 mt-2">
                                                    <span className="font-semibold">Add-ons:</span> {(Array.isArray(item.addons) ? item.addons : Object.values(item.addons)).map((a: any) => a.name).join(", ")}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right ml-4">
                                            <div className="font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</div>
                                            <div className="text-xs text-slate-400">{formatCurrency(item.price)} each</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Footer */}
                            <div className="bg-slate-50 p-6 border-t border-slate-200 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                                </div>
                                {order.taxBreakup ? (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">CGST ({order.taxBreakup.cgstRate}%)</span>
                                            <span className="font-medium">{formatCurrency(order.taxBreakup.cgstAmount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">SGST ({order.taxBreakup.sgstRate}%)</span>
                                            <span className="font-medium">{formatCurrency(order.taxBreakup.sgstAmount)}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Tax</span>
                                        <span className="font-medium">{formatCurrency(order.tax)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Delivery Fee</span>
                                    <span className="font-medium">{formatCurrency(order.deliveryFee)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-bold text-slate-900 uppercase tracking-tight">Total</span>
                                    <span className="text-2xl font-black text-orange-600 tracking-tighter">
                                        {formatCurrency(order.total)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline / Notifications */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Bell className="h-5 w-5 text-orange-600" />
                                Notification History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px] pr-4">
                                <div className="space-y-4">
                                    {notifications.length === 0 ? (
                                        <div className="text-center py-8 text-slate-400">No notifications sent yet</div>
                                    ) : (
                                        notifications.map((log) => (
                                            <div key={log.id} className="relative pl-6 border-l-2 border-slate-100 pb-4 last:pb-0">
                                                <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-slate-200 border-2 border-white" />
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-sm text-slate-900">{log.event.replace(/_/g, ' ')}</span>
                                                            <Badge variant="outline" className="text-[10px] uppercase font-bold bg-slate-50">
                                                                {log.channel}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded italic">
                                                            "{log.message}"
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[10px] text-slate-400 font-medium">
                                                            {format(new Date(log.createdAt), "h:mm a")}
                                                        </div>
                                                        <Badge className={cn(
                                                            "text-[9px] uppercase font-black px-1.5 py-0 mt-1",
                                                            log.status === "SENT" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                                        )}>
                                                            {log.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-8">
                    {/* Customer & Location */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Customer & Delivery</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Customer Info */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-slate-100 p-2 rounded-lg">
                                        <UserIcon className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer</div>
                                        <div className="font-bold text-slate-900">{order.customerName || order.user?.name || "Guest"}</div>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Mail className="h-3 w-3" />
                                                {order.user?.email || "N/A"}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Phone className="h-3 w-3" />
                                                {order.customerPhone || order.user?.phone || "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Delivery Info */}
                                <div className="flex items-start gap-3">
                                    <div className="bg-slate-100 p-2 rounded-lg">
                                        <MapPin className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Delivery Address</div>
                                        <div className="text-sm font-medium text-slate-900 mt-1">
                                            {order.address ? (
                                                <>
                                                    {order.address.street}<br />
                                                    {order.address.city}, {order.address.zip}
                                                </>
                                            ) : order.guestAddress ? (
                                                <>
                                                    {order.guestAddress.street}<br />
                                                    {order.guestAddress.city}, {order.guestAddress.zip}
                                                </>
                                            ) : (
                                                <span className="italic text-slate-400 text-xs text-pretty truncate">Pickup Order / No Address</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Partner */}
                                {order.deliveryPartner && (
                                    <>
                                        <Separator />
                                        <div className="flex items-start gap-3">
                                            <div className="bg-indigo-50 p-2 rounded-lg">
                                                <Bike className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Delivery Partner</div>
                                                <div className="font-bold text-slate-900">{order.deliveryPartner.name}</div>
                                                <div className="text-xs text-slate-600 mt-0.5">{order.deliveryPartner.phone}</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment & Status Control */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Payment & Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm font-medium text-slate-600">{order.paymentMethod}</span>
                                </div>
                                <Badge variant={order.paymentStatus === "PAID" ? "default" : "secondary"} className={cn(
                                    "text-[10px] uppercase font-black",
                                    order.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                                )}>
                                    {order.paymentStatus}
                                </Badge>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Update Order Status</div>
                                <div className="grid grid-cols-1 gap-2">
                                    {order.status === "PENDING" && (
                                        <Button onClick={() => updateStatus("ACCEPTED")} className="w-full bg-blue-600 hover:bg-blue-700">Accept Order</Button>
                                    )}
                                    {order.status === "ACCEPTED" && (
                                        <Button onClick={() => updateStatus("PREPARING")} className="w-full bg-orange-500 hover:bg-orange-600">Start Preparing</Button>
                                    )}
                                    {order.status === "PREPARING" && (
                                        <Button onClick={() => updateStatus("BAKING")} className="w-full bg-orange-600 hover:bg-orange-700 font-bold uppercase tracking-wider">Move to Baking</Button>
                                    )}
                                    {order.status === "BAKING" && (
                                        <Button onClick={() => updateStatus("READY_FOR_PICKUP")} className="w-full bg-purple-600 hover:bg-purple-700">Ready for Pickup</Button>
                                    )}

                                    {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                                        <Button variant="outline" onClick={() => updateStatus("CANCELLED")} className="w-full border-red-200 text-red-600 hover:bg-red-50">
                                            Cancel Order
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {order.instructions && (
                                <>
                                    <Separator />
                                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 space-y-2">
                                        <div className="flex items-center gap-2 text-yellow-800 font-bold text-[10px] uppercase tracking-widest">
                                            <AlertCircle className="h-3 w-3" />
                                            Special Instructions
                                        </div>
                                        <p className="text-xs text-yellow-900 font-medium italic leading-relaxed">
                                            "{order.instructions}"
                                        </p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

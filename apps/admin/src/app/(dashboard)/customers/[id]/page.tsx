"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Mail, Phone, Calendar, Package, TrendingUp, User as UserIcon } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type OrderItem = {
    id: string
    name: string
    quantity: number
    price: number
    variants: any
}

type Order = {
    id: string
    orderNumber: number
    status: string
    total: number
    createdAt: string
    items: OrderItem[]
}

type UserProfile = {
    id: string
    name: string
    email: string
    phone?: string
    role: string
    createdAt: string
    ltv: number
    totalOrders: number
    orders: Order[]
    addresses: any[]
}

export default function CustomerProfilePage() {
    const params = useParams()
    const router = useRouter()
    const [user, setUser] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            fetchUser(params.id as string)
        }
    }, [params.id])

    const fetchUser = async (id: string) => {
        try {
            setIsLoading(true)
            const res = await api.get(`/users/${id}`)
            setUser(res.data)
        } catch (error) {
            toast.error("Failed to fetch customer profile")
            router.push("/customers")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-slate-500 animate-pulse">Loading profile...</p>
            </div>
        )
    }

    if (!user) return null

    const isRepeatCustomer = user.totalOrders > 1
    const tags = ["Registered"]
    if (isRepeatCustomer) tags.push("Repeat Customer")
    if (user.ltv > 5000) tags.push("High Value")

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="h-10 w-10 rounded-full hover:bg-white border border-transparent hover:border-slate-200"
                >
                    <ArrowLeft className="h-5 w-5 text-slate-500" />
                </Button>
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                        {user.name}
                        {user.role === 'ADMIN' && <Badge variant="destructive" className="text-[10px] uppercase">Admin</Badge>}
                    </h2>
                    <div className="flex gap-2 mt-2">
                        {tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-white border-slate-200 text-slate-600 font-medium text-[10px] uppercase tracking-wide">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Stats/Info */}
                <Card className="md:col-span-1 shadow-sm border-none bg-white h-fit">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                                <UserIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Member Since</p>
                                <p className="font-medium text-slate-900">{format(new Date(user.createdAt), "MMMM d, yyyy")}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600 truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600">{user.phone || "No phone linked"}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <Package className="h-3 w-3 text-slate-400" />
                                    <span className="text-[10px] font-black uppercase text-slate-400">Total Orders</span>
                                </div>
                                <p className="text-xl font-black text-slate-900">{user.totalOrders}</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <TrendingUp className="h-3 w-3 text-green-600" />
                                    <span className="text-[10px] font-black uppercase text-green-600">Lifetime Val</span>
                                </div>
                                <p className="text-xl font-black text-green-700">₹{user.ltv}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Order History */}
                <Card className="md:col-span-2 shadow-sm border-none bg-white">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">
                            Order History ({user.totalOrders})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-slate-100">
                                    <TableHead className="pl-6 h-12 w-[140px]">Order ID</TableHead>
                                    <TableHead className="h-12">Date</TableHead>
                                    <TableHead className="h-12">Status</TableHead>
                                    <TableHead className="h-12">Items</TableHead>
                                    <TableHead className="h-12 text-right pr-6">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {user.orders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-slate-400 italic">No orders found for this customer.</TableCell>
                                    </TableRow>
                                ) : (
                                    user.orders.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-slate-50 border-slate-100 group cursor-pointer" onClick={() => router.push(`/orders?id=${order.id}`)}>
                                            <TableCell className="pl-6 font-mono text-xs font-medium text-slate-500 group-hover:text-orange-600 transition-colors">
                                                #TPB{String(order.orderNumber).padStart(5, '0')}
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-500">
                                                {format(new Date(order.createdAt), "MMM d, HH:mm")}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`
                                                        text-[10px] uppercase font-bold tracking-wider border-0
                                                        ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-blue-100 text-blue-700'}
                                                    `}
                                                >
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-600 max-w-[200px] truncate">
                                                {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                                            </TableCell>
                                            <TableCell className="text-right pr-6 font-bold text-slate-900">
                                                ₹{order.total}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

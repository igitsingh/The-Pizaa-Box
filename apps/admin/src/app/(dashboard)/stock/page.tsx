"use client"

import { useState, useEffect } from "react"
import { Package, AlertTriangle, CheckCircle2, Search, ArrowUpRight, History } from "lucide-react"
import { toast } from "sonner"

import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"

export default function StockPage() {
    const [items, setItems] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [updatingItem, setUpdatingItem] = useState<any>(null)
    const [newStock, setNewStock] = useState<string>("")

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            setIsLoading(true)
            const response = await api.get("/admin/menu")
            // Filter only stock managed items or show all? 
            // User mentioned "Pizza Dough/Cheese" specifically.
            setItems(response.data)
        } catch (error) {
            toast.error("Failed to fetch inventory")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateStock = async () => {
        if (!updatingItem) return
        try {
            await api.put(`/admin/stock/items/${updatingItem.id}`, {
                stock: parseInt(newStock),
                isStockManaged: true
            })
            toast.success(`Stock updated for ${updatingItem.name}`)
            setUpdatingItem(null)
            fetchItems()
        } catch (error) {
            toast.error("Failed to update stock")
        }
    }

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const lowStockItems = items.filter(item => item.isStockManaged && item.stock <= 10)

    if (isLoading) {
        return <div className="p-8 text-center">Loading inventory...</div>
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Inventory Control</h2>
                    <p className="text-slate-500 mt-1">Monitor and restock essential ingredients and menu items.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={fetchItems}>Refresh</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-orange-600 text-white shadow-lg shadow-orange-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                        <AlertTriangle className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{items.filter(i => i.isStockManaged && i.stock <= 0).length}</div>
                        <p className="text-xs opacity-80 mt-1 flex items-center gap-1">
                            Critical items needing immediate restock
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowStockItems.length}</div>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Below threshold (10 units)</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
                        <Package className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹12,450</div>
                        <p className="text-xs text-slate-500 mt-1">Estimated on-hand value</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>Inventory List</CardTitle>
                        <CardDescription>Manage stock levels for items with inventory tracking enabled.</CardDescription>
                    </div>
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search items..."
                            className="pl-9 h-9 border-slate-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[300px]">Item Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Current Stock</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.map((item) => (
                                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            {item.image && (
                                                <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover bg-slate-100" />
                                            )}
                                            <div>
                                                <div className="text-slate-900">{item.name}</div>
                                                <div className="text-xs text-slate-500 font-normal">ID: {item.id.slice(0, 8)}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-slate-50">{item.category?.name || "Uncategorized"}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {!item.isStockManaged ? (
                                            <Badge variant="outline" className="text-slate-400">Untracked</Badge>
                                        ) : item.stock <= 0 ? (
                                            <Badge className="bg-red-100 text-red-700 border-red-200">Out of Stock</Badge>
                                        ) : item.stock <= 10 ? (
                                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 font-medium">Low Stock</Badge>
                                        ) : (
                                            <Badge className="bg-green-100 text-green-700 border-green-200">Healthy</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-lg font-bold ${item.stock <= 10 && item.isStockManaged ? 'text-red-600' : 'text-slate-700'}`}>
                                                {item.stock}
                                            </span>
                                            <span className="text-slate-400 text-xs">units</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-semibold"
                                            onClick={() => {
                                                setUpdatingItem(item)
                                                setNewStock(item.stock.toString())
                                            }}
                                        >
                                            <ArrowUpRight className="h-4 w-4 mr-1" />
                                            Update
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={!!updatingItem} onOpenChange={() => setUpdatingItem(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-orange-600" />
                            Restock Item
                        </DialogTitle>
                        <DialogDescription>
                            Enter the new total stock count for <b>{updatingItem?.name}</b>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right text-sm font-medium">New Total</label>
                            <Input
                                type="number"
                                className="col-span-3"
                                value={newStock}
                                onChange={(e) => setNewStock(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUpdatingItem(null)}>Cancel</Button>
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleUpdateStock}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

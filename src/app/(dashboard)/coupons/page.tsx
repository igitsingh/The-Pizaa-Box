"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"

import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

type Coupon = {
    id: string
    code: string
    type: "FLAT" | "PERCENTAGE"
    value: number
    expiry: string
    isActive: boolean
    limit?: number
    usedCount: number
}

const formSchema = z.object({
    code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
    type: z.enum(["FLAT", "PERCENTAGE"]),
    value: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Value must be a positive number"),
    expiry: z.string().min(1, "Expiry date is required"),
    limit: z.string().optional(),
    isActive: z.boolean().default(true),
})

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            code: "",
            type: "FLAT",
            value: "",
            expiry: "",
            limit: "",
            isActive: true,
        },
    })

    useEffect(() => {
        fetchCoupons()
    }, [])

    useEffect(() => {
        if (editingCoupon) {
            form.reset({
                code: editingCoupon.code,
                type: editingCoupon.type,
                value: editingCoupon.value.toString(),
                expiry: new Date(editingCoupon.expiry).toISOString().split('T')[0],
                limit: editingCoupon.limit ? editingCoupon.limit.toString() : "",
                isActive: editingCoupon.isActive,
            })
        } else {
            form.reset({
                code: "",
                type: "FLAT",
                value: "",
                expiry: "",
                limit: "",
                isActive: true,
            })
        }
    }, [editingCoupon, form])

    const fetchCoupons = async () => {
        try {
            setIsLoading(true)
            const res = await api.get("/coupons")
            setCoupons(res.data)
        } catch (error) {
            toast.error("Failed to fetch coupons")
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (editingCoupon) {
                await api.put(`/coupons/${editingCoupon.id}`, values)
                toast.success("Coupon updated successfully")
            } else {
                await api.post("/coupons", values)
                toast.success("Coupon created successfully")
            }
            setIsDialogOpen(false)
            setEditingCoupon(null)
            fetchCoupons()
        } catch (error: any) {
            if (error.response?.status === 400) {
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed to save coupon")
            }
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return
        try {
            await api.delete(`/coupons/${id}`)
            toast.success("Coupon deleted successfully")
            fetchCoupons()
        } catch (error) {
            toast.error("Failed to delete coupon")
        }
    }

    const filteredCoupons = coupons.filter(coupon =>
        coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Coupons</h2>
                    <p className="text-slate-500 mt-1">Manage discount codes and promotions.</p>
                </div>
                <Button onClick={() => { setEditingCoupon(null); setIsDialogOpen(true) }} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add Coupon
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search coupons..."
                        className="pl-9 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Expiry</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
                            </TableRow>
                        ) : filteredCoupons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-slate-500">No coupons found</TableCell>
                            </TableRow>
                        ) : (
                            filteredCoupons.map((coupon) => (
                                <TableRow key={coupon.id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                                    <TableCell>
                                        {coupon.type === "FLAT" ? `₹${coupon.value}` : `${coupon.value}%`}
                                    </TableCell>
                                    <TableCell>{format(new Date(coupon.expiry), "MMM d, yyyy")}</TableCell>
                                    <TableCell>
                                        {coupon.usedCount} {coupon.limit ? `/ ${coupon.limit}` : ""}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${coupon.isActive ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'}`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => { setEditingCoupon(coupon); setIsDialogOpen(true) }}>
                                                <Pencil className="h-4 w-4 text-slate-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingCoupon ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
                        <DialogDescription>
                            {editingCoupon ? "Update coupon details." : "Create a new discount coupon."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="SUMMER20" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="FLAT">Flat Amount (₹)</SelectItem>
                                                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Value</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="100" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="expiry"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Expiry Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="limit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Usage Limit (Optional)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="1000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Active</FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                Enable or disable this coupon.
                                            </p>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
                                    {editingCoupon ? "Update Coupon" : "Create Coupon"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Search, Filter, X } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import api from "@/lib/api"
import axios from "axios"
import ItemTags from "@/components/ItemTags"

const publicApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/admin', '') : 'http://localhost:5001/api',
})
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
    DialogTrigger,
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
import { formatCurrency } from "@/lib/utils"

// Types
type Category = {
    id: string
    name: string
}

type MenuItem = {
    id: string
    name: string
    description: string
    price: number
    categoryId: string
    category: Category
    isVeg: boolean
    isSpicy: boolean
    isBestSeller: boolean
    isAvailable: boolean
    image?: string
    stock: number
    isStockManaged: boolean
}

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
    categoryId: z.string().min(1, "Category is required"),
    isVeg: z.boolean().default(true),
    isSpicy: z.boolean().default(false),
    isBestSeller: z.boolean().default(false),
    isAvailable: z.boolean().default(true),
    image: z.string().optional(),
    stock: z.string().optional().default("100"),
    isStockManaged: z.boolean().default(false),
    slug: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    altText: z.string().optional(),
    variants: z.array(z.object({
        type: z.string(),
        label: z.string(),
        price: z.string(),
        isAvailable: z.boolean().default(true),
    })).default([]),
})

export default function MenuPage() {
    const [items, setItems] = useState<MenuItem[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            price: "",
            categoryId: "",
            isVeg: true,
            isSpicy: false,
            isBestSeller: false,
            isAvailable: true,
            image: "",
            stock: "100",
            isStockManaged: false,
            slug: "",
            seoTitle: "",
            seoDescription: "",
            altText: "",
            variants: [],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "variants"
    })

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (editingItem) {
            form.reset({
                name: editingItem.name,
                description: editingItem.description || "",
                price: editingItem.price.toString(),
                categoryId: editingItem.categoryId,
                isVeg: editingItem.isVeg,
                isSpicy: editingItem.isSpicy,
                isBestSeller: editingItem.isBestSeller,
                isAvailable: editingItem.isAvailable,
                image: editingItem.image || "",
                stock: editingItem.stock.toString(),
                isStockManaged: editingItem.isStockManaged,
                slug: (editingItem as any).slug || "",
                seoTitle: (editingItem as any).seoTitle || "",
                seoDescription: (editingItem as any).seoDescription || "",
                altText: (editingItem as any).altText || "",
                variants: (editingItem as any).variants?.map((v: any) => ({
                    type: v.type,
                    label: v.label,
                    price: v.price.toString(),
                    isAvailable: v.isAvailable,
                })) || [],
            })
        } else {
            form.reset({
                name: "",
                description: "",
                price: "",
                categoryId: "",
                isVeg: true,
                isSpicy: false,
                isBestSeller: false,
                isAvailable: true,
                image: "",
                stock: "100",
                isStockManaged: false,
                slug: "",
                seoTitle: "",
                seoDescription: "",
                altText: "",
                variants: [],
            })
        }
    }, [editingItem, form])

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [itemsRes, categoriesRes] = await Promise.all([
                api.get("/menu"), // Hits /api/admin/menu
                publicApi.get("/menu"), // Hits /api/menu (public)
            ])
            setItems(itemsRes.data)
            // Extract categories from the public menu response which returns categories with items
            const cats = categoriesRes.data.map((c: any) => ({ id: c.id, name: c.name }))
            setCategories(cats)
        } catch (error) {
            toast.error("Failed to fetch menu data")
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (editingItem) {
                await api.put(`/menu/${editingItem.id}`, values)
                toast.success("Item updated successfully")
            } else {
                await api.post("/menu", values)
                toast.success("Item created successfully")
            }
            setIsDialogOpen(false)
            setEditingItem(null)
            fetchData()
        } catch (error) {
            console.error("Submit error:", error)
            toast.error("Failed to save item")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return
        try {
            await api.delete(`/menu/${id}`)
            toast.success("Item deleted successfully")
            fetchData()
        } catch (error) {
            toast.error("Failed to delete item")
        }
    }

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Menu Items</h2>
                    <p className="text-slate-500 mt-1">Manage your food items, prices, and availability.</p>
                </div>
                <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true) }} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search items..."
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
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
                            </TableRow>
                        ) : filteredItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-slate-500">No items found</TableCell>
                            </TableRow>
                        ) : (
                            filteredItems.map((item) => (
                                <TableRow key={item.id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium">
                                        <div>{item.name}</div>
                                        <div className="text-xs text-slate-500 truncate max-w-[200px]">{item.description}</div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {item.category?.name}
                                        </span>
                                    </TableCell>
                                    <TableCell>{formatCurrency(item.price)}</TableCell>
                                    <TableCell>
                                        <ItemTags
                                            isVeg={item.isVeg}
                                            isSpicy={item.isSpicy}
                                            isBestSeller={item.isBestSeller}
                                            isAvailable={item.isAvailable}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${item.isAvailable ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'}`}>
                                            {item.isAvailable ? 'Available' : 'Unavailable'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setIsDialogOpen(true) }}>
                                                <Pencil className="h-4 w-4 text-slate-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
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
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
                        <DialogDescription>
                            {editingItem ? "Update the details of your menu item." : "Add a new delicious item to your menu."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Margherita Pizza" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="299" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Classic cheese pizza with basil..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="altText"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image Alt Text</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Delicious pizza..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4 border rounded-md p-4 bg-slate-50">
                                <h3 className="font-medium text-sm text-slate-900">SEO Settings</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>URL Slug</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="margherita-pizza" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="seoTitle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>SEO Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Best Margherita Pizza in Meerut" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="seoDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SEO Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Order fresh Margherita pizza..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="isVeg"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Vegetarian</FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isSpicy"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Spicy</FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isBestSeller"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Bestseller</FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4 border rounded-md p-4 bg-white">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-sm text-slate-900">Variants (Size, Crust, etc.)</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => append({ type: "SIZE", label: "", price: "", isAvailable: true })}
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> Add Variant
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2 items-end border-b pb-3 last:border-0 border-slate-100">
                                            <FormField
                                                control={form.control}
                                                name={`variants.${index}.type`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel className="text-[10px] uppercase text-slate-500">Type</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-8 text-xs">
                                                                    <SelectValue placeholder="Type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="SIZE">Size</SelectItem>
                                                                <SelectItem value="CRUST">Crust</SelectItem>
                                                                <SelectItem value="OTHER">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`variants.${index}.label`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-[2]">
                                                        <FormLabel className="text-[10px] uppercase text-slate-500">Label</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Regular/Medium" className="h-8 text-xs" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`variants.${index}.price`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel className="text-[10px] uppercase text-slate-500">Price</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="299" className="h-8 text-xs" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`variants.${index}.isAvailable`}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center mb-2 px-1">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {fields.length === 0 && (
                                        <p className="text-xs text-slate-500 text-center py-2">No variants added yet.</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="isVeg"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Vegetarian</FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isSpicy"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Spicy</FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isBestSeller"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Bestseller</FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isAvailable"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Available</FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isStockManaged"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Manage Stock</FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {form.watch("isStockManaged") && (
                                    <FormField
                                        control={form.control}
                                        name="stock"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Current Stock Level</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            <DialogFooter>
                                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
                                    {editingItem ? "Update Item" : "Create Item"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

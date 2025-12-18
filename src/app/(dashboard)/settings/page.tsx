"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
    restaurantName: z.string().min(2, "Name must be at least 2 characters"),
    contactPhone: z.string().min(10, "Phone number must be at least 10 digits"),
    contactEmail: z.string().email("Invalid email address"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    minOrderAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Amount must be a positive number"),
    operatingHours: z.string().min(1, "Operating hours are required"),
    isOpen: z.boolean().default(true),
    notificationsEnabled: z.boolean().default(true),
    whatsappEnabled: z.boolean().default(false),
    smsEnabled: z.boolean().default(false),
    emailEnabled: z.boolean().default(false),
    closedMessage: z.string().optional(),
})

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            restaurantName: "",
            contactPhone: "",
            contactEmail: "",
            address: "",
            minOrderAmount: "0",
            operatingHours: "",
            isOpen: true,
            notificationsEnabled: true,
            whatsappEnabled: false,
            smsEnabled: false,
            emailEnabled: false,
            closedMessage: "",
        },
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            setIsLoading(true)
            const res = await api.get("/settings")
            const data = res.data
            form.reset({
                restaurantName: data.restaurantName || "",
                contactPhone: data.contactPhone || "",
                contactEmail: data.contactEmail || "",
                address: data.address || "",
                minOrderAmount: data.minOrderAmount?.toString() || "0",
                operatingHours: data.operatingHours || "",
                isOpen: data.isOpen,
                notificationsEnabled: data.notificationsEnabled,
                whatsappEnabled: data.whatsappEnabled,
                smsEnabled: data.smsEnabled,
                emailEnabled: data.emailEnabled,
                closedMessage: data.closedMessage || "",
            })
        } catch (error) {
            toast.error("Failed to fetch settings")
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await api.put("/settings", values)
            toast.success("Settings updated successfully")
        } catch (error) {
            toast.error("Failed to update settings")
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading settings...</div>
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 italic">SYSTEM SETTINGS</h2>
                    <p className="text-slate-500 mt-1">Configure restaurant operations and notification triggers.</p>
                </div>
            </div>

            <div className="grid gap-8 pb-12">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Card className="border-none shadow-sm overflow-hidden">
                            <CardHeader className="bg-white border-b border-slate-100">
                                <CardTitle className="text-xl font-bold">General Information</CardTitle>
                                <CardDescription>
                                    Update your restaurant's core identity and operating status.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="restaurantName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase font-bold text-slate-500">Restaurant Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="The Pizza Box" className="h-11" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="contactPhone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase font-bold text-slate-500">Contact Phone</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="+91 1234567890" className="h-11" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="contactEmail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase font-bold text-slate-500">Contact Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="hello@thepizzabox.com" className="h-11" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="minOrderAmount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase font-bold text-slate-500">Min Order Amount (₹)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="0" className="h-11" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase font-bold text-slate-500">Address</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="433, Prabhat Nagar, Meerut..." className="min-h-[100px] resize-none" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="operatingHours"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase font-bold text-slate-500">Operating Hours</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="10:00 AM - 10:00 PM" className="h-11" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="isOpen"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 bg-slate-50 shadow-inner h-full">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel className="font-bold">Accepting Orders</FormLabel>
                                                        <FormDescription className="text-[10px]">
                                                            Toggle when you are open/closed.
                                                        </FormDescription>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {!form.watch("isOpen") && (
                                        <FormField
                                            control={form.control}
                                            name="closedMessage"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase font-bold text-slate-500">Custom Closed Message</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Abhi orders band hain..." className="h-11" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This message will be shown to customers when you are not accepting orders.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notification Settings */}
                        <Card className="border-none shadow-sm overflow-hidden bg-white">
                            <CardHeader className="border-b border-slate-100">
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    Notification Settings
                                    <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase font-black tracking-widest">Crucial</span>
                                </CardTitle>
                                <CardDescription>
                                    Control how customers receive order status updates.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="notificationsEnabled"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-xl border-2 border-slate-100 p-4 bg-white hover:bg-slate-50/50 transition-colors">
                                                <FormControl>
                                                    <Checkbox
                                                        className="h-5 w-5"
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-0.5 leading-none">
                                                    <FormLabel className="font-black text-slate-900 uppercase tracking-tight">Enable Global Notifications</FormLabel>
                                                    <FormDescription className="text-xs">
                                                        Master switch for all customer-facing notifications.
                                                    </FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    {form.watch("notificationsEnabled") && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <FormField
                                                control={form.control}
                                                name="whatsappEnabled"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 border rounded-xl p-4 bg-white shadow-sm border-slate-100">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-0.5 leading-none">
                                                            <FormLabel className="font-bold text-sm text-green-600">WhatsApp</FormLabel>
                                                            <FormDescription className="text-[10px]">Order status via WA</FormDescription>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="smsEnabled"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 border rounded-xl p-4 bg-white shadow-sm border-slate-100">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-0.5 leading-none">
                                                            <FormLabel className="font-bold text-sm text-blue-600">SMS</FormLabel>
                                                            <FormDescription className="text-[10px]">Traditional text alerts</FormDescription>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="emailEnabled"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 border rounded-xl p-4 bg-white shadow-sm border-slate-100">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-0.5 leading-none">
                                                            <FormLabel className="font-bold text-sm text-slate-900">Email</FormLabel>
                                                            <FormDescription className="text-[10px]">Receipts & updates</FormDescription>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" size="lg" className="bg-orange-600 hover:bg-orange-700 text-white font-black px-12 h-14 rounded-2xl shadow-xl shadow-orange-100 transition-all active:scale-95">
                                SAVE CONFIGURATION
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div >
    )
}

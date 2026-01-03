'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, MapPin, Package, MessageSquareWarning } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Address {
    id: string;
    street: string;
    city: string;
    zip: string;
    isDefault: boolean;
}

interface Order {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    items: any[];
}

interface Complaint {
    id: string;
    subject: string;
    message: string;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
    createdAt: string;
}

export default function ProfilePage() {
    const { user, setUser } = useStore();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddressForm, setShowAddressForm] = useState(false);

    // Address Form State
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [addingAddress, setAddingAddress] = useState(false);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (!user && !token) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [ordersRes, complaintsRes, userRes] = await Promise.all([
                    api.get('/orders/my').catch(err => {
                        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                            throw err;
                        }
                        return { data: [] };
                    }),
                    api.get('/complaints/my').catch(err => {
                        return { data: [] };
                    }),
                    api.get('/auth/me')
                ]);

                setOrders(ordersRes.data || []);
                setComplaints(complaintsRes.data || []);
                setAddresses(userRes.data?.addresses || []);
                setUser(userRes.data);
            } catch (error: any) {
                console.error('Failed to fetch profile data', error);
                if (error.response && (error.response.status === 401 || error.response.status === 404)) {
                    localStorage.removeItem('token');
                    setUser(null);
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, router, setUser]);

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddingAddress(true);
        try {
            const res = await api.post('/users/addresses', { street, city, zip });
            setAddresses([...addresses, res.data]);
            setShowAddressForm(false);
            setStreet('');
            setCity('');
            setZip('');
        } catch (error) {
            console.error('Failed to add address', error);
            alert('Failed to add address');
        } finally {
            setAddingAddress(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Info & Addresses */}
                <div className="md:col-span-1 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-xl font-bold mb-4">Account Details</h2>
                        <div className="space-y-2">
                            <p className="text-gray-600"><span className="font-semibold">Name:</span> {user?.name}</p>
                            <p className="text-gray-600"><span className="font-semibold">Email:</span> {user?.email || 'N/A'}</p>
                            <p className="text-gray-600"><span className="font-semibold">Phone:</span> {user?.phone || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Addresses</h2>
                            <Button variant="outline" size="sm" onClick={() => setShowAddressForm(!showAddressForm)}>
                                <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                        </div>

                        {showAddressForm && (
                            <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
                                <input
                                    placeholder="Street Address"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    className="w-full p-2 border rounded text-sm"
                                    required
                                />
                                <div className="flex gap-2">
                                    <input
                                        placeholder="City"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full p-2 border rounded text-sm"
                                        required
                                    />
                                    <input
                                        placeholder="ZIP Code"
                                        value={zip}
                                        onChange={(e) => setZip(e.target.value)}
                                        className="w-full p-2 border rounded text-sm"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                                    <Button type="submit" size="sm" disabled={addingAddress}>
                                        {addingAddress ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save'}
                                    </Button>
                                </div>
                            </form>
                        )}

                        <div className="space-y-3">
                            {addresses.length === 0 ? (
                                <p className="text-gray-500 text-sm">No addresses saved.</p>
                            ) : (
                                addresses.map((addr) => (
                                    <div key={addr.id} className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg group">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-sm">{addr.street}</p>
                                                <p className="text-gray-500 text-xs">{addr.city}, {addr.zip}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={async () => {
                                                if (!confirm('Delete address?')) return;
                                                try {
                                                    await api.delete(`/users/addresses/${addr.id}`);
                                                    setAddresses(addresses.filter(a => a.id !== addr.id));
                                                } catch (e) { alert('Failed to delete'); }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* History Tabs */}
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border h-full">
                        <Tabs defaultValue="orders" className="w-full">
                            <TabsList className="mb-6 w-full justify-start">
                                <TabsTrigger value="orders" className="flex-1 md:flex-none">Order History</TabsTrigger>
                                <TabsTrigger value="complaints" className="flex-1 md:flex-none">My Complaints</TabsTrigger>
                            </TabsList>

                            <TabsContent value="orders">
                                {orders.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                        <p>No orders yet.</p>
                                        <Button variant="link" onClick={() => router.push('/menu')}>Start Ordering</Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/orders/${order.id}`)}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-mono text-sm text-gray-500">#{order.id.slice(0, 8)}</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                                        ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                                'bg-blue-100 text-blue-800'}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                                    </p>
                                                    <p className="font-bold">₹{order.total}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="complaints">
                                {complaints.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <MessageSquareWarning className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                        <p>No complaints submitted.</p>
                                        <p className="text-xs mt-1">If you have an issue with an order, go to Order Details to report it.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {complaints.map((complaint) => (
                                            <div key={complaint.id} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-medium text-slate-900">{complaint.subject}</h3>
                                                    <Badge variant={
                                                        complaint.status === 'RESOLVED' ? "outline" : "destructive" // Green/Outline for Resolved? Or maybe standard Badge variant?
                                                    } className={
                                                        complaint.status === 'RESOLVED' ? "bg-green-100 text-green-800 border-green-200" :
                                                            complaint.status === 'IN_PROGRESS' ? "bg-blue-100 text-blue-800 border-blue-200" : ""
                                                    }>
                                                        {complaint.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-3">{complaint.message}</p>
                                                <p className="text-xs text-slate-400">
                                                    Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}

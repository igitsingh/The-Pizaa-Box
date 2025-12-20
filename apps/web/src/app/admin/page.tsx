'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Pizza, ShoppingBag } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/admin/orders">
                    <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <h2 className="text-xl font-bold mb-2">Live Orders</h2>
                        <p className="text-gray-600">Manage incoming orders and update status.</p>
                    </div>
                </Link>

                <Link href="/admin/menu">
                    <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <h2 className="text-xl font-bold mb-2">Menu Management</h2>
                        <p className="text-gray-600">Add, edit, or remove menu items.</p>
                    </div>
                </Link>

                <Link href="/admin/analytics">
                    <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <h2 className="text-xl font-bold mb-2">Analytics</h2>
                        <p className="text-gray-600">View sales stats and charts.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

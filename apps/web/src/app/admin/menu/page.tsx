'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Item {
    id: string;
    name: string;
    price: number;
    category: { name: string };
}

export default function AdminMenuPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await api.get('/menu');
                // Flatten items from categories
                const allItems = res.data.flatMap((cat: any) =>
                    cat.items.map((item: any) => ({ ...item, category: { name: cat.name } }))
                );
                setItems(allItems);
            } catch (error) {
                console.error('Failed to fetch menu', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`/admin/menu/${id}`);
            setItems(items.filter(i => i.id !== id));
        } catch (error) {
            console.error('Failed to delete item', error);
            alert('Failed to delete item');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Menu Management</h1>
                <Link href="/admin/menu/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add New Item
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-bold">Name</th>
                            <th className="p-4 font-bold">Category</th>
                            <th className="p-4 font-bold">Price</th>
                            <th className="p-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4">{item.name}</td>
                                <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.category.name}</span></td>
                                <td className="p-4">₹{item.price}</td>
                                <td className="p-4 text-right space-x-2">
                                    <Button variant="ghost" size="sm">
                                        <Edit className="h-4 w-4 text-blue-500" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

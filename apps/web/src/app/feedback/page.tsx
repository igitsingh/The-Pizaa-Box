'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare, Plus, Clock, CheckCircle, XCircle, HelpCircle, AlertCircle } from 'lucide-react';

interface FeedbackItem {
    id: string;
    message: string;
    status: string;
    createdAt: string;
    type: 'ENQUIRY' | 'COMPLAINT';
    subject?: string; // Only for Complaint
    source?: string;  // Only for Enquiry
}

export default function FeedbackPage() {
    const [items, setItems] = useState<FeedbackItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            try {
                const [enqRes, compRes] = await Promise.all([
                    api.get('/enquiry/my').catch(() => ({ data: [] })),
                    api.get('/complaints/my').catch(() => ({ data: [] }))
                ]);

                const combined: FeedbackItem[] = [
                    ...enqRes.data.map((e: any) => ({ ...e, type: 'ENQUIRY' })),
                    ...compRes.data.map((c: any) => ({ ...c, type: 'COMPLAINT' }))
                ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                setItems(combined);
            } catch (error: any) {
                console.error('Failed to fetch feedback', error);
                if (error.response?.status !== 401) {
                    // Handle error
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW':
            case 'OPEN':
                return 'bg-blue-100 text-blue-800';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
            case 'CONTACTED': return 'bg-purple-100 text-purple-800';
            case 'RESOLVED':
            case 'CONVERTED': return 'bg-green-100 text-green-800';
            case 'CLOSED': return 'bg-gray-100 text-gray-800';
            case 'SPAM': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'NEW':
            case 'OPEN':
                return <Clock className="h-4 w-4" />;
            case 'IN_PROGRESS': return <Loader2 className="h-4 w-4" />;
            case 'CONTACTED': return <MessageSquare className="h-4 w-4" />;
            case 'RESOLVED':
            case 'CONVERTED': return <CheckCircle className="h-4 w-4" />;
            case 'CLOSED': return <CheckCircle className="h-4 w-4" />;
            case 'SPAM': return <XCircle className="h-4 w-4" />;
            default: return <HelpCircle className="h-4 w-4" />;
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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Feedback & Complaints</h1>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No history</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        You haven't submitted any feedback, enquiries, or complaints yet.
                    </p>
                    <Link href="/contact">
                        <Button variant="outline">Contact Us</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    {item.type === 'COMPLAINT' ? (
                                        <span className="flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">
                                            <AlertCircle className="w-3 h-3" /> Complaint
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                                            <MessageSquare className="w-3 h-3" /> Enquiry
                                        </span>
                                    )}
                                    <span>•</span>
                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                    <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${getStatusColor(item.status)}`}>
                                    {getStatusIcon(item.status)}
                                    {item.status.replace(/_/g, ' ')}
                                </span>
                            </div>

                            {item.subject && (
                                <h4 className="font-bold text-gray-900 mb-2">{item.subject}</h4>
                            )}

                            <p className="text-gray-800 font-medium whitespace-pre-wrap mb-4">
                                "{item.message}"
                            </p>

                            {item.source && (
                                <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider font-bold">
                                    <span>via {item.source.replace(/_/g, ' ')}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

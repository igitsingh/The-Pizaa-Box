'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface ComplaintDialogProps {
    orderId: string;
}

export default function ComplaintDialog({ orderId }: ComplaintDialogProps) {
    const [open, setOpen] = useState(false);
    const [subject, setSubject] = useState(`Issue with Order #${orderId.slice(0, 8)}`);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/complaints', { subject, message });
            toast.success('Complaint submitted. We will look into it.');
            setOpen(false);
            setMessage('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Report Issue
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Report an Issue</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Subject</label>
                        <Input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Description</label>
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Describe the issue..."
                            required
                            rows={4}
                            className="resize-none"
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                        {loading ? 'Submitting...' : 'Submit Complaint'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

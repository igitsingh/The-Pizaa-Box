'use client';

import { useState } from 'react';
import { Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function CallbackButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !phone) {
            toast.error('Please fill in all fields');
            return;
        }

        // Basic phone validation
        if (phone.length !== 10 || !/^[0-9]+$/.test(phone)) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/enquiry/callback', { name, phone });
            toast.success('Callback request received! We will call you shortly.');
            setIsOpen(false);
            setName('');
            setPhone('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Floating Callback Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 group"
                aria-label="Request Callback"
            >
                <Phone className="h-6 w-6 group-hover:scale-110 transition-transform" />
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Request Callback
                </span>
            </button>

            {/* Callback Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-green-600" />
                            Request a Callback
                        </DialogTitle>
                        <DialogDescription>
                            Enter your details and we'll call you back within 5 minutes!
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div>
                            <label htmlFor="callback-name" className="block text-sm font-medium text-gray-700 mb-2">
                                Your Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="callback-name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="callback-phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="callback-phone"
                                type="tel"
                                placeholder="9876543210"
                                value={phone}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value.replace(/\D/g, ''))}
                                required
                                className="w-full"
                                maxLength={10}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                We'll call you on this number
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Phone className="mr-2 h-4 w-4" />
                                        Call Me
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

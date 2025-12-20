'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, User, FileText, Gift, Truck, MessageSquare, Info, Pizza } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const { user } = useStore();

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full w-[300px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full hidden'}`}
            >
                <div className="p-4 flex justify-between items-center border-b">
                    <div className="flex items-center gap-2">
                        <div className="bg-gray-100 p-2 rounded-full">
                            <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                            {user ? (
                                <div>
                                    <p className="font-bold text-sm">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="font-bold text-sm">Welcome Guest</p>
                                    <Link href="/login" onClick={onClose}>
                                        <span className="text-xs text-primary font-bold hover:underline">Login / Signup</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="py-4">
                    <nav className="space-y-1">
                        <SidebarLink href="/menu" icon={Pizza} label="Our Menu" onClose={onClose} />
                        <SidebarLink href="/menu#deals" icon={Gift} label="Deals & Offers" onClose={onClose} />
                        <SidebarLink href="/orders" icon={Truck} label="Track Current Order" onClose={onClose} />
                        <SidebarLink href="/profile" icon={FileText} label="Order History" onClose={onClose} />
                        <div className="my-2 border-t" />
                        <SidebarLink href="#" icon={MessageSquare} label="Feedback" onClose={onClose} />
                        <SidebarLink href="#" icon={Info} label="Terms & Conditions" onClose={onClose} />
                    </nav>
                </div>

                {user && (
                    <div className="absolute bottom-0 w-full p-4 border-t bg-gray-50">
                        <Button
                            variant="outline"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                                // Clear user from store
                                useStore.getState().setUser(null);
                                // Clear token from localStorage
                                localStorage.removeItem('token');
                                // Clear cart
                                useStore.getState().clearCart();
                                // Redirect to login
                                window.location.href = '/login';
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

function SidebarLink({ href, icon: Icon, label, onClose }: { href: string; icon: any; label: string; onClose: () => void }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors"
            onClick={onClose}
        >
            <Icon className="h-5 w-5" />
            <span className="font-medium text-sm">{label}</span>
        </Link>
    );
}

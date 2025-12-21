'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const { cart, user } = useStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navbarClasses = isScrolled
        ? "bg-white/95 backdrop-blur-md border-b shadow-sm"
        : "bg-white border-b border-transparent shadow-sm";

    return (
        <>
            <nav className={cn(
                "sticky top-0 z-50 transition-all duration-300",
                navbarClasses
            )}>

                <div className="container mx-auto px-4 h-16 flex items-center justify-between w-full relative z-10">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Logo className="scale-75 md:scale-100 origin-left" />
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/menu" className="text-gray-600 hover:text-primary font-medium transition-colors">
                            Menu
                        </Link>
                        <Link href="/orders" className="text-gray-600 hover:text-primary font-medium transition-colors">
                            Orders
                        </Link>
                        {user?.role === 'ADMIN' && (
                            <Link href="http://localhost:3001" target="_blank">
                                <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                                    Admin Panel
                                </Button>
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link href="/cart">
                            <Button variant="ghost" className="relative hover:bg-gray-50 text-gray-900">
                                <ShoppingCart className="h-5 w-5" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                        {cart.length}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        <Button
                            variant="ghost"
                            className="hover:bg-gray-50 text-gray-900"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <User className="h-5 w-5" />
                            {user && <span className="ml-2 text-sm font-medium hidden md:inline-block">Hi, {user.name.split(' ')[0]}</span>}
                        </Button>
                    </div>
                </div>
            </nav>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
    );
};

export default Navbar;

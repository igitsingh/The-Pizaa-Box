"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Mobile Menu Toggle Button - Only show when sidebar is closed */}
            {!isSidebarOpen && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-md hover:bg-gray-100"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <Menu className="h-6 w-6" />
                </Button>
            )}

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
                {children}
            </main>
        </div>
    )
}

"use client"

import { useState, useEffect } from "react"
import { Search, User as UserIcon } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import api from "@/lib/api"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type User = {
    id: string
    name: string
    email: string
    phone?: string
    role: "ADMIN" | "CUSTOMER"
    createdAt: string
    _count?: {
        orders: number
    }
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setIsLoading(true)
            const res = await api.get("/users")
            setUsers(res.data)
        } catch (error) {
            toast.error("Failed to fetch users")
        } finally {
            setIsLoading(false)
        }
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone && user.phone.includes(searchQuery))
    )

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Users</h2>
                    <p className="text-slate-500 mt-1">Manage your customer base.</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search users..."
                        className="pl-9 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Orders</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">Loading...</TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-slate-500">No users found</TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow
                                    key={user.id}
                                    className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                                    onClick={() => window.location.href = `/customers/${user.id}`}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <UserIcon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-xs text-slate-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.phone || "-"}</TableCell>
                                    <TableCell>{user._count?.orders || 0}</TableCell>
                                    <TableCell>{format(new Date(user.createdAt), "MMM d, yyyy")}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

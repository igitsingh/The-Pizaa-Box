"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, MessageSquareWarning } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Complaint {
    id: string
    subject: string
    message: string
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED"
    createdAt: string
    user: {
        name: string
        email: string
        phone: string | null
    }
}

export default function ComplaintsPage() {
    const [complaints, setComplaints] = useState<Complaint[]>([])
    const [loading, setLoading] = useState(true)

    const fetchComplaints = async () => {
        try {
            const response = await api.get("/complaints")
            setComplaints(response.data)
        } catch (error) {
            console.error("Failed to fetch complaints", error)
            toast.error("Failed to load complaints")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchComplaints()
    }, [])

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await api.put(`/complaints/${id}/status`, { status: newStatus })
            toast.success("Complaint status updated")
            fetchComplaints() // Refresh list
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Complaints</h2>
                    <p className="text-slate-500 mt-1">Manage customer complaints and support tickets.</p>
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>All Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {complaints.map((complaint) => (
                                <TableRow key={complaint.id}>
                                    <TableCell>
                                        <div className="font-medium">{complaint.user.name}</div>
                                        <div className="text-sm text-slate-500">{complaint.user.email}</div>
                                        {complaint.user.phone && <div className="text-xs text-slate-400">{complaint.user.phone}</div>}
                                    </TableCell>
                                    <TableCell className="font-medium">{complaint.subject}</TableCell>
                                    <TableCell className="max-w-xs truncate" title={complaint.message}>
                                        {complaint.message}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                complaint.status === "OPEN"
                                                    ? "destructive"
                                                    : complaint.status === "IN_PROGRESS"
                                                        ? "default" // using default (primary color) for in progress
                                                        : "secondary" // green/secondary for resolved usually implies success/done
                                            }
                                            className={
                                                complaint.status === "RESOLVED" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""
                                            }
                                        >
                                            {complaint.status.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={complaint.status}
                                            onValueChange={(value) => handleStatusUpdate(complaint.id, value)}
                                        >
                                            <SelectTrigger className="w-[130px]">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="OPEN">Open</SelectItem>
                                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {complaints.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                        No complaints found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

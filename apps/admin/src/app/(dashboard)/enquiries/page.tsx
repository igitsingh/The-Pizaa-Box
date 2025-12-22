"use client"

import { useState, useEffect } from "react"
import { Phone, Mail, MessageSquare, User, Calendar, Filter, Eye, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

type Enquiry = {
    id: string
    name: string
    email: string | null
    phone: string
    message: string
    source: string
    status: string
    assignedTo: string | null
    notes: string | null
    createdAt: string
    updatedAt: string
    assignedUser: {
        id: string
        name: string
        email: string
    } | null
}

const STATUS_OPTIONS = [
    { value: "NEW", label: "New", color: "bg-blue-100 text-blue-800" },
    { value: "IN_PROGRESS", label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
    { value: "CONTACTED", label: "Contacted", color: "bg-purple-100 text-purple-800" },
    { value: "CONVERTED", label: "Converted", color: "bg-green-100 text-green-800" },
    { value: "CLOSED", label: "Closed", color: "bg-gray-100 text-gray-800" },
    { value: "SPAM", label: "Spam", color: "bg-red-100 text-red-800" },
]

const SOURCE_OPTIONS = [
    { value: "CONTACT_FORM", label: "Contact Form", icon: "📝" },
    { value: "WHATSAPP", label: "WhatsApp", icon: "💬" },
    { value: "CALL_BACK", label: "Callback", icon: "📞" },
    { value: "CHAT", label: "Chat", icon: "💭" },
    { value: "PHONE", label: "Phone", icon: "☎️" },
    { value: "EMAIL", label: "Email", icon: "📧" },
]

export default function EnquiriesPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string>("ALL")
    const [sourceFilter, setSourceFilter] = useState<string>("ALL")
    const [notes, setNotes] = useState("")
    const [stats, setStats] = useState<any>(null)
    const [staffList, setStaffList] = useState<any[]>([])

    useEffect(() => {
        fetchEnquiries()
        fetchStats()
        fetchStaff()
    }, [statusFilter, sourceFilter])

    const fetchEnquiries = async () => {
        try {
            setIsLoading(true)
            const params = new URLSearchParams()
            if (statusFilter !== "ALL") params.append("status", statusFilter)
            if (sourceFilter !== "ALL") params.append("source", sourceFilter)

            const res = await api.get(`/enquiries?${params.toString()}`)
            setEnquiries(res.data)
        } catch (error) {
            toast.error("Failed to fetch enquiries")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const res = await api.get("/enquiries/stats")
            setStats(res.data)
        } catch (error) {
            console.error("Failed to fetch stats", error)
        }
    }

    const fetchStaff = async () => {
        try {
            const res = await api.get("/users/staff")
            setStaffList(res.data)
        } catch (error) {
            console.error("Failed to fetch staff", error)
        }
    }

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/enquiries/${id}/status`, { status })
            toast.success("Status updated")
            fetchEnquiries()
            fetchStats()
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    const handleUpdateNotes = async () => {
        if (!selectedEnquiry) return

        try {
            await api.patch(`/enquiries/${selectedEnquiry.id}/notes`, { notes })
            toast.success("Notes updated")
            setIsDetailsOpen(false)
            fetchEnquiries()
        } catch (error) {
            toast.error("Failed to update notes")
        }
    }

    const handleAssignStaff = async (id: string, assignedTo: string) => {
        try {
            await api.patch(`/enquiries/${id}/assign`, { assignedTo: assignedTo === "none" ? null : assignedTo })
            toast.success("Assignment updated")
            if (selectedEnquiry && selectedEnquiry.id === id) {
                // Update local selected enquiry if it's the one in the dialog
                const updatedStaff = staffList.find(s => s.id === assignedTo)
                setSelectedEnquiry(prev => prev ? {
                    ...prev,
                    assignedTo: assignedTo === "none" ? null : assignedTo,
                    assignedUser: assignedTo === "none" ? null : updatedStaff
                } : null)
            }
            fetchEnquiries()
        } catch (error) {
            toast.error("Failed to update assignment")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this enquiry?")) return

        try {
            await api.delete(`/enquiries/${id}`)
            toast.success("Enquiry deleted")
            fetchEnquiries()
            fetchStats()
        } catch (error) {
            toast.error("Failed to delete enquiry")
        }
    }

    const getStatusColor = (status: string) => {
        return STATUS_OPTIONS.find(s => s.value === status)?.color || "bg-gray-100 text-gray-800"
    }

    const getSourceIcon = (source: string) => {
        return SOURCE_OPTIONS.find(s => s.value === source)?.icon || "📋"
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Enquiries & Leads</h2>
                    <p className="text-slate-500 mt-1">Manage customer enquiries and callback requests.</p>
                </div>
                <Button onClick={fetchEnquiries} variant="outline" size="sm">
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <p className="text-sm text-slate-500">Total Enquiries</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700">New</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.byStatus.new}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-700">In Progress</p>
                        <p className="text-2xl font-bold text-yellow-900">{stats.byStatus.inProgress}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700">Converted</p>
                        <p className="text-2xl font-bold text-green-900">{stats.byStatus.converted}</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[200px] bg-white">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        {STATUS_OPTIONS.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                                {status.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger className="w-full md:w-[200px] bg-white">
                        <SelectValue placeholder="Filter by source" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Sources</SelectItem>
                        {SOURCE_OPTIONS.map(source => (
                            <SelectItem key={source.value} value={source.value}>
                                {source.icon} {source.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Enquiries Table */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">Loading...</TableCell>
                            </TableRow>
                        ) : enquiries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-slate-500">
                                    No enquiries found
                                </TableCell>
                            </TableRow>
                        ) : (
                            enquiries.map((enquiry) => (
                                <TableRow key={enquiry.id} className="hover:bg-slate-50/50">
                                    <TableCell>
                                        <div className="font-medium">{enquiry.name}</div>
                                        {enquiry.assignedUser && (
                                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                <UserPlus className="h-3 w-3" />
                                                {enquiry.assignedUser.name}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <a href={`tel:${enquiry.phone}`} className="text-sm flex items-center gap-1 hover:text-blue-600">
                                                <Phone className="h-3 w-3" />
                                                {enquiry.phone}
                                            </a>
                                            {enquiry.email && (
                                                <a href={`mailto:${enquiry.email}`} className="text-xs text-slate-500 flex items-center gap-1 hover:text-blue-600">
                                                    <Mail className="h-3 w-3" />
                                                    {enquiry.email}
                                                </a>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[300px]">
                                        <div className="text-sm text-slate-700 line-clamp-2">
                                            {enquiry.message}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">
                                            {getSourceIcon(enquiry.source)} {SOURCE_OPTIONS.find(s => s.value === enquiry.source)?.label}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={enquiry.status}
                                            onValueChange={(value) => handleUpdateStatus(enquiry.id, value)}
                                        >
                                            <SelectTrigger className="w-[140px] h-8">
                                                <Badge variant="outline" className={`${getStatusColor(enquiry.status)} border-0`}>
                                                    {STATUS_OPTIONS.find(s => s.value === enquiry.status)?.label}
                                                </Badge>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STATUS_OPTIONS.map(status => (
                                                    <SelectItem key={status.value} value={status.value}>
                                                        {status.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{format(new Date(enquiry.createdAt), "MMM d, yyyy")}</div>
                                        <div className="text-xs text-slate-500">{format(new Date(enquiry.createdAt), "h:mm a")}</div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedEnquiry(enquiry)
                                                    setNotes(enquiry.notes || "")
                                                    setIsDetailsOpen(true)
                                                }}
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4 text-slate-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(enquiry.id)}
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Enquiry Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Enquiry Details</DialogTitle>
                        <DialogDescription>
                            Submitted on {selectedEnquiry && format(new Date(selectedEnquiry.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedEnquiry && (
                        <div className="space-y-6 mt-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="font-semibold text-slate-500 mb-1">Customer Name</div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-slate-400" />
                                        {selectedEnquiry.name}
                                    </div>
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-500 mb-1">Source</div>
                                    <div>
                                        {getSourceIcon(selectedEnquiry.source)} {SOURCE_OPTIONS.find(s => s.value === selectedEnquiry.source)?.label}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="font-semibold text-slate-500 mb-1">Phone</div>
                                    <a href={`tel:${selectedEnquiry.phone}`} className="flex items-center gap-2 hover:text-blue-600">
                                        <Phone className="h-4 w-4" />
                                        {selectedEnquiry.phone}
                                    </a>
                                </div>
                                {selectedEnquiry.email && (
                                    <div>
                                        <div className="font-semibold text-slate-500 mb-1">Email</div>
                                        <a href={`mailto:${selectedEnquiry.email}`} className="flex items-center gap-2 hover:text-blue-600 text-sm">
                                            <Mail className="h-4 w-4" />
                                            {selectedEnquiry.email}
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="font-semibold text-slate-500 mb-2 font-medium">Assign Agent</div>
                                    <Select
                                        value={selectedEnquiry.assignedTo || "none"}
                                        onValueChange={(value) => handleAssignStaff(selectedEnquiry.id, value)}
                                    >
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Select staff..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Unassigned</SelectItem>
                                            {staffList.map(staff => (
                                                <SelectItem key={staff.id} value={staff.id}>
                                                    {staff.name} ({staff.role})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-500 mb-2 font-medium">Status</div>
                                    <Select value={selectedEnquiry.status} onValueChange={(value) => handleUpdateStatus(selectedEnquiry.id, value)}>
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Status..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map(status => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <div className="font-semibold text-slate-500 mb-2">Message</div>
                                <div className="bg-slate-50 p-4 rounded-lg text-sm">
                                    {selectedEnquiry.message}
                                </div>
                            </div>

                            <div>
                                <div className="font-semibold text-slate-500 mb-2">Internal Notes</div>
                                <Textarea
                                    placeholder="Add internal notes about this enquiry..."
                                    value={notes}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateNotes}>
                            Save Notes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

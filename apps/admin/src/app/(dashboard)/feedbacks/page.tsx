"use client"

import { useState, useEffect } from "react"
import { Star, Eye, EyeOff, MessageSquare, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import api from "@/lib/api"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

type Feedback = {
    id: string
    orderId: string
    rating: number
    review: string | null
    adminResponse: string | null
    isVisible: boolean
    createdAt: string
    guestPhone: string | null
    order: {
        orderNumber: number
        createdAt: string
        total: number
    }
    user: {
        name: string
        email: string
        phone: string | null
    } | null
}

export default function FeedbacksPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [adminResponse, setAdminResponse] = useState("")

    useEffect(() => {
        fetchFeedbacks()
    }, [])

    const fetchFeedbacks = async () => {
        try {
            setIsLoading(true)
            const res = await api.get("/admin/feedbacks")
            setFeedbacks(res.data)
        } catch (error) {
            toast.error("Failed to fetch feedbacks")
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleVisibility = async (id: string) => {
        try {
            await api.patch(`/feedbacks/${id}/toggle-visibility`)
            toast.success("Visibility updated")
            fetchFeedbacks()
        } catch (error) {
            toast.error("Failed to update visibility")
        }
    }

    const handleRespondToFeedback = async () => {
        if (!selectedFeedback || !adminResponse.trim()) {
            toast.error("Please enter a response")
            return
        }

        try {
            await api.patch(`/feedbacks/${selectedFeedback.id}/respond`, {
                adminResponse: adminResponse.trim()
            })
            toast.success("Response added successfully")
            setIsDetailsOpen(false)
            setAdminResponse("")
            fetchFeedbacks()
        } catch (error) {
            toast.error("Failed to add response")
        }
    }

    const handleDeleteFeedback = async (id: string) => {
        if (!confirm("Are you sure you want to delete this feedback?")) return

        try {
            await api.delete(`/admin/feedbacks/${id}`)
            toast.success("Feedback deleted")
            fetchFeedbacks()
        } catch (error) {
            toast.error("Failed to delete feedback")
        }
    }

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Feedbacks & Ratings</h2>
                    <p className="text-slate-500 mt-1">Manage customer feedback and reviews.</p>
                </div>
                <Button onClick={fetchFeedbacks} variant="outline" size="sm">
                    Refresh
                </Button>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Review</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">Loading...</TableCell>
                            </TableRow>
                        ) : feedbacks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-slate-500">No feedbacks yet</TableCell>
                            </TableRow>
                        ) : (
                            feedbacks.map((feedback) => (
                                <TableRow key={feedback.id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-mono text-xs font-bold text-orange-600">
                                        TPB{String(feedback.order.orderNumber).padStart(5, '0')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">
                                            {feedback.user?.name || 'Guest Customer'}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {feedback.user?.email || feedback.guestPhone}
                                        </div>
                                    </TableCell>
                                    <TableCell>{renderStars(feedback.rating)}</TableCell>
                                    <TableCell className="max-w-[300px]">
                                        <div className="text-sm text-slate-700 line-clamp-2">
                                            {feedback.review || <span className="text-slate-400 italic">No review text</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>{format(new Date(feedback.createdAt), "MMM d, yyyy")}</TableCell>
                                    <TableCell>
                                        <Badge variant={feedback.isVisible ? "default" : "secondary"}>
                                            {feedback.isVisible ? "Visible" : "Hidden"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleToggleVisibility(feedback.id)}
                                                title={feedback.isVisible ? "Hide" : "Show"}
                                            >
                                                {feedback.isVisible ? (
                                                    <EyeOff className="h-4 w-4 text-slate-500" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-slate-500" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedFeedback(feedback)
                                                    setAdminResponse(feedback.adminResponse || "")
                                                    setIsDetailsOpen(true)
                                                }}
                                                title="View & Respond"
                                            >
                                                <MessageSquare className="h-4 w-4 text-slate-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteFeedback(feedback.id)}
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

            {/* Feedback Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Feedback Details</DialogTitle>
                        <DialogDescription>
                            Order ID: TPB{String(selectedFeedback?.order.orderNumber).padStart(5, '0')}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedFeedback && (
                        <div className="space-y-6 mt-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="font-semibold text-slate-500">Customer</div>
                                    <div>{selectedFeedback.user?.name || 'Guest Customer'}</div>
                                    <div className="text-xs text-slate-500">
                                        {selectedFeedback.user?.email || selectedFeedback.guestPhone}
                                    </div>
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-500">Rating</div>
                                    {renderStars(selectedFeedback.rating)}
                                    <div className="text-xs text-slate-500 mt-1">
                                        {selectedFeedback.rating} out of 5 stars
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="font-semibold text-slate-500 mb-2">Customer Review</div>
                                <div className="bg-slate-50 p-4 rounded-lg text-sm">
                                    {selectedFeedback.review || <span className="text-slate-400 italic">No review text provided</span>}
                                </div>
                            </div>

                            <div>
                                <div className="font-semibold text-slate-500 mb-2">Admin Response</div>
                                <Textarea
                                    placeholder="Write your response to the customer..."
                                    value={adminResponse}
                                    onChange={(e) => setAdminResponse(e.target.value)}
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
                        <Button onClick={handleRespondToFeedback}>
                            Save Response
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

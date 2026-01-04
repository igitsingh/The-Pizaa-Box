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
import { Download, IndianRupee } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"

interface Transaction {
    id: string
    amount: number
    type: string
    status: string
    method: string
    reference: string | null
    createdAt: string
    orderId: string | null
}

export default function PaymentsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    const fetchTransactions = async () => {
        try {
            const response = await api.get("/admin/payments")
            setTransactions(response.data)
        } catch (error) {
            console.error("Failed to fetch transactions", error)
            toast.error("Failed to load transactions")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    const handleExport = async () => {
        try {
            const response = await api.get("/admin/payments/export", {
                responseType: 'blob', // Important for file download
            })

            // Create a blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Transactions exported successfully")
        } catch (error) {
            console.error("Export failed", error)
            toast.error("Failed to export transactions")
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Payments</h2>
                    <p className="text-slate-500 mt-1">View transaction history and export financial data.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleExport} variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((txn) => (
                                <TableRow key={txn.id}>
                                    <TableCell className="font-mono text-xs text-slate-500">
                                        {txn.id.slice(0, 8)}...
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {formatCurrency(txn.amount)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{txn.type}</Badge>
                                    </TableCell>
                                    <TableCell>{txn.method}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                txn.status === "SUCCESS"
                                                    ? "default" // using default (black/primary) for success
                                                    : txn.status === "FAILED"
                                                        ? "destructive"
                                                        : "secondary"
                                            }
                                            className={
                                                txn.status === "SUCCESS" ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : ""
                                            }
                                        >
                                            {txn.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-500">
                                        {txn.reference || "-"}
                                    </TableCell>
                                    <TableCell>{new Date(txn.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                            {transactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                        No transactions found.
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

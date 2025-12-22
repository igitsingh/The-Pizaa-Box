"use client"

import { useState, useEffect } from "react"
import { Users, Gift, TrendingUp, Search, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReferralsPage() {
    const [overview, setOverview] = useState<any>(null)
    const [transactions, setTransactions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [overviewRes, transactionsRes] = await Promise.all([
                api.get("/referrals/overview"),
                api.get("/referrals/transactions")
            ])
            setOverview(overviewRes.data)
            setTransactions(transactionsRes.data)
        } catch (error) {
            toast.error("Failed to fetch referral data")
        } finally {
            setIsLoading(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    if (isLoading) {
        return <div className="p-8 text-center">Loading referral data...</div>
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Referrals</h2>
                    <p className="text-slate-500 mt-1">Monitor and manage the "Refer a Friend" program.</p>
                </div>
                <Button onClick={fetchData} variant="outline">Refresh</Button>
            </div>

            {overview && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                            <Users className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{overview.stats.totalCount}</div>
                            <p className="text-xs text-slate-500">Successful conversions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rewards Distributed</CardTitle>
                            <Gift className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(overview.stats.totalRewardsDistributed)}</div>
                            <p className="text-xs text-slate-500">Total payouts to referrers</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Program ROI</CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12.4%</div>
                            <p className="text-xs text-slate-500">Revenue from referrals</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Tabs defaultValue="top-referrers" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="top-referrers">Top Referrers</TabsTrigger>
                    <TabsTrigger value="transactions">Recent Rewards</TabsTrigger>
                </TabsList>

                <TabsContent value="top-referrers" className="space-y-4">
                    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead>Referrer</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Total Referrals</TableHead>
                                    <TableHead>Rewards Earned</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {overview?.topReferrers.map((user: any) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email || user.phone}</div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{user.referralCode}</code>
                                        </TableCell>
                                        <TableCell>{user.totalReferrals}</TableCell>
                                        <TableCell className="font-bold text-green-600">{formatCurrency(user.referralReward)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => window.location.href = `/customers/${user.id}`}>
                                                View Profile
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4">
                    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Referrer</TableHead>
                                    <TableHead>New Customer</TableHead>
                                    <TableHead>Order Value</TableHead>
                                    <TableHead>Reward</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((tx: any) => (
                                    <TableRow key={tx.id}>
                                        <TableCell className="text-sm">
                                            {format(new Date(tx.createdAt), "MMM d, HH:mm")}
                                        </TableCell>
                                        <TableCell className="font-medium">{tx.referrer.name}</TableCell>
                                        <TableCell>{tx.referee.name}</TableCell>
                                        <TableCell>{formatCurrency(tx.orderValue)}</TableCell>
                                        <TableCell className="font-bold text-green-600">+{formatCurrency(tx.rewardAmount)}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                {tx.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

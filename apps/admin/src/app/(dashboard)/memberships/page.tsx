"use client"

import { useState, useEffect } from "react"
import { Trophy, Star, Crown, Zap, Search, Filter } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MembershipsPage() {
    const [overview, setOverview] = useState<any>(null)
    const [members, setMembers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [overviewRes, membersRes] = await Promise.all([
                api.get("/admin/memberships/overview"),
                api.get("/admin/memberships/members")
            ])
            setOverview(overviewRes.data)
            setMembers(membersRes.data)
        } catch (error) {
            toast.error("Failed to fetch membership data")
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

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'PLATINUM': return 'bg-slate-900 text-white border-slate-700'
            case 'GOLD': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'SILVER': return 'bg-slate-200 text-slate-800 border-slate-300'
            default: return 'bg-orange-100 text-orange-800 border-orange-200'
        }
    }

    const getTierIcon = (tier: string) => {
        switch (tier) {
            case 'PLATINUM': return <Zap className="h-4 w-4" />
            case 'GOLD': return <Crown className="h-4 w-4" />
            case 'SILVER': return <Star className="h-4 w-4" />
            default: return <Trophy className="h-4 w-4" />
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center">Loading membership data...</div>
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Memberships</h2>
                    <p className="text-slate-500 mt-1">Manage loyalty tiers and customer points.</p>
                </div>
                <Button onClick={fetchData} variant="outline">Refresh</Button>
            </div>

            {overview && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(overview.stats).map(([tier, count]: [string, any]) => (
                        <Card key={tier}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{tier}</CardTitle>
                                {getTierIcon(tier)}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{count}</div>
                                <p className="text-xs text-slate-500">Active members</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Member Directory</CardTitle>
                    <CardDescription>All customers ranked by lifetime spending and loyalty tier.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Tier</TableHead>
                                    <TableHead>Points</TableHead>
                                    <TableHead>Lifetime Spend</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.map((member: any) => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <div className="font-medium">{member.name}</div>
                                            <div className="text-xs text-slate-500">{member.email || member.phone}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`flex items-center gap-1 w-fit ${getTierColor(member.membershipTier)}`}>
                                                {getTierIcon(member.membershipTier)}
                                                {member.membershipTier}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 font-bold">
                                                <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                {member.membershipPoints}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{formatCurrency(member.lifetimeSpending)}</TableCell>
                                        <TableCell className="text-sm text-slate-500">
                                            {format(new Date(member.createdAt), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => window.location.href = `/customers/${member.id}`}>
                                                Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

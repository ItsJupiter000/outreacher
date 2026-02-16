
"use client";

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, Reply } from "lucide-react";
import axios from 'axios';

interface Record {
    id: string;
    company_name: string;
    hr_name: string;
    email: string;
    title: string;
    status: 'sent' | 'replied' | 'failed' | 'not_sent';
    sent_at: string;
}

export default function Dashboard() {
    const [records, setRecords] = useState<Record[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/dashboard');
            setRecords(res.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const markAsReplied = async (id: string) => {
        try {
            await axios.put('http://localhost:5000/api/status', { id, status: 'replied' });
            fetchData(); // Refresh
        } catch (error) {
            console.error("Failed to update status");
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    const stats = {
        sent: records.filter(r => r.status === 'sent').length,
        replied: records.filter(r => r.status === 'replied').length,
        failed: records.filter(r => r.status === 'failed').length,
        total: records.length
    };

    return (
        <main className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Sent</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Delivered</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-blue-600">{stats.sent}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Replied</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">{stats.replied}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Failed</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-red-600">{stats.failed}</div></CardContent>
                </Card>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Company</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Sent At</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {records.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell className="font-medium">{record.company_name}</TableCell>
                                <TableCell>{record.hr_name}</TableCell>
                                <TableCell>{record.email}</TableCell>
                                <TableCell>{new Date(record.sent_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        record.status === 'replied' ? 'default' :
                                            record.status === 'sent' ? 'secondary' : 'destructive'
                                    }>
                                        {record.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {record.status === 'sent' && (
                                        <Button variant="ghost" size="sm" onClick={() => markAsReplied(record.id)}>
                                            <Reply className="h-4 w-4 mr-1" /> Mark Replied
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </main>
    );
}


"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Mail, Check, X, Plus, Clock, ArrowRight, RotateCcw, Trash2, ArrowUpDown, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { DataTablePagination } from "@/components/data-table-pagination";
import axios from 'axios';

// Define types locally or import
interface Employee {
  first_name: string;
  last_name: string;
  email: string;
  position: string;
  department: string;
}

interface SentRecord {
  id: string;
  company_name: string;
  hr_name: string;
  email: string;
  title: string;
  status: string;
  sent_at: string;
  source?: string;
}

type SortField = 'company_name' | 'email' | 'sent_at' | 'status' | 'source';
type SortOrder = 'asc' | 'desc';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  // Manual Entry State
  const [manualOpen, setManualOpen] = useState(false);
  const [manualData, setManualData] = useState({
    email: '',
    position: '',
    company: ''
  });
  const [manualLoading, setManualLoading] = useState(false);

  // Dashboard State
  const [history, setHistory] = useState<SentRecord[]>([]);

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting State
  const [sortField, setSortField] = useState<SortField>('sent_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filter State
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard');
      setHistory(res.data);
    } catch (error) {
      console.error("Failed to fetch history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await axios.put('http://localhost:5000/api/status', { id, status: newStatus });
      toast({ title: "Status Updated", description: "Record updated successfully." });
      fetchHistory(); // Refresh
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/record/${id}`);
      toast({ title: "Deleted", description: "Record deleted successfully." });
      fetchHistory();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete record", variant: "destructive" });
    }
  };

  const handleReset = () => {
    setEmployees([]);
    setDomain('');
  };

  const handleSearch = async () => {
    if (!domain) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/search', { domain });
      setEmployees(res.data);
      if (res.data.length === 0) {
        toast({
          title: "No results found",
          description: "Try a different domain or company name.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data. Ensure backend is running.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedEmployee) return;
    setEmailLoading(true);
    try {
      await axios.post('http://localhost:5000/api/send', {
        email: selectedEmployee.email,
        name: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
        company: domain, // Heuristic: domain as company name
        position: selectedEmployee.position,
        source: 'search'
      });
      toast({
        title: "Email Sent",
        description: `Outreach sent to ${selectedEmployee.email}`,
      });
      setOpen(false);
      fetchHistory(); // Refresh history
    } catch (error) {
      toast({
        title: "Failed to send",
        description: "Something went wrong.",
        variant: "destructive"
      });
    } finally {
      setEmailLoading(false);
    }
  };

  const handleManualSend = async () => {
    if (!manualData.email || !manualData.company) {
      toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setManualLoading(true);
    try {
      await axios.post('http://localhost:5000/api/send', {
        email: manualData.email,
        name: "Uttam Gohil", // Hardcoded as per requirement
        company: manualData.company,
        position: manualData.position,
        source: 'manual'
      });
      toast({
        title: "Email Sent",
        description: `Outreach sent to ${manualData.email}`,
      });
      setManualOpen(false);
      setManualData({ email: '', position: '', company: '' }); // Reset
      fetchHistory(); // Refresh history
    } catch (error) {
      toast({
        title: "Failed to send",
        description: "Something went wrong.",
        variant: "destructive"
      });
    } finally {
      setManualLoading(false);
    }
  };

  // Sorting and filtering logic
  const filteredAndSortedHistory = useMemo(() => {
    let filtered = [...history];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    // Apply source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(record => (record.source || 'manual') === sourceFilter);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record =>
        record.company_name.toLowerCase().includes(query) ||
        record.email.toLowerCase().includes(query) ||
        (record.title || '').toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'sent_at') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (sortField === 'source') {
        aVal = a.source || 'manual';
        bVal = b.source || 'manual';
      } else {
        aVal = (aVal || '').toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [history, statusFilter, sourceFilter, searchQuery, sortField, sortOrder]);

  // Pagination logic
  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedHistory.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedHistory, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedHistory.length / pageSize);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sourceFilter, searchQuery, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="md:pl-64 pt-16">
        <div className="container mx-auto py-6 px-4 lg:px-8">
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Search Companies</h2>
                <p className="text-muted-foreground text-sm">Find HR contacts from company domains</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Enter company domain (e.g. stripe.com)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSearch} disabled={loading} className="flex-1 sm:flex-none">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Search
                  </Button>
                  <Button onClick={handleReset} variant="outline" disabled={loading} className="flex-1 sm:flex-none">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Dialog open={manualOpen} onOpenChange={setManualOpen}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" className="flex-1 sm:flex-none">
                        <Plus className="mr-2 h-4 w-4" /> Manual
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Manual Entry</DialogTitle>
                        <DialogDescription>
                          Manually add a candidate to send an outreach email.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Input
                          placeholder="Email Address"
                          value={manualData.email}
                          onChange={(e) => setManualData({ ...manualData, email: e.target.value })}
                        />
                        <Input
                          placeholder="Position / Title"
                          value={manualData.position}
                          onChange={(e) => setManualData({ ...manualData, position: e.target.value })}
                        />
                        <Input
                          placeholder="Company Name"
                          value={manualData.company}
                          onChange={(e) => setManualData({ ...manualData, company: e.target.value })}
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setManualOpen(false)}>Cancel</Button>
                        <Button onClick={handleManualSend} disabled={manualLoading}>
                          {manualLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Email"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Department</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.email}>
                        <TableCell className="font-medium">{employee.first_name} {employee.last_name}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{employee.email}</TableCell>
                        <TableCell className="text-right">
                          <Dialog open={open && selectedEmployee?.email === employee.email} onOpenChange={(isOpen: boolean) => {
                            setOpen(isOpen);
                            if (isOpen) setSelectedEmployee(employee);
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)}>
                                <Mail className="h-4 w-4 mr-1" /> Send
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Send Outreach Email</DialogTitle>
                                <DialogDescription>
                                  Preview the email before sending to <b>{employee.email}</b>.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="p-4 bg-gray-100 rounded-md text-sm my-4">
                                <p>Hi team at <b>{domain}</b>,</p>
                                <p className="mt-2">I noticed you're doing some interesting work...</p>
                                <p className="mt-2">[Resume Attached]</p>
                              </div>
                              <DialogFooter>
                                <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button onClick={handleSendEmail} disabled={emailLoading}>
                                  {emailLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm & Send"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!loading && employees.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                          No results found. Search for a company to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Sent History</h2>
                <p className="text-muted-foreground text-sm">Track and manage your outreach emails</p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Search by company, email, or position..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="search">Search</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('company_name')} className="h-8 p-0">
                          Company
                          <ArrowUpDown className="ml-2 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('email')} className="h-8 p-0">
                          Email
                          <ArrowUpDown className="ml-2 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">Position</TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('sent_at')} className="h-8 p-0">
                          Sent At
                          <ArrowUpDown className="ml-2 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button variant="ghost" size="sm" onClick={() => handleSort('source')} className="h-8 p-0">
                          Source
                          <ArrowUpDown className="ml-2 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('status')} className="h-8 p-0">
                          Status
                          <ArrowUpDown className="ml-2 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.company_name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{record.email}</TableCell>
                        <TableCell className="hidden lg:table-cell">{record.title || '-'}</TableCell>
                        <TableCell>{new Date(record.sent_at).toLocaleDateString()}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant={record.source === 'search' ? 'default' : 'secondary'}>
                            {record.source === 'search' ? 'Search' : 'Manual'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue={record.status} onValueChange={(val) => handleStatusUpdate(record.id, val)}>
                            <SelectTrigger className="w-[110px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sent">Sent</SelectItem>
                              <SelectItem value="replied">Replied</SelectItem>
                              <SelectItem value="interview">Interview</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredAndSortedHistory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center h-24">
                          No history found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <DataTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredAndSortedHistory.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

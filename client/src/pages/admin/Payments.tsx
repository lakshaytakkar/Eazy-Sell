import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, TrendingUp, AlertCircle, IndianRupee, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import type { Payment, Client } from "@shared/schema";
import { PageLoader } from "@/components/ui/loader";

export default function AdminPayments() {
  const { data: payments = [], isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  if (paymentsLoading) {
    return <PageLoader />;
  }

  const clientMap = new Map(clients.map(c => [c.id, c]));

  const totalPaid = payments.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
  const totalDue = payments.filter(p => p.status === "Due").reduce((sum, p) => sum + p.amount, 0);
  const totalAll = totalPaid + totalDue;
  const paidCount = payments.filter(p => p.status === "Paid").length;
  const dueCount = payments.filter(p => p.status === "Due").length;

  const formatAmount = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val}`;
  };

  const filteredPayments = payments.filter(p => {
    const client = clientMap.get(p.clientId);
    const clientName = client?.name?.toLowerCase() || "";
    const matchesSearch = !search || clientName.includes(search.toLowerCase()) || (p.invoiceId || "").toLowerCase().includes(search.toLowerCase()) || (p.description || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold" data-testid="text-payments-title">Payments</h1>
        <p className="text-muted-foreground">Overview of all client payments and collections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
                <div className="text-3xl font-bold text-green-700" data-testid="text-total-collected">{formatAmount(totalPaid)}</div>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <IndianRupee className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{paidCount} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Dues</p>
                <div className="text-3xl font-bold text-amber-700" data-testid="text-total-due">{formatAmount(totalDue)}</div>
              </div>
              <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{dueCount} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                <div className="text-3xl font-bold" data-testid="text-total-volume">{formatAmount(totalAll)}</div>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{payments.length} total entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
                <div className="text-3xl font-bold" data-testid="text-collection-rate">
                  {totalAll > 0 ? Math.round((totalPaid / totalAll) * 100) : 0}%
                </div>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Paid vs total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>{filteredPayments.length} payments found</CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search client or invoice..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-64"
                  data-testid="input-search-payments"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32" data-testid="select-status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Due">Due</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground" data-testid="text-empty-payments">No payments found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((p) => {
                  const client = clientMap.get(p.clientId);
                  return (
                    <TableRow key={p.id} data-testid={`row-payment-${p.id}`}>
                      <TableCell>
                        {client ? (
                          <Link href={`/admin/clients/${client.id}`}>
                            <span className="font-medium text-primary hover:underline cursor-pointer" data-testid={`link-client-${p.id}`}>
                              {client.name}
                            </span>
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">Unknown</span>
                        )}
                        {client && <p className="text-xs text-muted-foreground">{client.city}</p>}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{p.invoiceId}</TableCell>
                      <TableCell>{p.date}</TableCell>
                      <TableCell>{p.description}</TableCell>
                      <TableCell>{p.method || "-"}</TableCell>
                      <TableCell className="font-semibold">₹{p.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={p.status === 'Paid' ? 'outline' : 'destructive'}
                          className={p.status === 'Paid' ? "bg-green-50 text-green-700 border-green-200" : ""}
                          data-testid={`status-payment-${p.id}`}
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

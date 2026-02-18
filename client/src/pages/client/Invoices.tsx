import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Receipt } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Payment } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/loader";

export default function ClientInvoices() {
  const { user } = useAuth();
  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: [`/api/payments/client/${user?.clientId}`],
    enabled: !!user?.clientId,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  const paidPayments = payments.filter(p => p.status === "Paid");
  const totalInvoiced = paidPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold" data-testid="text-invoices-title">Invoices</h1>
        <p className="text-muted-foreground">View and download your payment receipts and invoices.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Receipt className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-bold" data-testid="text-total-invoices">{paidPayments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invoiced</p>
                <p className="text-2xl font-bold text-green-700" data-testid="text-total-invoiced">₹{totalInvoiced.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Download className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Downloads</p>
                <p className="text-2xl font-bold text-blue-700" data-testid="text-downloads-count">{paidPayments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {paidPayments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground" data-testid="text-empty-invoices">No invoices generated yet. Invoices are created when payments are completed.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paidPayments.map((p) => (
                  <TableRow key={p.id} data-testid={`row-invoice-${p.id}`}>
                    <TableCell className="font-mono text-sm">{p.invoiceId}</TableCell>
                    <TableCell>{p.date}</TableCell>
                    <TableCell>{p.description}</TableCell>
                    <TableCell>{p.method || "-"}</TableCell>
                    <TableCell className="font-semibold">₹{p.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-50 text-green-700 border-green-200" variant="outline" data-testid={`status-invoice-${p.id}`}>
                        Paid
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" data-testid={`button-download-invoice-${p.id}`}>
                        <Download className="h-4 w-4 mr-2" /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

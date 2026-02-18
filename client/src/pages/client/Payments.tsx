import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Payment } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";

export default function ClientPayments() {
  const { user } = useAuth();
  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: [`/api/payments/client/${user?.clientId}`],
    enabled: !!user?.clientId,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64" data-testid="loading-state">Loading...</div>;
  }

  const totalPaid = payments.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
  const totalDue = payments.filter(p => p.status === "Due").reduce((sum, p) => sum + p.amount, 0);
  const nextDue = payments.find(p => p.status === "Due");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold" data-testid="text-payments-title">Payments</h1>
        <p className="text-muted-foreground">Track your investment and download invoices.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         <Card className="bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900">
            <CardContent className="p-6">
               <p className="text-sm font-medium text-green-800 dark:text-green-300">Total Paid</p>
               <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-2" data-testid="text-total-paid">₹{totalPaid.toLocaleString()}</p>
            </CardContent>
         </Card>
         <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900">
            <CardContent className="p-6">
               <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Total Due</p>
               <p className="text-3xl font-bold text-amber-700 dark:text-amber-400 mt-2" data-testid="text-total-due">₹{totalDue.toLocaleString()}</p>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-6 flex items-center justify-between">
               <div>
                   <p className="text-sm font-medium text-muted-foreground">Next Payment Due</p>
                   <p className="text-lg font-bold mt-1" data-testid="text-next-due">{nextDue ? nextDue.date : "None"}</p>
               </div>
               <Button data-testid="button-pay-now">Pay Now</Button>
            </CardContent>
         </Card>
      </div>

      <Card>
         <CardHeader>
            <CardTitle>Transaction History</CardTitle>
         </CardHeader>
         <CardContent>
            {payments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground" data-testid="text-empty-payments">No payments found.</div>
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
                     <TableHead className="text-right">Action</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {payments.map((p) => (
                     <TableRow key={p.id} data-testid={`row-payment-${p.id}`}>
                        <TableCell className="font-medium">{p.invoiceId}</TableCell>
                        <TableCell>{p.date}</TableCell>
                        <TableCell>{p.description}</TableCell>
                        <TableCell>{p.method || "-"}</TableCell>
                        <TableCell>₹{p.amount.toLocaleString()}</TableCell>
                        <TableCell>
                           <Badge variant={p.status === 'Paid' ? 'outline' : 'destructive'} className={p.status === 'Paid' ? "bg-green-50 text-green-700 border-green-200" : ""} data-testid={`status-payment-${p.id}`}>
                              {p.status}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           {p.status === 'Paid' && (
                              <Button variant="ghost" size="sm" data-testid={`button-download-${p.id}`}>
                                 <Download className="h-4 w-4 mr-2" /> Invoice
                              </Button>
                           )}
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
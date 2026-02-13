import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

export default function ClientPayments() {
  const payments = [
    { id: "INV-001", date: "Jan 15, 2024", desc: "Token Amount", amount: 50000, status: "Paid", method: "Bank Transfer" },
    { id: "INV-002", date: "Feb 10, 2024", desc: "Partial Payment (Inventory)", amount: 100000, status: "Paid", method: "UPI" },
    { id: "INV-003", date: "Pending", desc: "Final Settlement", amount: 350000, status: "Due", method: "-" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Payments</h1>
        <p className="text-muted-foreground">Track your investment and download invoices.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         <Card className="bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900">
            <CardContent className="p-6">
               <p className="text-sm font-medium text-green-800 dark:text-green-300">Total Paid</p>
               <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-2">₹1,50,000</p>
            </CardContent>
         </Card>
         <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900">
            <CardContent className="p-6">
               <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Total Due</p>
               <p className="text-3xl font-bold text-amber-700 dark:text-amber-400 mt-2">₹3,50,000</p>
            </CardContent>
         </Card>
         <Card>
            <CardContent className="p-6 flex items-center justify-between">
               <div>
                   <p className="text-sm font-medium text-muted-foreground">Next Payment Due</p>
                   <p className="text-lg font-bold mt-1">Mar 01, 2024</p>
               </div>
               <Button>Pay Now</Button>
            </CardContent>
         </Card>
      </div>

      <Card>
         <CardHeader>
            <CardTitle>Transaction History</CardTitle>
         </CardHeader>
         <CardContent>
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
                     <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.id}</TableCell>
                        <TableCell>{p.date}</TableCell>
                        <TableCell>{p.desc}</TableCell>
                        <TableCell>{p.method}</TableCell>
                        <TableCell>₹{p.amount.toLocaleString()}</TableCell>
                        <TableCell>
                           <Badge variant={p.status === 'Paid' ? 'outline' : 'destructive'} className={p.status === 'Paid' ? "bg-green-50 text-green-700 border-green-200" : ""}>
                              {p.status}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           {p.status === 'Paid' && (
                              <Button variant="ghost" size="sm">
                                 <Download className="h-4 w-4 mr-2" /> Invoice
                              </Button>
                           )}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
    </div>
  );
}

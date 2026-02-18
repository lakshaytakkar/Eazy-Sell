import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingBag, CreditCard, ClipboardList } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { getScoreLabel } from "@shared/schema";
import type { Client, Product, LaunchKitSubmission, Payment } from "@shared/schema";
import { PageLoader } from "@/components/ui/loader";

export default function AdminDashboard() {
  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  const { data: submissions = [] } = useQuery<LaunchKitSubmission[]>({
    queryKey: ["/api/submissions"],
  });
  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const isLoading = clientsLoading;

  if (isLoading) {
    return <PageLoader />;
  }

  const totalClients = clients.length;
  const newInquiryCount = clients.filter(c => ['New Inquiry', 'Qualification Sent'].includes(c.stage)).length;
  const pendingReviews = submissions.filter(s => s.status === 'pending').length;
  const totalPaidAmount = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const totalProducts = products.length;

  const prospectStages = ['Discovery Call', 'Proposal Sent', 'Negotiation'];
  const executionStages = ['Token Paid', 'In Execution'];
  const liveStages = ['Launched'];

  const prospectCount = clients.filter(c => prospectStages.includes(c.stage)).length;
  const executionCount = clients.filter(c => executionStages.includes(c.stage)).length;
  const launchedCount = clients.filter(c => liveStages.includes(c.stage)).length;

  const formatAmount = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val}`;
  };

  const totalClientsForBar = totalClients || 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground" data-testid="text-admin-title">Admin Overview</h1>
        <p className="text-muted-foreground">Welcome back, Admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                <div className="text-3xl font-bold" data-testid="text-total-clients">{totalClients}</div>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Users className="h-5 w-5" />
              </div>
            </div>
             <div className="mt-4 flex gap-2">
                <Badge variant="secondary" className="text-xs" data-testid="badge-leads">{newInquiryCount} New Leads</Badge>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kit Reviews</p>
                <div className="text-3xl font-bold" data-testid="text-pending-reviews">{pendingReviews}</div>
              </div>
              <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                <ClipboardList className="h-5 w-5" />
              </div>
            </div>
             <div className="mt-4 flex gap-2">
                {pendingReviews > 0 && <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">Action Needed</Badge>}
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
             <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payments</p>
                <div className="text-3xl font-bold" data-testid="text-total-payments">{formatAmount(totalPaidAmount)}</div>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
             <div className="mt-4 flex gap-2">
                <p className="text-xs text-muted-foreground">Total collected</p>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
             <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Products</p>
                <div className="text-3xl font-bold" data-testid="text-total-products">{totalProducts}</div>
              </div>
              <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary-foreground">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
             <div className="mt-4 flex gap-2">
                <Badge variant="secondary" className="text-xs">In catalog</Badge>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
            <CardDescription>Latest clients in the pipeline</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {clients.slice(0, 5).map((client) => {
                    const scoreInfo = getScoreLabel(client.totalScore);
                    return (
                    <Link key={client.id} href={`/admin/clients/${client.id}`}>
                    <div className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0 cursor-pointer hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors" data-testid={`row-recent-client-${client.id}`}>
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                            {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                             <p className="text-sm font-medium truncate">{client.name}</p>
                             <p className="text-xs text-muted-foreground">{client.city} • {client.stage}</p>
                        </div>
                        {(client.totalScore ?? 0) > 0 && (
                          <Badge variant="outline" className={`text-[10px] px-1.5 ${scoreInfo.color} shrink-0`}>
                            {scoreInfo.emoji} {scoreInfo.label}
                          </Badge>
                        )}
                    </div>
                    </Link>
                    );
                })}
                {clients.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No clients yet.</p>
                )}
             </div>
          </CardContent>
        </Card>

        <Card className="h-full">
            <CardHeader>
                <CardTitle>Pipeline Status</CardTitle>
                <CardDescription>Clients by stage</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                     <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>New Leads</span>
                            <span className="font-bold" data-testid="text-pipeline-leads">{newInquiryCount}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${(newInquiryCount / totalClientsForBar) * 100}%` }}></div>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>In Discussion</span>
                            <span className="font-bold" data-testid="text-pipeline-prospects">{prospectCount}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${(prospectCount / totalClientsForBar) * 100}%` }}></div>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>In Execution</span>
                            <span className="font-bold" data-testid="text-pipeline-execution">{executionCount}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: `${(executionCount / totalClientsForBar) * 100}%` }}></div>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>Launched</span>
                            <span className="font-bold" data-testid="text-pipeline-launched">{launchedCount}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${(launchedCount / totalClientsForBar) * 100}%` }}></div>
                        </div>
                     </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
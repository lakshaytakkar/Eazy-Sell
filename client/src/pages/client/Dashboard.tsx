import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, ChevronRight, Clock, MapPin, Package, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PIPELINE_STAGES } from "@shared/schema";
import type { Client } from "@shared/schema";

export default function ClientDashboard() {
  const { data: client, isLoading } = useQuery<Client>({
    queryKey: ["/api/clients/1"],
  });

  if (isLoading || !client) {
    return <div className="flex items-center justify-center h-64" data-testid="loading-state">Loading...</div>;
  }

  const stages = PIPELINE_STAGES.filter(s => s !== 'Lost');
  const currentStageIndex = stages.indexOf(client.stage as any);
  const progress = currentStageIndex >= 0 ? ((currentStageIndex + 1) / stages.length) * 100 : 10;

  const totalPaid = client.totalPaid ?? 0;
  const totalDue = client.totalDue ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground" data-testid="text-dashboard-title">My Store Dashboard</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4" /> <span data-testid="text-client-city">{client.city}</span> Store • <span className="text-primary font-medium" data-testid="text-client-stage">{client.stage}</span>
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white" data-testid="button-contact-manager">
          <Phone className="h-4 w-4 mr-2" /> Contact Manager
        </Button>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Launch Progress</CardTitle>
          <CardDescription>You are on track for opening in 20 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium mb-1">
              <span>Stage {currentStageIndex + 1} of {stages.length}</span>
              <span data-testid="text-progress-percent">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Token Paid</span>
              <span className="font-semibold text-primary">Current: {client.stage}</span>
              <span>Launch</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {client.nextAction && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4 flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">Action Required</h3>
            <p className="text-amber-800 dark:text-amber-200 text-sm mt-1" data-testid="text-next-action">{client.nextAction}</p>
            <Button size="sm" variant="outline" className="mt-3 border-amber-300 hover:bg-amber-100 dark:border-amber-800 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-100" data-testid="button-complete-now">
              Complete Now <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-paid">₹{totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">of ₹{(totalPaid + totalDue).toLocaleString()} total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 Units</div>
            <p className="text-xs text-muted-foreground mt-1">Launch Kit pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assigned Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold" data-testid="text-manager-name">{client.managerName || "Not assigned"}</div>
            <p className="text-xs text-muted-foreground mt-1" data-testid="text-manager-phone">{client.managerPhone || "-"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                <div>
                  <p className="font-medium text-sm">Approve 3D Design</p>
                  <p className="text-xs text-muted-foreground">Review the layout shared by the design team.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-60">
                <div className="h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                <div>
                  <p className="font-medium text-sm">Finalize Launch Kit</p>
                  <p className="text-xs text-muted-foreground">Select your opening inventory mix.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-60">
                <div className="h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                <div>
                  <p className="font-medium text-sm">Release Partial Payment</p>
                  <p className="text-xs text-muted-foreground">50% payment to start production.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="relative border-l border-muted ml-2 space-y-6 pb-2">
                <div className="pl-6 relative">
                  <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background"></div>
                  <p className="text-xs text-muted-foreground mb-0.5">Feb 15, 2024</p>
                  <p className="text-sm font-medium">3D Design Shared</p>
                </div>
                <div className="pl-6 relative">
                  <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary/40 border-2 border-background"></div>
                  <p className="text-xs text-muted-foreground mb-0.5">Feb 10, 2024</p>
                  <p className="text-sm font-medium">Location Approved</p>
                </div>
                <div className="pl-6 relative">
                  <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary/40 border-2 border-background"></div>
                  <p className="text-xs text-muted-foreground mb-0.5">Feb 01, 2024</p>
                  <p className="text-sm font-medium">Token Amount Received</p>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
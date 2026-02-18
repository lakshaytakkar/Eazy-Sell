import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, ChevronRight, Clock, MapPin, Package, Phone, Store, ShoppingCart, FileText, CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PIPELINE_STAGES } from "@shared/schema";
import type { Client, LaunchKitItem } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/loader";
import { Link } from "wouter";

function getDaysRemaining(estimatedLaunchDate: string | null): string {
  if (!estimatedLaunchDate) return "TBD";
  const days = Math.ceil((new Date(estimatedLaunchDate).getTime() - new Date().getTime()) / 86400000);
  if (days < 0) return "Launched";
  if (days === 0) return "Today";
  return `${days} days`;
}

function getNextSteps(client: Client, kitItemCount: number): { title: string; description: string; active: boolean }[] {
  const steps: { title: string; description: string; active: boolean }[] = [];

  if (!client.profileCompleted) {
    steps.push({ title: "Complete your store profile", description: "Fill in your store details and preferences.", active: true });
  }

  if (client.stage === "Token Paid" || client.stage === "In Execution") {
    if (kitItemCount === 0) {
      steps.push({ title: "Select your launch inventory", description: "Browse the catalog and build your launch kit.", active: steps.length === 0 });
    }
    if (client.stage === "Token Paid") {
      steps.push({ title: "Approve 3D store design", description: "Review the layout shared by the design team.", active: steps.length === 0 });
      steps.push({ title: "Release partial payment", description: "50% payment to start production.", active: false });
    }
    if (client.stage === "In Execution") {
      steps.push({ title: "Track your order shipments", description: "Monitor delivery status for your inventory.", active: steps.length === 0 });
      steps.push({ title: "Complete readiness checklist", description: "Ensure your store is ready for launch.", active: false });
    }
  } else {
    if (kitItemCount === 0) {
      steps.push({ title: "Select your launch inventory", description: "Browse the catalog and build your launch kit.", active: steps.length === 0 });
    }
    steps.push({ title: "Review your program scope", description: "Understand the services included in your package.", active: steps.length === 0 });
    steps.push({ title: "Connect with your manager", description: "Reach out via WhatsApp for any questions.", active: false });
  }

  return steps.slice(0, 3);
}

function getTimelineEvents(client: Client): { date: string; label: string; completed: boolean }[] {
  const stages = PIPELINE_STAGES.filter(s => s !== 'Lost');
  const currentIdx = stages.indexOf(client.stage as any);
  const events: { date: string; label: string; completed: boolean }[] = [];

  if (client.createdAt) {
    events.push({ date: new Date(client.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), label: "Onboarding started", completed: true });
  }

  if (currentIdx >= stages.indexOf("Token Paid")) {
    events.push({ date: "", label: "Token amount received", completed: true });
  }

  if (currentIdx >= stages.indexOf("In Execution")) {
    events.push({ date: "", label: "Execution phase started", completed: true });
  }

  if (client.stage === "Launched" && client.actualLaunchDate) {
    events.push({ date: new Date(client.actualLaunchDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), label: "Store launched", completed: true });
  } else if (client.estimatedLaunchDate) {
    events.push({ date: new Date(client.estimatedLaunchDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), label: "Estimated launch", completed: false });
  }

  return events;
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const { data: client, isLoading } = useQuery<Client>({
    queryKey: ['/api/clients', user?.clientId],
    enabled: !!user?.clientId,
  });

  const { data: kitItems } = useQuery<LaunchKitItem[]>({
    queryKey: ['/api/kit-items', user?.clientId],
    enabled: !!user?.clientId,
  });

  if (isLoading || !client) {
    return <PageLoader />;
  }

  const stages = PIPELINE_STAGES.filter(s => s !== 'Lost');
  const currentStageIndex = stages.indexOf(client.stage as any);
  const progress = currentStageIndex >= 0 ? ((currentStageIndex + 1) / stages.length) * 100 : 10;

  const totalPaid = client.totalPaid ?? 0;
  const totalDue = client.totalDue ?? 0;

  const kitItemCount = kitItems?.length ?? 0;
  const totalUnits = kitItems?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0;

  const daysRemaining = getDaysRemaining(client.estimatedLaunchDate);
  const nextSteps = getNextSteps(client, kitItemCount);
  const timelineEvents = getTimelineEvents(client);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground" data-testid="text-dashboard-title">My Store Dashboard</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4" /> <span data-testid="text-client-city">{client.city}</span> Store {" "} <span className="text-primary font-medium" data-testid="text-client-stage">{client.stage}</span>
          </p>
        </div>
        <a href="https://wa.me/919306566900" target="_blank" rel="noopener noreferrer">
          <Button className="bg-green-600 text-white" data-testid="button-contact-manager">
            <Phone className="h-4 w-4 mr-2" /> Contact Manager
          </Button>
        </a>
      </div>

      {!client.profileCompleted && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold" data-testid="text-onboarding-cta">Complete Your Store Profile</h3>
                </div>
                <p className="text-sm text-muted-foreground">Finish setting up your store details to unlock all features.</p>
                <div className="flex items-center gap-3 mt-2">
                  <Progress value={(client.onboardingStep / 5) * 100} className="h-2 flex-1 max-w-[200px]" />
                  <span className="text-xs text-muted-foreground font-medium" data-testid="text-onboarding-progress">{client.onboardingStep}/5 steps</span>
                </div>
              </div>
              <Link href="/client/onboarding">
                <Button data-testid="button-complete-profile">
                  Continue Setup <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Launch Progress</CardTitle>
          <CardDescription data-testid="text-launch-countdown">
            {daysRemaining === "TBD"
              ? "Launch date to be determined."
              : daysRemaining === "Launched"
                ? "Your store has launched!"
                : daysRemaining === "Today"
                  ? "Your store opens today!"
                  : `You are on track for opening in ${daysRemaining}.`}
          </CardDescription>
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
            <Button size="sm" variant="outline" className="mt-3 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100" data-testid="button-complete-now">
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
            <div className="text-2xl font-bold" data-testid="text-total-paid">{"\u20B9"}{totalPaid.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">of {"\u20B9"}{(totalPaid + totalDue).toLocaleString('en-IN')} total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-inventory-units">{totalUnits} Units</div>
            <p className="text-xs text-muted-foreground mt-1" data-testid="text-inventory-items">
              {kitItemCount > 0 ? `${kitItemCount} products in launch kit` : "Launch Kit pending"}
            </p>
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
              {nextSteps.map((step, idx) => (
                <div key={idx} className={`flex items-start gap-3 ${!step.active ? "opacity-60" : ""}`}>
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${step.active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm" data-testid={`text-next-step-${idx}`}>{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="relative border-l border-muted ml-2 space-y-6 pb-2">
                {timelineEvents.map((event, idx) => (
                  <div key={idx} className="pl-6 relative">
                    <div className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background ${event.completed ? "bg-primary" : "bg-primary/40"}`} />
                    {event.date && <p className="text-xs text-muted-foreground mb-0.5">{event.date}</p>}
                    <p className="text-sm font-medium" data-testid={`text-timeline-${idx}`}>{event.label}</p>
                  </div>
                ))}
                {timelineEvents.length === 0 && (
                  <p className="pl-6 text-sm text-muted-foreground">No timeline events yet.</p>
                )}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

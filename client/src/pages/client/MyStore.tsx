import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Building, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PIPELINE_STAGES } from "@shared/schema";
import type { Client } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";

export default function MyStore() {
  const { user } = useAuth();
  const { data: client, isLoading } = useQuery<Client>({
    queryKey: [`/api/clients/${user?.clientId}`],
    enabled: !!user?.clientId,
  });

  if (isLoading || !client) {
    return <div className="flex items-center justify-center h-64" data-testid="loading-state">Loading...</div>;
  }

  const stages = PIPELINE_STAGES.filter(s => s !== 'Lost');
  const currentStageIndex = stages.indexOf(client.stage as any);

  const steps = [
    { title: "Discovery & Qualification", date: currentStageIndex >= 2 ? "Completed" : "Pending", status: currentStageIndex >= 2 ? "completed" : currentStageIndex <= 1 ? "current" : "pending", desc: "Understanding your requirements and location." },
    { title: "Proposal & Agreement", date: currentStageIndex >= 4 ? "Completed" : "Pending", status: currentStageIndex >= 4 ? "completed" : (currentStageIndex >= 2 && currentStageIndex < 4) ? "current" : "pending", desc: "Package selection and negotiation." },
    { title: "Token Payment", date: currentStageIndex >= 5 ? "Completed" : "Pending", status: currentStageIndex >= 5 ? "completed" : currentStageIndex === 4 ? "current" : "pending", desc: "Initial commitment amount to secure launch slot." },
    { title: "Store Execution", date: currentStageIndex >= 6 ? "Completed" : "Pending", status: currentStageIndex >= 6 ? "completed" : currentStageIndex === 5 ? "current" : "pending", desc: "Interior setup, inventory procurement and placement." },
    { title: "Grand Opening", date: currentStageIndex >= 7 ? "Completed" : "Target: TBD", status: currentStageIndex >= 7 ? "completed" : currentStageIndex === 6 ? "current" : "pending", desc: "Store launch event and go-live." },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold" data-testid="text-store-title">My Store</h1>
        <p className="text-muted-foreground">Manage your location and track launch milestones.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-6">
           <Card>
              <CardHeader>
                 <CardTitle>Store Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
                        <Building className="h-10 w-10 opacity-20" />
                    </div>
                    <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600" data-testid="badge-store-status">{client.stage}</Badge>
                 </div>
                 
                 <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <p className="font-medium" data-testid="text-store-name">{client.name} - {client.city} Store</p>
                            <p className="text-sm text-muted-foreground" data-testid="text-store-address">{client.storeAddress || "Address not set"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <p className="text-sm" data-testid="text-store-phone">{client.phone || "Phone not set"}</p>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card>
              <CardHeader>
                 <CardTitle>Design Status</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 text-center">
                    <p className="text-sm font-medium text-foreground mb-2" data-testid="text-design-status">
                      {currentStageIndex >= 6 ? "Store Layout Completed" : currentStageIndex >= 5 ? "Store Layout in Progress" : "Awaiting Previous Steps"}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                        {client.storeArea 
                          ? `Our architects are designing the optimal layout for your ${client.storeArea} sq ft space.`
                          : "Store area not specified yet."}
                    </p>
                    <Button size="sm" variant="outline" className="bg-background" data-testid="button-view-drafts">View Drafts</Button>
                 </div>
              </CardContent>
           </Card>
        </div>

        <div className="md:col-span-2">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Launch Roadmap</CardTitle>
                    <CardDescription>Track your journey from signup to grand opening.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative border-l-2 border-muted ml-4 space-y-8 pb-4">
                        {steps.map((step, idx) => (
                            <div key={idx} className="pl-8 relative" data-testid={`step-${idx}`}>
                                <div className={`
                                    absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 
                                    ${step.status === 'completed' ? 'bg-primary border-primary' : 
                                      step.status === 'current' ? 'bg-background border-primary ring-4 ring-primary/20' : 
                                      'bg-muted border-muted-foreground'}
                                `}>
                                    {step.status === 'completed' && <CheckCircle2 className="h-3 w-3 text-white" />}
                                </div>
                                
                                <div className={`${step.status === 'pending' ? 'opacity-50' : ''}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                                        <h3 className="font-semibold text-lg">{step.title}</h3>
                                        <span className="text-sm text-muted-foreground font-medium">{step.date}</span>
                                    </div>
                                    <p className="text-muted-foreground">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
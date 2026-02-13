import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Building, CheckCircle2 } from "lucide-react";

export default function MyStore() {
  const steps = [
    { title: "Token Payment", date: "Jan 15, 2024", status: "completed", desc: "Initial commitment amount received." },
    { title: "Location Finalization", date: "Feb 01, 2024", status: "completed", desc: "Store location approved by admin." },
    { title: "3D Design & Layout", date: "Feb 10, 2024", status: "current", desc: "Architectural drawings in progress." },
    { title: "Inventory Selection", date: "Pending", status: "pending", desc: "Finalize your Launch Kit." },
    { title: "Production & Shipping", date: "Pending", status: "pending", desc: "Materials dispatched to site." },
    { title: "Grand Opening", date: "Target: Mar 15", status: "pending", desc: "Store launch event." },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">My Store</h1>
        <p className="text-muted-foreground">Manage your location and track launch milestones.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Store Details */}
        <div className="space-y-6">
           <Card>
              <CardHeader>
                 <CardTitle>Store Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                    {/* Placeholder for Map/Store Image */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
                        <Building className="h-10 w-10 opacity-20" />
                    </div>
                    <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">Location Approved</Badge>
                 </div>
                 
                 <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <p className="font-medium">Jaipur Main Branch</p>
                            <p className="text-sm text-muted-foreground">Plot 45, Raja Park, Jaipur, Rajasthan</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <p className="text-sm">+91 98765 43210</p>
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
                    <p className="text-sm font-medium text-foreground mb-2">3D Layout in Progress</p>
                    <p className="text-xs text-muted-foreground mb-4">
                        Our architects are designing the optimal layout for your 300 sq ft space.
                    </p>
                    <Button size="sm" variant="outline" className="bg-background">View Drafts</Button>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Right Column: Timeline */}
        <div className="md:col-span-2">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Launch Roadmap</CardTitle>
                    <CardDescription>Track your journey from signup to grand opening.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative border-l-2 border-muted ml-4 space-y-8 pb-4">
                        {steps.map((step, idx) => (
                            <div key={idx} className="pl-8 relative">
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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingBag, CreditCard, ClipboardList } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Admin Overview</h1>
        <p className="text-muted-foreground">Welcome back, Admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                <div className="text-3xl font-bold">12</div>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Users className="h-5 w-5" />
              </div>
            </div>
             <div className="mt-4 flex gap-2">
                <Badge variant="secondary" className="text-xs">3 Active Leads</Badge>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kit Reviews</p>
                <div className="text-3xl font-bold">4</div>
              </div>
              <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                <ClipboardList className="h-5 w-5" />
              </div>
            </div>
             <div className="mt-4 flex gap-2">
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">Action Needed</Badge>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
             <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payments</p>
                <div className="text-3xl font-bold">₹4.5L</div>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
             <div className="mt-4 flex gap-2">
                <p className="text-xs text-muted-foreground">Collected this month</p>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
             <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Products</p>
                <div className="text-3xl font-bold">256</div>
              </div>
              <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary-foreground">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
             <div className="mt-4 flex gap-2">
                <Badge variant="secondary" className="text-xs">12 Low Stock</Badge>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across the platform</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {[1,2,3,4].map((i) => (
                    <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                            {['RS', 'PP', 'VS', 'NK'][i-1]}
                        </div>
                        <div className="flex-1">
                             <p className="text-sm font-medium">
                                {['Rahul Sharma submitted Launch Kit', 'Priya Patel paid token amount', 'Vikram Singh approved location', 'New lead registered'][i-1]}
                             </p>
                             <p className="text-xs text-muted-foreground">
                                {['2 hours ago', '5 hours ago', '1 day ago', '2 days ago'][i-1]}
                             </p>
                        </div>
                    </div>
                ))}
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
                            <span>Leads</span>
                            <span className="font-bold">5</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[40%]"></div>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>Onboarding</span>
                            <span className="font-bold">3</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[25%]"></div>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>Production</span>
                            <span className="font-bold">2</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 w-[15%]"></div>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>Launched</span>
                            <span className="font-bold">2</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[15%]"></div>
                        </div>
                     </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

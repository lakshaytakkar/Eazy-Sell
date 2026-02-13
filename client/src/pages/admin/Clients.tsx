import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CLIENTS, Client, STAGES } from "@/lib/mockData";
import { MoreHorizontal, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminClients() {
  
  // Group clients by stage
  const columns = [
    { id: 'leads', title: 'New Leads', stages: ['Lead'] },
    { id: 'onboarding', title: 'Onboarding', stages: ['Token Paid', 'Location Shared', 'Location Approved'] },
    { id: 'design', title: 'Design & Setup', stages: ['3D Design', 'Payment Partial'] },
    { id: 'production', title: 'Production', stages: ['In Production', 'Shipped'] },
    { id: 'live', title: 'Live Stores', stages: ['Setup', 'Launched', 'Active'] },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-3xl font-display font-bold text-foreground">Client Pipeline</h1>
           <p className="text-muted-foreground">Manage client store launches.</p>
        </div>
        <div className="flex gap-2">
            <div className="relative w-64">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Search clients..." className="pl-9 bg-background" />
            </div>
            <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Client</Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex h-full gap-4 min-w-[1200px]">
          {columns.map(column => (
            <div key={column.id} className="w-80 flex-shrink-0 flex flex-col bg-muted/30 rounded-lg border border-muted">
              <div className="p-3 font-semibold text-sm flex items-center justify-between border-b bg-muted/20">
                {column.title}
                <Badge variant="secondary" className="bg-background text-foreground shadow-sm">
                   {CLIENTS.filter(c => column.stages.includes(c.stage)).length}
                </Badge>
              </div>
              
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  {CLIENTS.filter(c => column.stages.includes(c.stage)).map(client => (
                    <Card key={client.id} className="cursor-move hover:shadow-md transition-shadow">
                      <CardContent className="p-3 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                             <Avatar className="h-6 w-6 text-[10px]">
                                <AvatarFallback>{client.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                             </Avatar>
                             <span className="font-medium text-sm">{client.name}</span>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2">
                             <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>City</span>
                                <span className="text-foreground">{client.city}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Due</span>
                                <span className="font-medium text-destructive">₹{client.totalDue.toLocaleString()}</span>
                            </div>
                        </div>

                        <Badge variant="outline" className="w-full justify-center text-[10px] font-normal py-0.5 h-auto">
                           {client.stage}
                        </Badge>
                        
                        <div className="text-[10px] text-muted-foreground pt-2 border-t mt-2">
                           Next: {client.nextAction}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {CLIENTS.filter(c => column.stages.includes(c.stage)).length === 0 && (
                     <div className="h-24 flex items-center justify-center text-xs text-muted-foreground border-2 border-dashed border-muted rounded-lg opacity-50">
                        No clients
                     </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import type { Client } from "@shared/schema";

export default function AdminClients() {
  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const columns = [
    { id: 'leads', title: 'New Leads', stages: ['Lead'] },
    { id: 'onboarding', title: 'Onboarding', stages: ['Token Paid', 'Location Shared', 'Location Approved'] },
    { id: 'design', title: 'Design & Setup', stages: ['3D Design', 'Payment Partial'] },
    { id: 'production', title: 'Production', stages: ['In Production', 'Shipped'] },
    { id: 'live', title: 'Live Stores', stages: ['Setup', 'Launched', 'Active'] },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-64" data-testid="loading-state">Loading...</div>;
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-3xl font-display font-bold text-foreground" data-testid="text-clients-title">Client Pipeline</h1>
           <p className="text-muted-foreground">Manage client store launches.</p>
        </div>
        <div className="flex gap-2">
            <div className="relative w-64">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Search clients..." className="pl-9 bg-background" data-testid="input-search-clients" />
            </div>
            <Button variant="outline" data-testid="button-filter"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
            <Button data-testid="button-add-client"><Plus className="h-4 w-4 mr-2" /> Add Client</Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex h-full gap-4 min-w-[1200px]">
          {columns.map(column => {
            const columnClients = clients.filter(c => column.stages.includes(c.stage));
            return (
            <div key={column.id} className="w-80 flex-shrink-0 flex flex-col bg-muted/30 rounded-lg border border-muted" data-testid={`column-${column.id}`}>
              <div className="p-3 font-semibold text-sm flex items-center justify-between border-b bg-muted/20">
                {column.title}
                <Badge variant="secondary" className="bg-background text-foreground shadow-sm" data-testid={`badge-count-${column.id}`}>
                   {columnClients.length}
                </Badge>
              </div>
              
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  {columnClients.map(client => (
                    <Card key={client.id} className="cursor-move hover:shadow-md transition-shadow" data-testid={`card-client-${client.id}`}>
                      <CardContent className="p-3 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                             <Avatar className="h-6 w-6 text-[10px]">
                                <AvatarFallback>{client.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                             </Avatar>
                             <span className="font-medium text-sm" data-testid={`text-client-name-${client.id}`}>{client.name}</span>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2" data-testid={`button-more-${client.id}`}>
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
                                <span className="font-medium text-destructive">₹{(client.totalDue ?? 0).toLocaleString()}</span>
                            </div>
                        </div>

                        <Badge variant="outline" className="w-full justify-center text-[10px] font-normal py-0.5 h-auto" data-testid={`badge-stage-${client.id}`}>
                           {client.stage}
                        </Badge>
                        
                        {client.nextAction && (
                        <div className="text-[10px] text-muted-foreground pt-2 border-t mt-2">
                           Next: {client.nextAction}
                        </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  
                  {columnClients.length === 0 && (
                     <div className="h-24 flex items-center justify-center text-xs text-muted-foreground border-2 border-dashed border-muted rounded-lg opacity-50">
                        No clients
                     </div>
                  )}
                </div>
              </ScrollArea>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Filter, MapPin, Phone, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import type { Client } from "@shared/schema";

const columnColors: Record<string, string> = {
  leads: "bg-slate-500",
  onboarding: "bg-blue-500",
  design: "bg-violet-500",
  production: "bg-orange-500",
  live: "bg-green-500",
};

function formatAmount(val: number | null | undefined) {
  if (!val) return "₹0";
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
}

export default function AdminClients() {
  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });
  const [search, setSearch] = useState("");

  const columns = [
    { id: "leads", title: "New Leads", stages: ["Lead"] },
    { id: "onboarding", title: "Onboarding", stages: ["Token Paid", "Location Shared", "Location Approved"] },
    { id: "design", title: "Design & Setup", stages: ["3D Design", "Payment Partial"] },
    { id: "production", title: "Production", stages: ["In Production", "Shipped"] },
    { id: "live", title: "Live Stores", stages: ["Setup", "Launched", "Active"] },
  ];

  const filtered = search
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.city.toLowerCase().includes(search.toLowerCase())
      )
    : clients;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="loading-state">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground" data-testid="text-clients-title">
            Client Pipeline
          </h1>
          <p className="text-muted-foreground">
            {filtered.length} clients across {columns.length} stages
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-clients"
            />
          </div>
          <Button variant="outline" data-testid="button-filter">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button data-testid="button-add-client">
            <Plus className="h-4 w-4 mr-2" /> Add Client
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex h-full gap-4 min-w-[1200px]">
          {columns.map((column) => {
            const columnClients = filtered.filter((c) =>
              column.stages.includes(c.stage)
            );
            return (
              <div
                key={column.id}
                className="w-80 flex-shrink-0 flex flex-col bg-muted/30 rounded-2xl border"
                data-testid={`column-${column.id}`}
              >
                <div className="p-3 font-semibold text-sm flex items-center justify-between border-b bg-muted/20 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${columnColors[column.id]}`} />
                    {column.title}
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-background text-foreground shadow-sm"
                    data-testid={`badge-count-${column.id}`}
                  >
                    {columnClients.length}
                  </Badge>
                </div>

                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-3">
                    {columnClients.map((client) => (
                      <Link key={client.id} href={`/admin/clients/${client.id}`}>
                        <Card
                          className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group border-l-4 border-l-transparent hover:border-l-primary"
                          data-testid={`card-client-${client.id}`}
                        >
                          <CardContent className="p-3 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2.5">
                                <Avatar className="h-8 w-8 text-xs border border-muted">
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {client.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <span
                                    className="font-semibold text-sm block truncate group-hover:text-primary transition-colors"
                                    data-testid={`text-client-name-${client.id}`}
                                  >
                                    {client.name}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {client.city}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              {client.phone && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  <span className="truncate">{client.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <IndianRupee className="h-3 w-3" /> Paid
                                </span>
                                <span className="font-semibold text-green-600">
                                  {formatAmount(client.totalPaid)}
                                </span>
                              </div>
                            </div>

                            <Badge
                              variant="outline"
                              className="w-full justify-center text-[10px] font-normal py-0.5 h-auto"
                              data-testid={`badge-stage-${client.id}`}
                            >
                              {client.stage}
                            </Badge>
                          </CardContent>
                        </Card>
                      </Link>
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

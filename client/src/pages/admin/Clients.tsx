import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/utils";
import { Plus, Search, Filter, MapPin, Phone, IndianRupee, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useState, useCallback } from "react";
import type { Client } from "@shared/schema";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";

const columnColors: Record<string, string> = {
  leads: "bg-slate-500",
  onboarding: "bg-blue-500",
  design: "bg-violet-500",
  production: "bg-orange-500",
  live: "bg-green-500",
};

const columnBorderColors: Record<string, string> = {
  leads: "border-slate-400",
  onboarding: "border-blue-400",
  design: "border-violet-400",
  production: "border-orange-400",
  live: "border-green-400",
};

function formatAmount(val: number | null | undefined) {
  if (!val) return "₹0";
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
}

const columns = [
  { id: "leads", title: "New Leads", stages: ["Lead"], defaultStage: "Lead" },
  { id: "onboarding", title: "Onboarding", stages: ["Token Paid", "Location Shared", "Location Approved"], defaultStage: "Token Paid" },
  { id: "design", title: "Design & Setup", stages: ["3D Design", "Payment Partial"], defaultStage: "3D Design" },
  { id: "production", title: "Production", stages: ["In Production", "Shipped"], defaultStage: "In Production" },
  { id: "live", title: "Live Stores", stages: ["Setup", "Launched", "Active"], defaultStage: "Active" },
];

function getColumnForStage(stage: string): string | null {
  for (const col of columns) {
    if (col.stages.includes(stage)) return col.id;
  }
  return null;
}

function DraggableClientCard({ client, isDragOverlay }: { client: Client; isDragOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `client-${client.id}`,
    data: { client },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  if (isDragOverlay) {
    return (
      <Card
        className="w-72 shadow-xl border-primary/40 border-l-4 border-l-primary rotate-[2deg] scale-105 bg-card"
        data-testid={`card-client-${client.id}`}
      >
        <ClientCardContent client={client} />
      </Card>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "opacity-30 scale-95" : ""} transition-opacity`}
    >
      <Card
        className={`group border-l-4 border-l-transparent hover:border-l-primary hover:shadow-md transition-all ${
          isDragging ? "border-dashed border-muted" : "cursor-grab active:cursor-grabbing"
        }`}
        data-testid={`card-client-${client.id}`}
      >
        <div className="flex">
          <div
            {...attributes}
            {...listeners}
            className="flex items-center px-1.5 text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing shrink-0"
            data-testid={`drag-handle-${client.id}`}
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <Link href={`/admin/clients/${client.id}`} className="flex-1 min-w-0">
            <ClientCardContent client={client} />
          </Link>
        </div>
      </Card>
    </div>
  );
}

function ClientCardContent({ client }: { client: Client }) {
  return (
    <CardContent className="p-3 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 text-xs border border-muted">
            <AvatarImage src={getAvatarUrl(client.name, 64)} alt={client.name} />
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
  );
}

function DroppableColumn({
  column,
  clients,
  isOver,
}: {
  column: (typeof columns)[number];
  clients: Client[];
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { column },
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-80 flex-shrink-0 flex flex-col rounded-2xl border transition-all duration-200 ${
        isOver
          ? `bg-primary/5 border-primary/30 shadow-lg ${columnBorderColors[column.id]}`
          : "bg-muted/30"
      }`}
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
          {clients.length}
        </Badge>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-3 min-h-[80px]">
          {clients.map((client) => (
            <DraggableClientCard key={client.id} client={client} />
          ))}

          {clients.length === 0 && (
            <div
              className={`h-24 flex items-center justify-center text-xs text-muted-foreground border-2 border-dashed rounded-lg transition-colors ${
                isOver ? "border-primary/40 bg-primary/5 text-primary" : "border-muted opacity-50"
              }`}
            >
              {isOver ? "Drop here" : "No clients"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminClients() {
  const queryClient = useQueryClient();
  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });
  const [search, setSearch] = useState("");
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const updateStageMutation = useMutation({
    mutationFn: async ({ clientId, stage }: { clientId: number; stage: string }) => {
      const res = await apiRequest("PATCH", `/api/clients/${clientId}`, { stage });
      return res.json();
    },
    onSuccess: (data: Client) => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Client moved",
        description: `${data.name} moved to "${data.stage}"`,
      });
    },
    onError: () => {
      toast({ title: "Failed to move client", variant: "destructive" });
    },
  });

  const filtered = search
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.city.toLowerCase().includes(search.toLowerCase())
      )
    : clients;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const client = event.active.data.current?.client as Client | undefined;
    if (client) setActiveClient(client);
  }, []);

  const resolveColumnId = useCallback(
    (overId: string | number | undefined): string | null => {
      if (!overId) return null;
      const id = String(overId);
      if (columns.find((c) => c.id === id)) return id;
      if (id.startsWith("client-")) {
        const cid = Number(id.replace("client-", ""));
        const overClient = filtered.find((c) => c.id === cid);
        if (overClient) return getColumnForStage(overClient.stage);
      }
      return null;
    },
    [filtered]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const colId = resolveColumnId(event.over?.id);
      setOverColumnId(colId);
    },
    [resolveColumnId]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveClient(null);
      setOverColumnId(null);

      const { active, over } = event;
      if (!over) return;

      const draggedClient = active.data.current?.client as Client | undefined;
      if (!draggedClient) return;

      const targetColumnId = resolveColumnId(over.id);
      if (!targetColumnId) return;

      const targetColumn = columns.find((c) => c.id === targetColumnId);
      if (!targetColumn) return;

      const currentColumnId = getColumnForStage(draggedClient.stage);
      if (currentColumnId === targetColumnId) return;

      updateStageMutation.mutate({
        clientId: draggedClient.id,
        stage: targetColumn.defaultStage,
      });
    },
    [updateStageMutation, resolveColumnId]
  );

  const handleDragCancel = useCallback(() => {
    setActiveClient(null);
    setOverColumnId(null);
  }, []);

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
            <span className="text-xs ml-2 text-muted-foreground/60">
              — drag cards to move between stages
            </span>
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <div className="flex h-full gap-4 min-w-[1200px]">
            {columns.map((column) => {
              const columnClients = filtered.filter((c) =>
                column.stages.includes(c.stage)
              );
              return (
                <DroppableColumn
                  key={column.id}
                  column={column}
                  clients={columnClients}
                  isOver={overColumnId === column.id}
                />
              );
            })}
          </div>
        </div>

        <DragOverlay dropAnimation={{
          duration: 200,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}>
          {activeClient ? (
            <DraggableClientCard client={activeClient} isDragOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

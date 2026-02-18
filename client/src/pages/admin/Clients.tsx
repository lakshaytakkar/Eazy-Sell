import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/utils";
import { Plus, Search, MapPin, Phone, IndianRupee, GripVertical, CalendarClock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useState, useCallback } from "react";
import type { Client } from "@shared/schema";
import { PIPELINE_STAGES, getScoreLabel } from "@shared/schema";
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
import { PageLoader } from "@/components/ui/loader";

const columns = [
  { id: "pipeline", title: "Pipeline", stages: ["New Inquiry", "Qualification Sent", "Discovery Call"], defaultStage: "New Inquiry" },
  { id: "proposal", title: "Proposal", stages: ["Proposal Sent", "Negotiation"], defaultStage: "Proposal Sent" },
  { id: "execution", title: "Execution", stages: ["Token Paid", "In Execution"], defaultStage: "Token Paid" },
  { id: "live", title: "Live", stages: ["Launched"], defaultStage: "Launched" },
  { id: "lost", title: "Lost", stages: ["Lost"], defaultStage: "Lost" },
];

const columnColors: Record<string, string> = {
  pipeline: "bg-blue-500",
  proposal: "bg-violet-500",
  execution: "bg-orange-500",
  live: "bg-green-500",
  lost: "bg-slate-500",
};

const columnBorderColors: Record<string, string> = {
  pipeline: "border-blue-400",
  proposal: "border-violet-400",
  execution: "border-orange-400",
  live: "border-green-400",
  lost: "border-slate-400",
};

function formatAmount(val: number | null | undefined) {
  if (!val) return "₹0";
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
}

function getColumnForStage(stage: string): string | null {
  for (const col of columns) {
    if (col.stages.includes(stage)) return col.id;
  }
  return null;
}

const packageColors: Record<string, string> = {
  Lite: "bg-sky-50 text-sky-700 border-sky-200",
  Pro: "bg-purple-50 text-purple-700 border-purple-200",
  Elite: "bg-amber-50 text-amber-700 border-amber-200",
};

type ScoreFilter = "All" | "Hot" | "Warm" | "Nurture";

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
        className="w-72 shadow-xl border-primary/40 border-l-4 border-l-primary rotate-[2deg] scale-105 bg-card rounded-2xl"
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
        className={`group border-l-4 border-l-transparent hover:border-l-primary hover:shadow-md transition-all rounded-2xl ${
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
  const scoreInfo = getScoreLabel(client.totalScore);

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
        <Badge
          variant="outline"
          className={`text-[10px] px-1.5 py-0.5 h-auto font-medium rounded-full ${scoreInfo.color}`}
          data-testid={`badge-score-${client.id}`}
        >
          {scoreInfo.emoji} {scoreInfo.label}
        </Badge>
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

      <div className="flex flex-wrap gap-1.5">
        <Badge
          variant="outline"
          className="text-[10px] font-normal py-0.5 h-auto"
          data-testid={`badge-stage-${client.id}`}
        >
          {client.stage}
        </Badge>
        {client.selectedPackage && (
          <Badge
            variant="outline"
            className={`text-[10px] font-medium py-0.5 h-auto ${packageColors[client.selectedPackage] || ""}`}
            data-testid={`badge-package-${client.id}`}
          >
            {client.selectedPackage}
          </Badge>
        )}
      </div>

      {client.nextActionDate && (
        <div
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
          data-testid={`text-next-action-${client.id}`}
        >
          <CalendarClock className="h-3 w-3" />
          <span className="truncate">
            {new Date(client.nextActionDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            {client.nextAction ? ` — ${client.nextAction}` : ""}
          </span>
        </div>
      )}
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
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("All");
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

  const filtered = clients.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.city.toLowerCase().includes(q)) return false;
    }
    if (scoreFilter !== "All") {
      const { label } = getScoreLabel(c.totalScore);
      if (label !== scoreFilter) return false;
    }
    return true;
  });

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
    return <PageLoader />;
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
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value as ScoreFilter)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            data-testid="select-score-filter"
          >
            <option value="All">All Leads</option>
            <option value="Hot">🔴 Hot</option>
            <option value="Warm">🟡 Warm</option>
            <option value="Nurture">🟢 Nurture</option>
          </select>
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

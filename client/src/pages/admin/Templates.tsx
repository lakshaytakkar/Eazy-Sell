import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import type { WhatsAppTemplate } from "@shared/schema";
import { PIPELINE_STAGES } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check, MessageSquare, Search, ExternalLink } from "lucide-react";

export default function Templates() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const { data: templates = [], isLoading } = useQuery<WhatsAppTemplate[]>({
    queryKey: ["/api/templates"],
  });

  const filtered = templates.filter((t) => {
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.body.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === "all" || t.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const handleCopy = async (template: WhatsAppTemplate) => {
    try {
      await navigator.clipboard.writeText(template.body);
      setCopiedId(template.id);
      toast({ title: "Copied!", description: `"${template.title}" copied to clipboard.` });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const parseMergeFields = (fields: string | null): string[] => {
    if (!fields) return [];
    try {
      return JSON.parse(fields);
    } catch {
      return fields.split(",").map((f) => f.trim()).filter(Boolean);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6" data-testid="templates-loading">
        <div>
          <h1 className="text-2xl font-bold">WhatsApp Templates</h1>
          <p className="text-muted-foreground">Quick message templates for client communication</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="rounded-2xl animate-pulse">
              <CardContent className="p-6 space-y-4">
                <div className="h-5 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-24 bg-muted rounded" />
                <div className="h-8 bg-muted rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" data-testid="templates-page">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-page-title">
          <MessageSquare className="h-6 w-6 text-primary" />
          WhatsApp Templates
        </h1>
        <p className="text-muted-foreground" data-testid="text-page-subtitle">
          Quick message templates for client communication
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3" data-testid="filter-bar">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-stage-filter">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" data-testid="select-option-all">All Stages</SelectItem>
            {PIPELINE_STAGES.map((stage) => (
              <SelectItem key={stage} value={stage} data-testid={`select-option-${stage}`}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16" data-testid="templates-empty">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-semibold">No templates found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="templates-grid">
          {filtered.map((template) => {
            const mergeFields = parseMergeFields(template.mergeFields);
            const isCopied = copiedId === template.id;

            return (
              <Card
                key={template.id}
                className="rounded-2xl border hover:shadow-md transition-shadow"
                data-testid={`card-template-${template.id}`}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base leading-tight" data-testid={`text-title-${template.id}`}>
                      {template.title}
                    </h3>
                    <Badge variant="secondary" className="shrink-0 text-xs" data-testid={`badge-stage-${template.id}`}>
                      {template.stage}
                    </Badge>
                  </div>

                  <pre
                    className="text-sm text-muted-foreground font-mono whitespace-pre-wrap bg-muted/50 rounded-lg p-3 max-h-48 overflow-y-auto leading-relaxed"
                    data-testid={`text-body-${template.id}`}
                  >
                    {template.body}
                  </pre>

                  {mergeFields.length > 0 && (
                    <div className="flex flex-wrap gap-1.5" data-testid={`merge-fields-${template.id}`}>
                      {mergeFields.map((field) => (
                        <Badge
                          key={field}
                          variant="outline"
                          className="text-[11px] font-mono px-1.5 py-0"
                        >
                          {field}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={() => handleCopy(template)}
                      className="gap-1.5"
                      data-testid={`button-copy-${template.id}`}
                    >
                      {isCopied ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {isCopied ? "Copied!" : "Copy to Clipboard"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="gap-1.5 opacity-50"
                      data-testid={`button-whatsapp-${template.id}`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open in WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

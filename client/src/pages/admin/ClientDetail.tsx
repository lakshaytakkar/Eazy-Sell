import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Store,
  CreditCard,
  IndianRupee,
  Users,
  Ruler,
  Calendar,
  Clock,
  FileText,
  ExternalLink,
  Copy,
  Check,
  MoreHorizontal,
  Eye,
  Download,
  Edit3,
  MessageSquare,
  ChevronDown,
  PhoneCall,
  Share2,
  Target,
  CheckSquare,
  Rocket,
} from "lucide-react";
import type { Client, Payment, ReadinessChecklistItem, ReadinessChecklistStatus } from "@shared/schema";
import { PIPELINE_STAGES, LAUNCH_PHASES, getScoreLabel } from "@shared/schema";
import { PageLoader } from "@/components/ui/loader";

const stageColors: Record<string, string> = {
  "New Inquiry": "bg-slate-100 text-slate-700 border-slate-200",
  "Qualification Sent": "bg-blue-50 text-blue-700 border-blue-200",
  "Discovery Call": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Proposal Sent": "bg-violet-50 text-violet-700 border-violet-200",
  "Negotiation": "bg-amber-50 text-amber-700 border-amber-200",
  "Token Paid": "bg-teal-50 text-teal-700 border-teal-200",
  "In Execution": "bg-orange-50 text-orange-700 border-orange-200",
  "Launched": "bg-green-50 text-green-700 border-green-200",
  "Lost": "bg-red-50 text-red-700 border-red-200",
};

function formatCurrency(val: number | null | undefined) {
  if (!val) return "₹0";
  return `₹${val.toLocaleString("en-IN")}`;
}

function formatCurrencyShort(val: number | null | undefined) {
  if (!val) return "₹0";
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function SlackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
    </svg>
  );
}

function GmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
    </svg>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
            data-testid={`button-copy-${label}`}
          >
            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied!" : `Copy ${label}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function ClientDetail() {
  const params = useParams<{ id: string }>();
  const clientId = Number(params.id);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: [`/api/payments/client/${clientId}`],
  });

  const { data: checklistItems = [] } = useQuery<ReadinessChecklistItem[]>({
    queryKey: ["/api/checklist/items"],
  });

  const { data: checklistStatus = [] } = useQuery<ReadinessChecklistStatus[]>({
    queryKey: [`/api/checklist/${clientId}`],
  });

  const toggleChecklistMutation = useMutation({
    mutationFn: async ({ itemId, completed }: { itemId: number; completed: boolean }) => {
      const res = await apiRequest("POST", `/api/checklist/${clientId}`, { itemId, completed });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/checklist/${clientId}`] });
    },
    onError: () => {
      toast({ title: "Failed to update checklist", variant: "destructive" });
    },
  });

  const updateStageMutation = useMutation({
    mutationFn: async (newStage: string) => {
      const res = await apiRequest("PATCH", `/api/clients/${clientId}`, { stage: newStage });
      return res.json();
    },
    onSuccess: (_data, newStage) => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({ title: "Stage updated", description: `Moved to "${newStage}"` });
    },
    onError: () => {
      toast({ title: "Failed to update stage", variant: "destructive" });
    },
  });

  const client = clients.find((c) => c.id === clientId);
  const currentIndex = clients.findIndex((c) => c.id === clientId);
  const prevClient = currentIndex > 0 ? clients[currentIndex - 1] : null;
  const nextClient =
    currentIndex < clients.length - 1 ? clients[currentIndex + 1] : null;

  const currentStageIndex = client
    ? PIPELINE_STAGES.indexOf(client.stage as (typeof PIPELINE_STAGES)[number])
    : -1;

  const completedItemIds = new Set(
    checklistStatus.filter((s) => s.completed).map((s) => s.itemId)
  );
  const totalChecklistItems = checklistItems.length;
  const completedCount = checklistItems.filter((item) => completedItemIds.has(item.id)).length;
  const checklistPercent = totalChecklistItems > 0 ? Math.round((completedCount / totalChecklistItems) * 100) : 0;

  const checklistByCategory = checklistItems.reduce<Record<string, ReadinessChecklistItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  if (isLoading) {
    return <PageLoader />;
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3" data-testid="not-found-state">
        <p className="font-medium">Client not found</p>
        <Link href="/admin/clients">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Pipeline
          </Button>
        </Link>
      </div>
    );
  }

  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const storeMapUrl = client.storeAddress?.match(/https?:\/\/[^\s]+/)?.[0];
  const cleanAddress = client.storeAddress
    ?.replace(/https?:\/\/[^\s]+/g, "")
    .trim();

  const slackChannelUrl = "https://suprans.slack.com/archives/C0AFN14THEE";

  const whatsappNumber = client.phone?.replace(/[^0-9]/g, "") || "";
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber.startsWith("91") ? whatsappNumber : "91" + whatsappNumber}`
    : null;

  const totalPaid = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const scoreLabel = getScoreLabel(client.totalScore);

  const scoreFactors = [
    { key: "Budget", value: client.scoreBudget },
    { key: "Location", value: client.scoreLocation },
    { key: "Operator", value: client.scoreOperator },
    { key: "Timeline", value: client.scoreTimeline },
    { key: "Experience", value: client.scoreExperience },
    { key: "Engagement", value: client.scoreEngagement },
  ];

  const currentLaunchPhaseIndex = client.launchPhase
    ? LAUNCH_PHASES.indexOf(client.launchPhase as (typeof LAUNCH_PHASES)[number])
    : -1;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] w-full overflow-hidden" data-testid="client-detail-page">
      <div className="shrink-0 pb-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Link href="/admin/clients" className="hover:text-foreground transition-colors flex items-center gap-1" data-testid="link-back-clients">
                <Users className="h-4 w-4" />
                Client Pipeline
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium truncate">
              {client.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {prevClient && (
              <Link href={`/admin/clients/${prevClient.id}`}>
                <Button variant="outline" size="icon" className="h-8 w-8" data-testid="button-prev-client">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {nextClient && (
              <Link href={`/admin/clients/${nextClient.id}`}>
                <Button variant="outline" size="icon" className="h-8 w-8" data-testid="button-next-client">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 pb-4">
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
              <div className="flex flex-col gap-4 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-sm">
                    <AvatarImage src={getAvatarUrl(client.name, 128)} alt={client.name} />
                    <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <h1 className="text-xl font-bold text-foreground leading-tight" data-testid="text-client-name">
                        {client.name}
                      </h1>
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${stageColors[client.stage] || "bg-muted text-foreground"}`}
                        data-testid="badge-client-stage"
                      >
                        {client.stage}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {client.city}
                      </span>
                      {client.phone && (
                        <span className="flex items-center gap-1">
                          <a
                            href={`tel:${client.phone}`}
                            className="hover:text-primary transition-colors flex items-center gap-1"
                            data-testid="link-phone"
                          >
                            <Phone className="h-3.5 w-3.5" /> {client.phone}
                          </a>
                          <CopyButton text={client.phone} label="phone" />
                        </span>
                      )}
                      {client.email && (
                        <span className="flex items-center gap-1">
                          <a
                            href={`mailto:${client.email}`}
                            className="hover:text-primary transition-colors flex items-center gap-1"
                            data-testid="link-email"
                          >
                            <Mail className="h-3.5 w-3.5" /> {client.email}
                          </a>
                          <CopyButton text={client.email} label="email" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-1">
                  {PIPELINE_STAGES.map((stage, i) => (
                    <TooltipProvider key={stage}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-2 flex-1 rounded-full min-w-[20px] transition-colors cursor-default ${
                              i <= currentStageIndex
                                ? "bg-primary"
                                : "bg-muted"
                            }`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{stage}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 shrink-0 flex-wrap">
                {client.phone && (
                  <a href={`tel:${client.phone}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                      data-testid="button-call"
                    >
                      <PhoneCall className="h-4 w-4 mr-1.5" /> Call
                    </Button>
                  </a>
                )}
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 hover:text-[#128C7E]"
                      data-testid="button-whatsapp"
                    >
                      <WhatsAppIcon className="h-4 w-4 mr-1.5" /> Chat on WhatsApp
                    </Button>
                  </a>
                )}
                <a href={slackChannelUrl} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#4A154B]/30 bg-[#4A154B]/10 text-[#4A154B] dark:border-[#E01E5A]/30 dark:bg-[#E01E5A]/10 dark:text-[#E01E5A]"
                    data-testid="button-slack"
                  >
                    <SlackIcon className="h-4 w-4 mr-1.5" /> Chat on Slack
                  </Button>
                </a>
                {client.email && (
                  <a href={`mailto:${client.email}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#EA4335]/30 bg-[#EA4335]/10 text-[#EA4335] hover:bg-[#EA4335]/20 hover:text-[#D93025]"
                      data-testid="button-email"
                    >
                      <GmailIcon className="h-4 w-4 mr-1.5" /> Gmail
                    </Button>
                  </a>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" data-testid="button-more-actions">
                      <MoreHorizontal className="h-4 w-4 mr-1.5" /> More
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        const text = `${client.name}\n${client.phone || ""}\n${client.city}\nStage: ${client.stage}`;
                        navigator.clipboard.writeText(text);
                      }}
                      data-testid="action-copy-details"
                    >
                      <Copy className="h-4 w-4 mr-2" /> Copy Client Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        const text = `Client: ${client.name}\nCity: ${client.city}\nStage: ${client.stage}\nPaid: ${formatCurrencyShort(client.totalPaid)}\nDue: ${formatCurrencyShort(client.totalDue)}`;
                        navigator.clipboard.writeText(text);
                      }}
                      data-testid="action-copy-summary"
                    >
                      <Share2 className="h-4 w-4 mr-2" /> Share Summary
                    </DropdownMenuItem>
                    {whatsappUrl && (
                      <DropdownMenuItem asChild>
                        <a
                          href={`${whatsappUrl}?text=${encodeURIComponent(`Hi ${client.name}, this is regarding your Eazy to Sell store partnership.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <WhatsAppIcon className="h-4 w-4 mr-2" /> Send WhatsApp Message
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <a
                        href={slackChannelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SlackIcon className="h-4 w-4 mr-2" /> Open Slack Channel
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => toast({ title: "Coming soon", description: "Client editing will be available shortly." })}
                      data-testid="action-edit-client"
                    >
                      <Edit3 className="h-4 w-4 mr-2" /> Edit Client
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0 overflow-hidden">
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-1">
          <Card className="border rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-primary" /> Financial Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Total Paid
                  </p>
                  <p className="text-lg font-bold text-green-600" data-testid="text-total-paid">
                    {formatCurrencyShort(client.totalPaid)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Balance Due
                  </p>
                  <p className="text-lg font-bold text-destructive" data-testid="text-total-due">
                    {formatCurrencyShort(client.totalDue)}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Payments Count</p>
                  <p className="font-semibold">{payments.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Verified Total</p>
                  <p className="font-semibold text-green-600">{formatCurrencyShort(totalPaid)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Lead Score
              </h3>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-foreground" data-testid="text-total-score">
                  {client.totalScore || 0}
                </div>
                <Badge
                  variant="outline"
                  className={`text-sm font-medium px-2.5 py-0.5 ${scoreLabel.color}`}
                  data-testid="badge-score-label"
                >
                  {scoreLabel.emoji} {scoreLabel.label}
                </Badge>
                {client.selectedPackage && (
                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200" data-testid="badge-selected-package">
                    {client.selectedPackage}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {scoreFactors.map((factor) => (
                  <div
                    key={factor.key}
                    className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg"
                    data-testid={`score-factor-${factor.key.toLowerCase()}`}
                  >
                    <Badge
                      variant="outline"
                      className={`h-6 w-6 p-0 flex items-center justify-center text-xs font-bold shrink-0 ${
                        (factor.value || 0) >= 3
                          ? "bg-green-100 text-green-700 border-green-300"
                          : (factor.value || 0) >= 2
                            ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                            : "bg-slate-100 text-slate-600 border-slate-300"
                      }`}
                    >
                      {factor.value || 0}
                    </Badge>
                    <span className="text-xs text-muted-foreground truncate">{factor.key}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Store className="h-4 w-4 text-primary" /> Store Details
                </h3>
                {storeMapUrl && (
                  <a
                    href={storeMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                    data-testid="link-store-map"
                  >
                    <ExternalLink className="h-3 w-3" /> Map
                  </a>
                )}
              </div>
              <div className="space-y-3">
                {cleanAddress && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Address
                    </p>
                    <p className="text-sm text-foreground leading-relaxed" data-testid="text-store-address">
                      {cleanAddress}
                    </p>
                  </div>
                )}
                {client.storeArea && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <Ruler className="h-3 w-3" /> Store Area
                    </p>
                    <p className="text-sm font-medium text-foreground" data-testid="text-store-area">
                      {client.storeArea.toLocaleString()} sq ft
                    </p>
                  </div>
                )}
                {!cleanAddress && !client.storeArea && (
                  <p className="text-sm text-muted-foreground italic">No store details available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {client.nextAction && (
            <Card className="border rounded-2xl shadow-sm border-primary/20 bg-primary/5">
              <CardContent className="p-5">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" /> Next Action
                </h3>
                <p className="text-sm text-foreground" data-testid="text-next-action">
                  {client.nextAction}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="border rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <ChevronDown className="h-4 w-4 text-primary" /> Stage Management
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {PIPELINE_STAGES.map((stage, i) => (
                  <Badge
                    key={stage}
                    variant="outline"
                    className={`text-[10px] cursor-pointer transition-all ${
                      client.stage === stage
                        ? (stageColors[stage] || "") + " ring-2 ring-primary/20 font-semibold"
                        : i <= currentStageIndex
                          ? "opacity-50 hover:opacity-80"
                          : "opacity-30 hover:opacity-60"
                    }`}
                    onClick={() => {
                      if (stage !== client.stage) {
                        updateStageMutation.mutate(stage);
                      }
                    }}
                    data-testid={`stage-badge-${stage.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    {stage}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {(client.managerName || client.managerPhone) && (
            <Card className="border rounded-2xl shadow-sm">
              <CardContent className="p-5 space-y-3">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Account Manager
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getAvatarUrl(client.managerName || "AM", 64)} alt={client.managerName || "Account Manager"} />
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                      {client.managerName?.split(" ").map((n) => n[0]).join("") || "AM"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    {client.managerName && (
                      <p className="text-sm font-medium text-foreground">
                        {client.managerName}
                      </p>
                    )}
                    {client.managerPhone && (
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${client.managerPhone}`}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" /> {client.managerPhone}
                        </a>
                        <CopyButton text={client.managerPhone} label="manager-phone" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
          <Tabs defaultValue="payments" className="w-full flex flex-col h-full">
            <div className="shrink-0 mb-3">
              <TabsList className="bg-card border p-1 h-[44px] rounded-xl">
                <TabsTrigger
                  value="payments"
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
                  data-testid="tab-payments"
                >
                  <CreditCard className="h-4 w-4 mr-1.5" /> Payments ({payments.length})
                </TabsTrigger>
                <TabsTrigger
                  value="checklist"
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
                  data-testid="tab-checklist"
                >
                  <CheckSquare className="h-4 w-4 mr-1.5" /> Checklist ({checklistPercent}%)
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
                  data-testid="tab-timeline"
                >
                  <Clock className="h-4 w-4 mr-1.5" /> Timeline
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
                  data-testid="tab-notes"
                >
                  <FileText className="h-4 w-4 mr-1.5" /> Notes
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="payments" className="h-full mt-0">
                <Card className="border rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">
                  <div className="px-5 py-4 border-b shrink-0 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-foreground">
                      Payment History
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast({ title: "Coming soon", description: "Payment recording will be available shortly." })}
                      data-testid="button-add-payment"
                    >
                      <IndianRupee className="h-3.5 w-3.5 mr-1" /> Record Payment
                    </Button>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-5">
                      {payments.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                          <CreditCard className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                          <p className="font-medium">No payments recorded</p>
                          <p className="text-sm mt-1">Payment records will appear here once added.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {payments.map((payment) => (
                            <div
                              key={payment.id}
                              className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl border cursor-pointer hover:bg-muted/50 hover:border-primary/20 transition-all group"
                              onClick={() => setSelectedPayment(payment)}
                              data-testid={`payment-row-${payment.id}`}
                            >
                              <div
                                className={`mt-1 h-3 w-3 rounded-full shrink-0 ${
                                  payment.status === "Paid"
                                    ? "bg-green-500"
                                    : "bg-amber-500"
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                      {formatCurrency(payment.amount)}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                      {payment.description || "Payment"}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Badge
                                      variant="outline"
                                      className={`shrink-0 text-[10px] ${
                                        payment.status === "Paid"
                                          ? "bg-green-50 text-green-700 border-green-200"
                                          : "bg-amber-50 text-amber-700 border-amber-200"
                                      }`}
                                    >
                                      {payment.status}
                                    </Badge>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={(e) => e.stopPropagation()}
                                          data-testid={`payment-actions-${payment.id}`}
                                        >
                                          <MoreHorizontal className="h-3.5 w-3.5" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-44">
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedPayment(payment); }}>
                                          <Eye className="h-4 w-4 mr-2" /> View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => {
                                          e.stopPropagation();
                                          navigator.clipboard.writeText(
                                            `Payment: ${formatCurrency(payment.amount)}\nStatus: ${payment.status}\nDate: ${payment.date}\nMethod: ${payment.method || "N/A"}`
                                          );
                                        }}>
                                          <Copy className="h-4 w-4 mr-2" /> Copy Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => {
                                          e.stopPropagation();
                                          toast({ title: "Coming soon", description: "Receipt downloads will be available shortly." });
                                        }}>
                                          <Download className="h-4 w-4 mr-2" /> Download Receipt
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />{" "}
                                    {payment.date}
                                  </span>
                                  {payment.method && (
                                    <span className="flex items-center gap-1">
                                      <CreditCard className="h-3 w-3" />{" "}
                                      {payment.method}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              </TabsContent>

              <TabsContent value="checklist" className="h-full mt-0">
                <Card className="border rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">
                  <div className="px-5 py-4 border-b shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-foreground">
                        Readiness Checklist
                      </h3>
                      <Badge variant="outline" className="text-xs" data-testid="badge-checklist-progress">
                        {completedCount} / {totalChecklistItems} done
                      </Badge>
                    </div>
                    <Progress value={checklistPercent} className="h-2" data-testid="progress-checklist" />
                    <p className="text-xs text-muted-foreground mt-1.5">{checklistPercent}% complete</p>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-5 space-y-6">
                      {totalChecklistItems === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                          <CheckSquare className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                          <p className="font-medium">No checklist items</p>
                          <p className="text-sm mt-1">Checklist items will appear here once configured.</p>
                        </div>
                      ) : (
                        Object.entries(checklistByCategory).map(([category, items]) => {
                          const categoryDone = items.filter((item) => completedItemIds.has(item.id)).length;
                          return (
                            <div key={category} data-testid={`checklist-category-${category.toLowerCase().replace(/\s+/g, "-")}`}>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-foreground">{category}</h4>
                                <span className="text-xs text-muted-foreground">
                                  {categoryDone} of {items.length} done
                                </span>
                              </div>
                              <div className="space-y-2">
                                {items
                                  .sort((a, b) => a.sortOrder - b.sortOrder)
                                  .map((item) => {
                                    const isChecked = completedItemIds.has(item.id);
                                    return (
                                      <label
                                        key={item.id}
                                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer"
                                        data-testid={`checklist-item-${item.id}`}
                                      >
                                        <Checkbox
                                          checked={isChecked}
                                          onCheckedChange={(checked) => {
                                            toggleChecklistMutation.mutate({
                                              itemId: item.id,
                                              completed: !!checked,
                                            });
                                          }}
                                          data-testid={`checkbox-item-${item.id}`}
                                        />
                                        <span className={`text-sm ${isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                          {item.label}
                                        </span>
                                      </label>
                                    );
                                  })}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="h-full mt-0">
                <Card className="border rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">
                  <div className="px-5 py-4 border-b shrink-0">
                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
                      <Rocket className="h-4 w-4 text-primary" /> Launch Progress
                    </h3>
                    <div className="flex items-center gap-0" data-testid="launch-phase-bar">
                      {LAUNCH_PHASES.map((phase, i) => {
                        const isActive = i <= currentLaunchPhaseIndex;
                        const isCurrent = i === currentLaunchPhaseIndex;
                        return (
                          <div key={phase} className="flex items-center flex-1">
                            <div className="flex flex-col items-center gap-1.5 flex-1">
                              <div
                                className={`h-4 w-4 rounded-full border-2 shrink-0 transition-colors ${
                                  isCurrent
                                    ? "bg-primary border-primary ring-4 ring-primary/20"
                                    : isActive
                                      ? "bg-primary border-primary"
                                      : "bg-muted border-muted-foreground/20"
                                }`}
                              />
                              <span className={`text-[10px] font-medium text-center leading-tight ${
                                isActive ? "text-primary" : "text-muted-foreground"
                              }`}>
                                {phase}
                              </span>
                            </div>
                            {i < LAUNCH_PHASES.length - 1 && (
                              <div className={`h-0.5 flex-1 -mt-5 ${
                                i < currentLaunchPhaseIndex ? "bg-primary" : "bg-muted"
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="mt-1.5 h-3 w-3 rounded-full bg-primary shrink-0 ring-4 ring-primary/10" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            Client record synced from Airtable
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Imported from Stores database
                          </p>
                        </div>
                      </div>

                      {client.stage !== "New Inquiry" && (
                        <div className="flex items-start gap-4">
                          <div className="mt-1.5 h-3 w-3 rounded-full bg-blue-500 shrink-0 ring-4 ring-blue-500/10" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              Stage updated to "{client.stage}"
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Current pipeline stage
                            </p>
                          </div>
                        </div>
                      )}

                      {client.launchPhase && (
                        <div className="flex items-start gap-4">
                          <div className="mt-1.5 h-3 w-3 rounded-full bg-violet-500 shrink-0 ring-4 ring-violet-500/10" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              Launch phase: {client.launchPhase}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {currentLaunchPhaseIndex + 1} of {LAUNCH_PHASES.length} phases
                            </p>
                          </div>
                        </div>
                      )}

                      {payments.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-start gap-4 cursor-pointer hover:bg-muted/30 -mx-3 px-3 py-1 rounded-lg transition-colors"
                          onClick={() => setSelectedPayment(p)}
                        >
                          <div
                            className={`mt-1.5 h-3 w-3 rounded-full shrink-0 ring-4 ${
                              p.status === "Paid"
                                ? "bg-green-500 ring-green-500/10"
                                : "bg-amber-500 ring-amber-500/10"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              Payment of {formatCurrency(p.amount)} —{" "}
                              {p.status}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {p.date} via {p.method || "N/A"}
                            </p>
                          </div>
                          <Eye className="h-4 w-4 text-muted-foreground/40 mt-1 shrink-0" />
                        </div>
                      ))}

                      {payments.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                          <Clock className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                          <p className="font-medium">No activity yet</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="h-full mt-0">
                <Card className="border rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">
                  <div className="px-5 py-4 border-b shrink-0 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-foreground">
                      Notes & Observations
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast({ title: "Coming soon", description: "Note-taking will be available shortly." })}
                      data-testid="button-add-note"
                    >
                      <Edit3 className="h-3.5 w-3.5 mr-1" /> Add Note
                    </Button>
                  </div>
                  {client.notes ? (
                    <ScrollArea className="flex-1">
                      <div className="p-6">
                        <div className="bg-muted/30 rounded-xl border p-4" data-testid="text-client-notes">
                          <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                            {client.notes}
                          </pre>
                        </div>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6">
                      <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
                      <p className="font-medium">No notes yet</p>
                      <p className="text-sm mt-1 text-center">Notes and observations will appear here.</p>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Details
            </DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-5 pt-2">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(selectedPayment.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {selectedPayment.description || "Payment"}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-sm px-3 py-1 ${
                    selectedPayment.status === "Paid"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {selectedPayment.status === "Paid" ? (
                    <Check className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <Clock className="h-3.5 w-3.5 mr-1" />
                  )}
                  {selectedPayment.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 p-3 bg-muted/20 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date</p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {selectedPayment.date || "N/A"}
                  </p>
                </div>
                <div className="space-y-1 p-3 bg-muted/20 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Method</p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                    {selectedPayment.method || "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-1 p-3 bg-muted/20 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Client</p>
                <p className="text-sm font-medium">{client.name}</p>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Payment: ${formatCurrency(selectedPayment.amount)}\nStatus: ${selectedPayment.status}\nDate: ${selectedPayment.date}\nMethod: ${selectedPayment.method || "N/A"}\nClient: ${client.name}`
                    );
                  }}
                  data-testid="modal-copy-payment"
                >
                  <Copy className="h-4 w-4 mr-1.5" /> Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => toast({ title: "Coming soon", description: "Receipt downloads will be available shortly." })}
                  data-testid="modal-download-receipt"
                >
                  <Download className="h-4 w-4 mr-1.5" /> Receipt
                </Button>
                {whatsappUrl && (
                  <a
                    href={`${whatsappUrl}?text=${encodeURIComponent(`Hi ${client.name}, confirming payment of ${formatCurrency(selectedPayment.amount)} received on ${selectedPayment.date || "N/A"}. Thank you!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-[#25D366]/30 text-[#25D366]"
                      data-testid="modal-whatsapp-confirm"
                    >
                      <WhatsAppIcon className="h-4 w-4 mr-1.5" /> Confirm
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

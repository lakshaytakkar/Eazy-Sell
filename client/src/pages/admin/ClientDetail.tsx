import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  CheckCircle2,
  Clock,
  FileText,
  ExternalLink,
} from "lucide-react";
import type { Client, Payment } from "@shared/schema";
import { STAGES } from "@shared/schema";

const stageColors: Record<string, string> = {
  Lead: "bg-slate-100 text-slate-700 border-slate-200",
  "Token Paid": "bg-blue-50 text-blue-700 border-blue-200",
  "Location Shared": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Location Approved": "bg-teal-50 text-teal-700 border-teal-200",
  "3D Design": "bg-violet-50 text-violet-700 border-violet-200",
  "Payment Partial": "bg-amber-50 text-amber-700 border-amber-200",
  "In Production": "bg-orange-50 text-orange-700 border-orange-200",
  Shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Setup: "bg-pink-50 text-pink-700 border-pink-200",
  Launched: "bg-green-50 text-green-700 border-green-200",
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function formatCurrency(val: number | null | undefined) {
  if (!val) return "₹0";
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
}

export default function ClientDetail() {
  const params = useParams<{ id: string }>();
  const clientId = Number(params.id);

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: [`/api/payments/client/${clientId}`],
  });

  const client = clients.find((c) => c.id === clientId);
  const currentIndex = clients.findIndex((c) => c.id === clientId);
  const prevClient = currentIndex > 0 ? clients[currentIndex - 1] : null;
  const nextClient =
    currentIndex < clients.length - 1 ? clients[currentIndex + 1] : null;

  const currentStageIndex = client
    ? STAGES.indexOf(client.stage as (typeof STAGES)[number])
    : -1;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground" data-testid="loading-state">
        Loading client...
      </div>
    );
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

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] w-full overflow-hidden" data-testid="client-detail-page">
      <div className="shrink-0 pb-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Link href="/admin/clients">
              <a className="hover:text-foreground transition-colors flex items-center gap-1" data-testid="link-back-clients">
                <Users className="h-4 w-4" />
                Client Pipeline
              </a>
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
                        <a
                          href={`tel:${client.phone}`}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                          data-testid="link-phone"
                        >
                          <Phone className="h-3.5 w-3.5" /> {client.phone}
                        </a>
                      )}
                      {client.email && (
                        <a
                          href={`mailto:${client.email}`}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                          data-testid="link-email"
                        >
                          <Mail className="h-3.5 w-3.5" /> {client.email}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-1">
                  {STAGES.map((stage, i) => (
                    <div key={stage} className="flex items-center gap-1">
                      <div
                        className={`h-2 flex-1 rounded-full min-w-[20px] transition-colors ${
                          i <= currentStageIndex
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                        title={stage}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                {client.phone && (
                  <a href={`https://wa.me/${client.phone.replace(/[^0-9+]/g, "")}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" data-testid="button-whatsapp">
                      <Phone className="h-4 w-4 mr-1" /> WhatsApp
                    </Button>
                  </a>
                )}
                {client.email && (
                  <a href={`mailto:${client.email}`}>
                    <Button variant="outline" size="sm" data-testid="button-email">
                      <Mail className="h-4 w-4 mr-1" /> Email
                    </Button>
                  </a>
                )}
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
                    {formatCurrency(client.totalPaid)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Balance Due
                  </p>
                  <p className="text-lg font-bold text-destructive" data-testid="text-total-due">
                    {formatCurrency(client.totalDue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" /> Store Details
              </h3>
              <div className="space-y-3">
                {cleanAddress && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Address
                    </p>
                    <p className="text-sm text-foreground leading-relaxed" data-testid="text-store-address">
                      {cleanAddress}
                    </p>
                    {storeMapUrl && (
                      <a
                        href={storeMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                        data-testid="link-store-map"
                      >
                        <ExternalLink className="h-3 w-3" /> View on Maps
                      </a>
                    )}
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

          {(client.managerName || client.managerPhone) && (
            <Card className="border rounded-2xl shadow-sm">
              <CardContent className="p-5 space-y-3">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Account Manager
                </h3>
                {client.managerName && (
                  <p className="text-sm font-medium text-foreground">
                    {client.managerName}
                  </p>
                )}
                {client.managerPhone && (
                  <a
                    href={`tel:${client.managerPhone}`}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <Phone className="h-3.5 w-3.5" /> {client.managerPhone}
                  </a>
                )}
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
                  <CreditCard className="h-4 w-4 mr-1.5" /> Payments
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
                  <div className="px-5 py-4 border-b shrink-0">
                    <h3 className="text-base font-semibold text-foreground">
                      Payment History
                    </h3>
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
                        <div className="space-y-4">
                          {payments.map((payment) => (
                            <div
                              key={payment.id}
                              className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl border"
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
                                    <p className="text-sm font-semibold text-foreground">
                                      {formatCurrency(payment.amount)}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                      {payment.description}
                                    </p>
                                  </div>
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

              <TabsContent value="timeline" className="h-full mt-0">
                <Card className="border rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">
                  <div className="px-5 py-4 border-b shrink-0">
                    <h3 className="text-base font-semibold text-foreground">
                      Activity Timeline
                    </h3>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="mt-1.5 h-3 w-3 rounded-full bg-primary shrink-0 ring-4 ring-primary/10" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Client record synced from Airtable
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Imported from Stores database
                          </p>
                        </div>
                      </div>

                      {payments.map((p) => (
                        <div key={p.id} className="flex items-start gap-4">
                          <div
                            className={`mt-1.5 h-3 w-3 rounded-full shrink-0 ring-4 ${
                              p.status === "Paid"
                                ? "bg-green-500 ring-green-500/10"
                                : "bg-amber-500 ring-amber-500/10"
                            }`}
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Payment of {formatCurrency(p.amount)} —{" "}
                              {p.status}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {p.date} via {p.method || "N/A"}
                            </p>
                          </div>
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
                <Card className="border rounded-2xl shadow-sm h-full flex flex-col items-center justify-center text-muted-foreground">
                  <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="font-medium">No notes yet</p>
                  <p className="text-sm mt-1">Notes and observations will appear here.</p>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

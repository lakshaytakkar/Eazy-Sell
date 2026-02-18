import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CheckCircle2, Clock, MapPin, ExternalLink, PackageOpen, ArrowRight, Box } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ORDER_STATUSES } from "@shared/schema";
import type { Order } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/loader";

const statusConfig: Record<string, { color: string; bgColor: string; icon: typeof Package }> = {
  "Order Placed": { color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200", icon: Package },
  "Processing": { color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200", icon: PackageOpen },
  "Shipped": { color: "text-purple-600", bgColor: "bg-purple-50 border-purple-200", icon: Box },
  "In Transit": { color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200", icon: Truck },
  "Delivered": { color: "text-green-600", bgColor: "bg-green-50 border-green-200", icon: CheckCircle2 },
};

function getStatusIndex(status: string): number {
  return ORDER_STATUSES.indexOf(status as any);
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function daysUntilDelivery(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  try {
    const target = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "Overdue";
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return `${diff} days`;
  } catch {
    return null;
  }
}

function OrderTimeline({ order }: { order: Order }) {
  const currentIndex = getStatusIndex(order.status);

  return (
    <div className="flex items-center gap-0 w-full py-4">
      {ORDER_STATUSES.map((status, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const config = statusConfig[status];
        const Icon = config?.icon || Package;

        return (
          <div key={status} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center relative">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? isCurrent
                      ? `${config?.bgColor || "bg-primary/10"} border-current ${config?.color || "text-primary"} ring-4 ring-primary/10`
                      : "bg-green-50 border-green-500 text-green-600"
                    : "bg-muted border-muted-foreground/20 text-muted-foreground/40"
                }`}
                data-testid={`status-icon-${status.toLowerCase().replace(/\s/g, "-")}`}
              >
                {isCompleted && !isCurrent ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span className={`text-[11px] mt-2 text-center whitespace-nowrap font-medium ${
                isCompleted ? (isCurrent ? config?.color || "text-primary" : "text-green-600") : "text-muted-foreground/50"
              }`}>
                {status}
              </span>
            </div>
            {index < ORDER_STATUSES.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mt-[-20px] ${
                index < currentIndex ? "bg-green-500" : "bg-muted-foreground/15"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const config = statusConfig[order.status] || statusConfig["Order Placed"];
  const deliveryCountdown = order.status !== "Delivered" ? daysUntilDelivery(order.expectedDelivery) : null;

  return (
    <Card className="overflow-hidden" data-testid={`card-order-${order.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
              <Badge className={`${config.bgColor} ${config.color} border`} data-testid={`badge-status-${order.id}`}>
                {order.status}
              </Badge>
            </div>
            <CardDescription>{order.description}</CardDescription>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Placed on</p>
            <p className="font-medium text-foreground">{formatDate(order.createdAt)}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <OrderTimeline order={order} />

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {order.items && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Items</p>
              <p className="text-sm font-medium" data-testid={`text-items-${order.id}`}>{order.items}</p>
            </div>
          )}

          {order.carrier && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Carrier</p>
              <div className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium" data-testid={`text-carrier-${order.id}`}>{order.carrier}</p>
              </div>
            </div>
          )}

          {order.trackingNumber && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tracking Number</p>
              {order.trackingLink ? (
                <a
                  href={order.trackingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                  data-testid={`link-tracking-${order.id}`}
                >
                  {order.trackingNumber}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <p className="text-sm font-medium" data-testid={`text-tracking-${order.id}`}>{order.trackingNumber}</p>
              )}
            </div>
          )}
        </div>

        {order.expectedDelivery && (
          <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
            <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm">
                <span className="text-muted-foreground">Expected Delivery:</span>{" "}
                <span className="font-semibold" data-testid={`text-delivery-${order.id}`}>{formatDate(order.expectedDelivery)}</span>
                {deliveryCountdown && (
                  <Badge variant="outline" className={`ml-2 text-xs ${
                    deliveryCountdown === "Overdue" ? "text-red-600 border-red-200 bg-red-50" : 
                    deliveryCountdown === "Today" || deliveryCountdown === "Tomorrow" ? "text-amber-600 border-amber-200 bg-amber-50" :
                    "text-blue-600 border-blue-200 bg-blue-50"
                  }`}>
                    {deliveryCountdown}
                  </Badge>
                )}
              </p>
            </div>
          </div>
        )}

        {order.notes && (
          <div className="bg-muted/30 rounded-lg p-3 border border-dashed">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Notes</p>
            <p className="text-sm text-muted-foreground">{order.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function OrderTracking() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: [`/api/orders/${user?.clientId}`],
    enabled: !!user?.clientId,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  const activeOrders = (orders || []).filter(o => o.status !== "Delivered");
  const deliveredOrders = (orders || []).filter(o => o.status === "Delivered");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">Order Tracking</h1>
        <p className="text-muted-foreground">Track the status of your inventory shipments and deliveries</p>
      </div>

      {(!orders || orders.length === 0) ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2" data-testid="text-empty-title">No Orders Yet</h3>
            <p className="text-muted-foreground max-w-md">
              Once your inventory is ordered and starts shipping, you'll be able to track every shipment right here.
              Your orders will appear with real-time status updates and tracking information.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {activeOrders.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                <h2 className="text-lg font-semibold">Active Orders ({activeOrders.length})</h2>
              </div>
              {activeOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}

          {deliveredOrders.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <h2 className="text-lg font-semibold text-muted-foreground">Delivered ({deliveredOrders.length})</h2>
              </div>
              {deliveredOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

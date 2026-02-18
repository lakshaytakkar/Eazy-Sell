import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Loader } from "@/components/ui/loader";
import { Save, RotateCcw, Sparkles } from "lucide-react";
import type { Category, ClientCategoryPreference } from "@shared/schema";

const RECOMMENDED_MIX: Record<string, Record<string, number>> = {
  'High Street': { 'Home Decor': 15, 'Kitchen': 20, 'Toys': 15, 'Beauty': 10, 'Stationery': 10, 'Fashion Accessories': 10, 'Electronics Accessories': 10, 'Bags & Wallets': 10 },
  'Mall': { 'Fashion Accessories': 20, 'Beauty': 15, 'Home Decor': 10, 'Kitchen': 10, 'Toys': 10, 'Electronics Accessories': 15, 'Bags & Wallets': 10, 'Stationery': 10 },
  'Residential Area': { 'Kitchen': 25, 'Home Decor': 20, 'Toys': 15, 'Stationery': 10, 'Beauty': 10, 'Fashion Accessories': 10, 'Bags & Wallets': 5, 'Electronics Accessories': 5 },
  default: { 'Kitchen': 15, 'Home Decor': 15, 'Toys': 15, 'Beauty': 10, 'Stationery': 10, 'Fashion Accessories': 10, 'Electronics Accessories': 10, 'Bags & Wallets': 5, 'Miscellaneous': 10 },
};

const DONUT_COLORS = [
  'hsl(32, 95%, 52%)',
  'hsl(200, 70%, 50%)',
  'hsl(150, 60%, 45%)',
  'hsl(340, 65%, 55%)',
  'hsl(270, 55%, 55%)',
  'hsl(45, 85%, 50%)',
  'hsl(180, 55%, 45%)',
  'hsl(10, 70%, 55%)',
  'hsl(220, 60%, 55%)',
  'hsl(90, 50%, 45%)',
  'hsl(300, 45%, 55%)',
  'hsl(60, 70%, 45%)',
];

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

interface CategoryMixSliderProps {
  clientId: number;
  budget: number | null;
  storeType: string | null;
  onSave?: () => void;
}

export default function CategoryMixSlider({ clientId, budget, storeType, onSave }: CategoryMixSliderProps) {
  const { toast } = useToast();
  const [allocations, setAllocations] = useState<Record<number, number>>({});

  const { data: categories, isLoading: loadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: existingPrefs, isLoading: loadingPrefs } = useQuery<ClientCategoryPreference[]>({
    queryKey: ['/api/client-preferences', clientId],
    enabled: !!clientId,
  });

  useEffect(() => {
    if (existingPrefs && existingPrefs.length > 0) {
      const map: Record<number, number> = {};
      existingPrefs.forEach((p) => {
        map[p.categoryId] = p.allocationPercent;
      });
      setAllocations(map);
    }
  }, [existingPrefs]);

  const totalAllocation = useMemo(() => {
    return Object.values(allocations).reduce((sum, v) => sum + v, 0);
  }, [allocations]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const preferences = Object.entries(allocations)
        .filter(([, pct]) => pct > 0)
        .map(([categoryId, allocationPercent]) => ({
          clientId,
          categoryId: Number(categoryId),
          allocationPercent,
        }));
      await apiRequest("POST", `/api/client-preferences/${clientId}`, { preferences });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/client-preferences', clientId] });
      toast({ title: "Preferences Saved", description: "Your category mix has been saved." });
      onSave?.();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save preferences.", variant: "destructive" });
    },
  });

  const handleSliderChange = (categoryId: number, value: number[]) => {
    setAllocations((prev) => ({ ...prev, [categoryId]: value[0] }));
  };

  const handleReset = () => {
    setAllocations({});
  };

  const handleUseRecommended = () => {
    if (!categories) return;
    const mix = RECOMMENDED_MIX[storeType || ''] || RECOMMENDED_MIX.default;
    const newAllocations: Record<number, number> = {};
    categories.forEach((cat) => {
      newAllocations[cat.id] = mix[cat.name] || 0;
    });
    setAllocations(newAllocations);
  };

  const totalColor = totalAllocation === 100
    ? 'bg-green-500'
    : totalAllocation >= 90 && totalAllocation < 100
      ? 'bg-yellow-500'
      : totalAllocation > 100
        ? 'bg-red-500'
        : 'bg-muted-foreground/30';

  const totalTextColor = totalAllocation === 100
    ? 'text-green-600'
    : totalAllocation >= 90 && totalAllocation < 100
      ? 'text-yellow-600'
      : totalAllocation > 100
        ? 'text-red-600'
        : 'text-muted-foreground';

  const donutSegments = useMemo(() => {
    if (!categories) return '';
    const activeCategories = categories
      .filter((cat) => (allocations[cat.id] || 0) > 0)
      .map((cat, i) => ({
        name: cat.name,
        pct: allocations[cat.id] || 0,
        color: DONUT_COLORS[i % DONUT_COLORS.length],
      }));

    if (activeCategories.length === 0) return 'conic-gradient(hsl(var(--muted)) 0% 100%)';

    let cumulative = 0;
    const stops: string[] = [];
    activeCategories.forEach((seg) => {
      stops.push(`${seg.color} ${cumulative}% ${cumulative + seg.pct}%`);
      cumulative += seg.pct;
    });
    if (cumulative < 100) {
      stops.push(`hsl(var(--muted)) ${cumulative}% 100%`);
    }
    return `conic-gradient(${stops.join(', ')})`;
  }, [categories, allocations]);

  if (loadingCategories || loadingPrefs) {
    return <Loader />;
  }

  if (!categories || categories.length === 0) {
    return <p className="text-sm text-muted-foreground">No categories available.</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle className="text-base">Total Allocation</CardTitle>
            <Badge
              variant="outline"
              className={totalTextColor}
              data-testid="badge-total-allocation"
            >
              {totalAllocation}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${totalColor}`}
              style={{ width: `${Math.min(totalAllocation, 100)}%` }}
              data-testid="bar-total-allocation"
            />
          </div>
          <p className={`text-xs mt-2 ${totalTextColor}`}>
            {totalAllocation === 100
              ? 'Allocation is complete'
              : totalAllocation > 100
                ? `Over-allocated by ${totalAllocation - 100}%`
                : `${100 - totalAllocation}% remaining`}
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUseRecommended}
            data-testid="button-use-recommended"
          >
            <Sparkles className="h-4 w-4 mr-1.5" />
            Use Recommended
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            data-testid="button-reset-mix"
          >
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Reset
          </Button>
        </div>
        <Button
          size="sm"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          data-testid="button-save-mix"
        >
          <Save className="h-4 w-4 mr-1.5" />
          {saveMutation.isPending ? 'Saving...' : 'Save Mix'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {categories.map((cat, index) => {
            const pct = allocations[cat.id] || 0;
            const budgetAmount = budget ? Math.round((pct / 100) * budget) : 0;
            return (
              <div
                key={cat.id}
                className="flex items-center gap-4 p-3 rounded-lg border bg-card"
                data-testid={`category-row-${cat.id}`}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-medium truncate">{cat.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="text-xs" data-testid={`badge-pct-${cat.id}`}>
                        {pct}%
                      </Badge>
                      {budget && pct > 0 && (
                        <span className="text-xs text-muted-foreground" data-testid={`text-budget-${cat.id}`}>
                          {formatINR(budgetAmount)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Slider
                    value={[pct]}
                    min={0}
                    max={40}
                    step={1}
                    onValueChange={(val) => handleSliderChange(cat.id, val)}
                    data-testid={`slider-${cat.id}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-4">
          <div
            className="relative w-48 h-48 rounded-full"
            style={{ background: donutSegments }}
            data-testid="chart-donut"
          >
            <div className="absolute inset-8 rounded-full bg-background flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${totalTextColor}`}>{totalAllocation}%</div>
                <div className="text-xs text-muted-foreground">Allocated</div>
              </div>
            </div>
          </div>

          <div className="w-full space-y-1.5">
            {categories
              .filter((cat) => (allocations[cat.id] || 0) > 0)
              .map((cat, index) => (
                <div key={cat.id} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: DONUT_COLORS[categories.indexOf(cat) % DONUT_COLORS.length] }}
                  />
                  <span className="truncate flex-1">{cat.name}</span>
                  <span className="text-muted-foreground shrink-0">{allocations[cat.id]}%</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

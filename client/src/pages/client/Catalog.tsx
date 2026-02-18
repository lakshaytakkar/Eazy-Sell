import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Search, ShoppingCart, Plus, X, Package, Ruler, Weight, Layers, Info, RotateCcw, SlidersHorizontal, Eye } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product, Category } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";

import { getProductImage } from "@/lib/productImages";
import { PageLoader } from "@/components/ui/loader";

const COST_RANGES = [
  { label: "All Prices", value: "all", min: 0, max: Infinity },
  { label: "Under ₹30", value: "u30", min: 0, max: 30 },
  { label: "₹30 - ₹50", value: "30-50", min: 30, max: 50 },
  { label: "₹50 - ₹100", value: "50-100", min: 50, max: 100 },
  { label: "₹100 - ₹200", value: "100-200", min: 100, max: 200 },
  { label: "₹200+", value: "200+", min: 200, max: Infinity },
];

const MRP_RANGES = [
  { label: "All MRPs", value: "all", min: 0, max: Infinity },
  { label: "Under ₹99", value: "u99", min: 0, max: 99 },
  { label: "₹99 - ₹199", value: "99-199", min: 99, max: 199 },
  { label: "₹199 - ₹399", value: "199-399", min: 199, max: 399 },
  { label: "₹399 - ₹999", value: "399-999", min: 399, max: 999 },
];

const MARGIN_RANGES = [
  { label: "All Margins", value: "all", min: 0 },
  { label: "2x+ (100%+ profit)", value: "2x", min: 2 },
  { label: "2.5x+ (150%+ profit)", value: "2.5x", min: 2.5 },
  { label: "3x+ (200%+ profit)", value: "3x", min: 3 },
];

const TAG_OPTIONS = ["Bestseller", "New Arrival", "Recommended", "High Margin", "Fast Mover", "Seasonal"];

const CATEGORY_COLORS: Record<string, string> = {
  "Hair Accessories": "bg-pink-100 text-pink-700",
  "Kitchen": "bg-amber-100 text-amber-700",
  "Storage": "bg-blue-100 text-blue-700",
  "Toys": "bg-purple-100 text-purple-700",
  "Bathroom": "bg-cyan-100 text-cyan-700",
  "Stationery": "bg-emerald-100 text-emerald-700",
  "Cleaning": "bg-lime-100 text-lime-700",
  "Decor": "bg-rose-100 text-rose-700",
  "Bags": "bg-indigo-100 text-indigo-700",
  "Gifts": "bg-orange-100 text-orange-700",
};

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getCategoryColor(catName: string) {
  return CATEGORY_COLORS[catName] || "bg-slate-100 text-slate-600";
}

export default function ProductCatalog() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [costRange, setCostRange] = useState("all");
  const [mrpRange, setMrpRange] = useState("all");
  const [marginRange, setMarginRange] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("margin");

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [kitDialogProduct, setKitDialogProduct] = useState<Product | null>(null);
  const [kitQty, setKitQty] = useState(1);
  const [kitQtyType, setKitQtyType] = useState<"pieces" | "cartons">("pieces");

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categoriesData = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const categoryMap = Object.fromEntries(categoriesData.map(c => [c.id, c.name]));

  const addToKitMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      await apiRequest("POST", "/api/kit-items", { clientId: user!.clientId, productId, quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/kit-items/${user?.clientId}`] });
      toast({ title: "Added to Kit", description: `${kitQty} ${kitQtyType} added to your launch kit.` });
      setKitDialogProduct(null);
      setKitQty(1);
      setKitQtyType("pieces");
    },
  });

  const formatCurrency = (val: number | null | undefined) => {
    if (!val && val !== 0) return "₹0";
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const formatCurrencyDecimal = (val: number | null | undefined) => {
    if (!val && val !== 0) return "₹0";
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  };

  const getPrice = (p: Product) => p.storeLandingPrice ?? p.costPrice ?? 0;
  const getMrp = (p: Product) => p.suggestedMrp ?? p.mrp ?? 0;
  const getMultiplier = (p: Product) => {
    const cost = getPrice(p);
    const mrp = getMrp(p);
    if (cost <= 0) return 0;
    return mrp / cost;
  };
  const getProfit = (p: Product) => getMrp(p) - getPrice(p);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (costRange !== "all") count++;
    if (mrpRange !== "all") count++;
    if (marginRange !== "all") count++;
    if (selectedTags.length > 0) count++;
    if (searchQuery) count++;
    return count;
  }, [selectedCategory, costRange, mrpRange, marginRange, selectedTags, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setCostRange("all");
    setMrpRange("all");
    setMarginRange("all");
    setSelectedTags([]);
    setSearchQuery("");
    setSortBy("margin");
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.status === "Active");

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || (categoryMap[p.categoryId] || "").toLowerCase().includes(q));
    }

    if (selectedCategory !== "all") {
      result = result.filter(p => String(p.categoryId) === selectedCategory);
    }

    const cr = COST_RANGES.find(r => r.value === costRange);
    if (cr && cr.value !== "all") {
      result = result.filter(p => {
        const price = getPrice(p);
        return price >= cr.min && price < cr.max;
      });
    }

    const mr = MRP_RANGES.find(r => r.value === mrpRange);
    if (mr && mr.value !== "all") {
      result = result.filter(p => {
        const mrp = getMrp(p);
        return mrp >= mr.min && mrp < mr.max;
      });
    }

    const mg = MARGIN_RANGES.find(r => r.value === marginRange);
    if (mg && mg.value !== "all") {
      result = result.filter(p => getMultiplier(p) >= mg.min);
    }

    if (selectedTags.length > 0) {
      result = result.filter(p => (p.tags || []).some(t => selectedTags.includes(t)));
    }

    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case "price_desc":
        result.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case "margin":
        result.sort((a, b) => getMultiplier(b) - getMultiplier(a));
        break;
      case "mrp_asc":
        result.sort((a, b) => getMrp(a) - getMrp(b));
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, costRange, mrpRange, marginRange, selectedTags, sortBy, categoryMap]);

  const categories = categoriesData.map(c => ({ id: String(c.id), name: c.name }));

  const stats = useMemo(() => {
    const avgMultiplier = filteredProducts.length > 0
      ? filteredProducts.reduce((acc, p) => acc + getMultiplier(p), 0) / filteredProducts.length
      : 0;
    return {
      total: filteredProducts.length,
      avgMultiplier: avgMultiplier.toFixed(1),
      highMarginCount: filteredProducts.filter(p => getMultiplier(p) >= 2.5).length,
    };
  }, [filteredProducts]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleAddToKit = (product: Product) => {
    setKitDialogProduct(product);
    setKitQty(1);
    setKitQtyType("pieces");
  };

  const confirmAddToKit = () => {
    if (!kitDialogProduct) return;
    const totalPieces = kitQtyType === "cartons"
      ? kitQty * (kitDialogProduct.unitsPerCarton || 1)
      : kitQty;
    addToKitMutation.mutate({ productId: kitDialogProduct.id, quantity: totalPieces });
  };

  if (productsLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground" data-testid="text-catalog-title">Product Catalog</h1>
          <p className="text-sm text-muted-foreground">Browse and select inventory for your store</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" data-testid="button-view-kit">
          <ShoppingCart className="h-4 w-4" /> View Kit
        </Button>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/5 border border-primary/10">
          <span className="text-muted-foreground">Products</span>
          <span className="font-bold" data-testid="text-products-count">{stats.total}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-50 border border-green-100">
          <span className="text-muted-foreground">Avg. Return</span>
          <span className="font-bold text-green-700" data-testid="text-avg-margin">{stats.avgMultiplier}x</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-50 border border-orange-100">
          <span className="text-muted-foreground">2.5x+ Items</span>
          <span className="font-bold text-orange-700" data-testid="text-high-margin">{stats.highMarginCount}</span>
        </div>
      </div>

      <Card className="shadow-none">
        <CardContent className="p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-9 h-9 text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} data-testid="input-search" />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px] h-9 text-sm" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={costRange} onValueChange={setCostRange}>
              <SelectTrigger className="w-[140px] h-9 text-sm" data-testid="select-cost">
                <SelectValue placeholder="Your Cost" />
              </SelectTrigger>
              <SelectContent>
                {COST_RANGES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={mrpRange} onValueChange={setMrpRange}>
              <SelectTrigger className="w-[140px] h-9 text-sm" data-testid="select-mrp">
                <SelectValue placeholder="MRP Range" />
              </SelectTrigger>
              <SelectContent>
                {MRP_RANGES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={marginRange} onValueChange={setMarginRange}>
              <SelectTrigger className="w-[170px] h-9 text-sm" data-testid="select-margin">
                <SelectValue placeholder="Profit Multiple" />
              </SelectTrigger>
              <SelectContent>
                {MARGIN_RANGES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] h-9 text-sm" data-testid="select-sort">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="margin">Highest Return</SelectItem>
                <SelectItem value="price_asc">Cost: Low to High</SelectItem>
                <SelectItem value="price_desc">Cost: High to Low</SelectItem>
                <SelectItem value="mrp_asc">MRP: Low to High</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>

            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9 gap-1 text-muted-foreground" data-testid="button-reset-filters">
                <RotateCcw className="h-3.5 w-3.5" /> Reset ({activeFilterCount})
              </Button>
            )}
          </div>

          {TAG_OPTIONS.length > 0 && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              {TAG_OPTIONS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-background text-muted-foreground border-border'
                  }`}
                  data-testid={`filter-tag-${tag}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground" data-testid="text-empty-state">No products found matching your filters.</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filteredProducts.map((product) => {
          const cost = getPrice(product);
          const mrp = getMrp(product);
          const multiplier = getMultiplier(product);
          const profit = getProfit(product);
          const catName = categoryMap[product.categoryId] || "Other";

          return (
            <Card
              key={product.id}
              className="overflow-hidden border cursor-pointer"
              data-testid={`card-product-${product.id}`}
              onClick={() => setDetailProduct(product)}
            >
              <div className="aspect-square bg-muted relative">
                {(() => {
                  const imgSrc = product.image || getProductImage(product.id, catName);
                  return imgSrc ? (
                    <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  ) : (
                    <div className={`w-full h-full flex flex-col items-center justify-center gap-1 ${getCategoryColor(catName)}`}>
                      <Package className="h-8 w-8 opacity-40" />
                      <span className="text-xs font-bold opacity-60">{getInitials(product.name)}</span>
                    </div>
                  );
                })()}
                {multiplier >= 2.5 && (
                  <div className="absolute top-1.5 right-1.5">
                    <Badge className="bg-green-600 text-white text-[10px] px-1.5 py-0 border-0 shadow-sm">{multiplier.toFixed(1)}x</Badge>
                  </div>
                )}
                {(product.tags || []).length > 0 && (
                  <div className="absolute top-1.5 left-1.5">
                    <Badge variant="secondary" className="bg-white/90 text-[10px] px-1.5 py-0 shadow-sm">{(product.tags || [])[0]}</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-2.5">
                <p className="text-[11px] text-muted-foreground mb-0.5">{catName}</p>
                <h3 className="font-medium text-xs leading-tight line-clamp-2 mb-2 min-h-[2rem]" data-testid={`text-product-name-${product.id}`}>
                  {product.name}
                </h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-muted-foreground">Your Cost</span>
                    <span className="text-sm font-bold text-primary" data-testid={`text-cost-${product.id}`}>{formatCurrency(cost)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-muted-foreground">Sell at MRP</span>
                    <span className="text-xs font-semibold">{formatCurrency(mrp)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t">
                    <span className="text-[10px] text-muted-foreground">Profit</span>
                    <div className="text-right">
                      <span className="text-xs font-bold text-green-700">{formatCurrency(profit)}</span>
                      <span className="text-[10px] text-green-600 ml-1">({multiplier.toFixed(1)}x)</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-full mt-2 h-7 text-xs"
                  onClick={(e) => { e.stopPropagation(); handleAddToKit(product); }}
                  disabled={addToKitMutation.isPending}
                  data-testid={`button-add-to-kit-${product.id}`}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add to Kit
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!detailProduct} onOpenChange={(open) => { if (!open) setDetailProduct(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {detailProduct && (() => {
            const cost = getPrice(detailProduct);
            const mrp = getMrp(detailProduct);
            const multiplier = getMultiplier(detailProduct);
            const profit = getProfit(detailProduct);
            const catName = categoryMap[detailProduct.categoryId] || "Other";
            const cbm = detailProduct.cbmPerUnit;
            const cartonVol = detailProduct.cartonLengthCm && detailProduct.cartonWidthCm && detailProduct.cartonHeightCm
              ? `${detailProduct.cartonLengthCm} x ${detailProduct.cartonWidthCm} x ${detailProduct.cartonHeightCm} cm`
              : null;

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-lg">{detailProduct.name}</DialogTitle>
                  <DialogDescription>
                    <Badge className={`${getCategoryColor(catName)} border-0 text-xs`}>{catName}</Badge>
                    {(detailProduct.tags || []).map(tag => (
                      <Badge key={tag} variant="outline" className="ml-1 text-xs">{tag}</Badge>
                    ))}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="aspect-square rounded-lg bg-muted overflow-hidden mb-3">
                      {(() => {
                        const imgSrc = detailProduct.image || getProductImage(detailProduct.id, catName);
                        return imgSrc ? (
                          <img src={imgSrc} alt={detailProduct.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        ) : (
                          <div className={`w-full h-full flex flex-col items-center justify-center gap-2 ${getCategoryColor(catName)}`}>
                            <Package className="h-16 w-16 opacity-30" />
                            <span className="text-lg font-bold opacity-50">{getInitials(detailProduct.name)}</span>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                      <p className="text-xs text-green-600 mb-1">Your Profit Per Piece</p>
                      <p className="text-2xl font-bold text-green-700">{formatCurrency(profit)}</p>
                      <p className="text-sm text-green-600 mt-1">
                        {multiplier.toFixed(1)}x your cost &middot; Earn {formatCurrency(profit)} on every sale
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Pricing Breakdown</h4>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Your Landing Cost</span>
                          <span className="font-semibold text-primary">{formatCurrencyDecimal(cost)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Sell at MRP</span>
                          <span className="font-semibold">{formatCurrency(mrp)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Profit per piece</span>
                          <span className="font-bold text-green-700">{formatCurrency(profit)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Return on Cost</span>
                          <span className="font-bold text-green-700">{multiplier.toFixed(2)}x</span>
                        </div>
                      </div>
                    </div>

                    {(detailProduct.totalLandedCost || detailProduct.cifPriceInr || detailProduct.fobPriceInr) && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Cost Chain</h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          {detailProduct.exwPriceYuan > 0 && (
                            <div className="flex justify-between"><span>EXW Price</span><span>¥{detailProduct.exwPriceYuan.toFixed(2)}</span></div>
                          )}
                          {detailProduct.fobPriceInr && (
                            <div className="flex justify-between"><span>FOB (INR)</span><span>{formatCurrencyDecimal(detailProduct.fobPriceInr)}</span></div>
                          )}
                          {detailProduct.cifPriceInr && (
                            <div className="flex justify-between"><span>CIF (INR)</span><span>{formatCurrencyDecimal(detailProduct.cifPriceInr)}</span></div>
                          )}
                          {detailProduct.customsDuty != null && (
                            <div className="flex justify-between"><span>Customs Duty</span><span>{formatCurrencyDecimal(detailProduct.customsDuty)}</span></div>
                          )}
                          {detailProduct.igst != null && (
                            <div className="flex justify-between"><span>IGST</span><span>{formatCurrencyDecimal(detailProduct.igst)}</span></div>
                          )}
                          {detailProduct.totalLandedCost && (
                            <div className="flex justify-between font-medium text-foreground"><span>Total Landed</span><span>{formatCurrencyDecimal(detailProduct.totalLandedCost)}</span></div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                        <Package className="h-4 w-4" /> Packing Details
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {cartonVol && (
                          <div className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                            <Ruler className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-muted-foreground">Carton Size</p>
                              <p className="font-medium">{cartonVol}</p>
                            </div>
                          </div>
                        )}
                        {detailProduct.cartonWeightKg && (
                          <div className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                            <Weight className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-muted-foreground">Carton Weight</p>
                              <p className="font-medium">{detailProduct.cartonWeightKg} kg</p>
                            </div>
                          </div>
                        )}
                        {detailProduct.unitsPerCarton > 0 && (
                          <div className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                            <Layers className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-muted-foreground">Units/Carton</p>
                              <p className="font-medium">{detailProduct.unitsPerCarton} pcs</p>
                            </div>
                          </div>
                        )}
                        {cbm && (
                          <div className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                            <Info className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-muted-foreground">CBM/Unit</p>
                              <p className="font-medium">{cbm.toFixed(4)}</p>
                            </div>
                          </div>
                        )}
                        {detailProduct.moq && (
                          <div className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                            <ShoppingCart className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-muted-foreground">MOQ</p>
                              <p className="font-medium">{detailProduct.moq} pcs</p>
                            </div>
                          </div>
                        )}
                        {detailProduct.hsCode && (
                          <div className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                            <Info className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-muted-foreground">HS Code</p>
                              <p className="font-medium">{detailProduct.hsCode}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {detailProduct.supplierName && (
                      <div className="text-xs text-muted-foreground">
                        Supplier: {detailProduct.supplierName}
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setDetailProduct(null)}>Close</Button>
                  <Button onClick={() => { setDetailProduct(null); handleAddToKit(detailProduct); }}>
                    <Plus className="h-4 w-4 mr-2" /> Add to Kit
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Dialog open={!!kitDialogProduct} onOpenChange={(open) => { if (!open) setKitDialogProduct(null); }}>
        <DialogContent className="max-w-sm">
          {kitDialogProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">Add to Launch Kit</DialogTitle>
                <DialogDescription className="text-sm">
                  {kitDialogProduct.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="flex items-center justify-between text-sm bg-muted/50 rounded-lg p-3">
                  <span className="text-muted-foreground">Your Cost</span>
                  <span className="font-bold text-primary">{formatCurrency(getPrice(kitDialogProduct))}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Quantity</Label>
                    <Input
                      type="number"
                      min={1}
                      value={kitQty}
                      onChange={(e) => setKitQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="h-9"
                      data-testid="input-kit-quantity"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Type</Label>
                    <Select value={kitQtyType} onValueChange={(v) => setKitQtyType(v as "pieces" | "cartons")}>
                      <SelectTrigger className="h-9" data-testid="select-kit-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pieces">Pieces</SelectItem>
                        <SelectItem value="cartons">Cartons ({kitDialogProduct.unitsPerCarton || 1} pcs each)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Pieces</span>
                    <span className="font-medium">
                      {kitQtyType === "cartons" ? kitQty * (kitDialogProduct.unitsPerCarton || 1) : kitQty}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Cost</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(
                        getPrice(kitDialogProduct) *
                        (kitQtyType === "cartons" ? kitQty * (kitDialogProduct.unitsPerCarton || 1) : kitQty)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t">
                    <span className="text-muted-foreground">Potential Profit</span>
                    <span className="font-bold text-green-700">
                      {formatCurrency(
                        getProfit(kitDialogProduct) *
                        (kitQtyType === "cartons" ? kitQty * (kitDialogProduct.unitsPerCarton || 1) : kitQty)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setKitDialogProduct(null)}>Cancel</Button>
                <Button onClick={confirmAddToKit} disabled={addToKitMutation.isPending} data-testid="button-confirm-add-kit">
                  {addToKitMutation.isPending ? "Adding..." : "Confirm & Add"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

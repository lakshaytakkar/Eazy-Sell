import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, ShoppingCart, TrendingUp, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product, Category } from "@shared/schema";

const PRICE_BANDS = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under ₹49", min: 0, max: 49 },
  { label: "₹49-99", min: 49, max: 99 },
  { label: "₹99-199", min: 99, max: 199 },
  { label: "₹199-499", min: 199, max: 499 },
  { label: "₹499+", min: 499, max: Infinity },
];

const MRP_BANDS = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under ₹99", min: 0, max: 99 },
  { label: "₹99-199", min: 99, max: 199 },
  { label: "₹199-399", min: 199, max: 399 },
  { label: "₹399-999", min: 399, max: 999 },
];

const TAG_FILTERS = ["Bestseller", "New Arrival", "Recommended", "High Margin", "Fast Mover", "Seasonal"];

export default function ProductCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPriceBand, setSelectedPriceBand] = useState(0);
  const [selectedMrpBand, setSelectedMrpBand] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categoriesData = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const categoryMap = Object.fromEntries(categoriesData.map(c => [c.id, c.name]));

  const addToKitMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest("POST", "/api/kit-items", { clientId: 1, productId, quantity: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kit-items/1"] });
      toast({ title: "Added to Kit", description: "Product added to your launch kit." });
    },
  });

  const formatCurrency = (val: number | null | undefined) => {
    if (!val && val !== 0) return "₹0";
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const getPrice = (p: Product) => p.storeLandingPrice ?? p.costPrice ?? 0;
  const getMrp = (p: Product) => p.suggestedMrp ?? p.mrp ?? 0;

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.status === "Active");

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || (categoryMap[p.categoryId] || "").toLowerCase().includes(q));
    }

    if (selectedCategory !== "All") {
      result = result.filter(p => categoryMap[p.categoryId] === selectedCategory);
    }

    const pb = PRICE_BANDS[selectedPriceBand];
    if (pb && pb.label !== "All") {
      result = result.filter(p => {
        const price = getPrice(p);
        return price >= pb.min && price < pb.max;
      });
    }

    const mb = MRP_BANDS[selectedMrpBand];
    if (mb && mb.label !== "All") {
      result = result.filter(p => {
        const mrp = getMrp(p);
        return mrp >= mb.min && mrp < mb.max;
      });
    }

    if (selectedTags.length > 0) {
      if (selectedTags.includes("High Margin")) {
        result = result.filter(p => (p.storeMarginPercent ?? 0) > 50 || (p.tags || []).some(t => selectedTags.includes(t)));
      } else {
        result = result.filter(p => (p.tags || []).some(t => selectedTags.includes(t)));
      }
    }

    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case "price_desc":
        result.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case "margin":
        result.sort((a, b) => (b.storeMarginPercent ?? 0) - (a.storeMarginPercent ?? 0));
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedPriceBand, selectedMrpBand, selectedTags, sortBy, categoryMap]);

  const categories = ["All", ...Array.from(new Set(products.map(p => categoryMap[p.categoryId]).filter(Boolean)))];

  const stats = useMemo(() => ({
    total: filteredProducts.length,
    avgMargin: filteredProducts.length > 0
      ? Math.round(filteredProducts.reduce((acc, p) => acc + (p.storeMarginPercent ?? 0), 0) / filteredProducts.length)
      : 0,
    highMarginCount: filteredProducts.filter(p => (p.storeMarginPercent ?? 0) > 50).length,
  }), [filteredProducts]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  if (productsLoading) {
    return <div className="flex items-center justify-center h-64" data-testid="loading-state">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground" data-testid="text-catalog-title">Product Catalog</h1>
          <p className="text-muted-foreground">Browse and select inventory for your store.</p>
        </div>
        <Button variant="outline" className="gap-2" data-testid="button-view-kit">
          <ShoppingCart className="h-4 w-4" /> View Kit
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/10 shadow-none">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Products Found</p>
            <p className="text-2xl font-bold" data-testid="text-products-count">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-100 shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Avg. Margin</p>
              <p className="text-2xl font-bold text-green-700" data-testid="text-avg-margin">{stats.avgMargin}%</p>
            </div>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-100 shadow-none">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">High Margin Items</p>
            <p className="text-2xl font-bold text-orange-700" data-testid="text-high-margin">{stats.highMarginCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} data-testid="input-search" />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-sort">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="margin">Highest Margin</SelectItem>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 border-t pt-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1"><Filter className="h-3 w-3" /> Your Cost (Landing Price)</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_BANDS.map((band, i) => (
                  <button key={band.label} onClick={() => setSelectedPriceBand(i)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedPriceBand === i ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`} data-testid={`filter-price-${i}`}>
                    {band.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">MRP Band</p>
              <div className="flex flex-wrap gap-2">
                {MRP_BANDS.map((band, i) => (
                  <button key={band.label} onClick={() => setSelectedMrpBand(i)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedMrpBand === i ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`} data-testid={`filter-mrp-${i}`}>
                    {band.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {TAG_FILTERS.map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedTags.includes(tag) ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`} data-testid={`filter-tag-${tag}`}>
                    {tag === "Bestseller" ? "🔥 " : tag === "New Arrival" ? "🆕 " : tag === "Recommended" ? "🎯 " : tag === "High Margin" ? "💰 " : ""}{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground" data-testid="text-empty-state">No products found matching your filters.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const price = getPrice(product);
          const mrp = getMrp(product);
          const marginPct = product.storeMarginPercent ?? (mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0);
          const marginRs = product.storeMarginRs ?? (mrp - price);
          const catName = categoryMap[product.categoryId] || "Uncategorized";

          return (
            <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-primary/10" data-testid={`card-product-${product.id}`}>
              <div className="aspect-square bg-muted relative overflow-hidden">
                <img src={product.image || ""} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {(product.tags || []).slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-white/90 text-foreground shadow-sm backdrop-blur-sm text-[10px]">{tag}</Badge>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-white/80">Sell At MRP</p>
                      <p className="font-bold">{formatCurrency(mrp)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/80">Your Margin</p>
                      <p className="font-bold text-green-300">{marginPct}%</p>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs" data-testid={`text-category-${product.id}`}>{catName}</Badge>
                </div>
                <h3 className="font-semibold text-lg leading-tight mb-4 min-h-[3rem] line-clamp-2" data-testid={`text-product-name-${product.id}`}>{product.name}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline p-2 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Your Cost</span>
                    <span className="text-xl font-bold text-primary" data-testid={`text-cost-${product.id}`}>{formatCurrency(price)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="border rounded p-2 text-center">
                      <span className="text-muted-foreground block">Sell At</span>
                      <span className="font-semibold">{formatCurrency(mrp)}</span>
                    </div>
                    <div className="border rounded p-2 text-center bg-green-50 border-green-100">
                      <span className="text-muted-foreground block">Profit</span>
                      <span className="font-bold text-green-700">{formatCurrency(marginRs)} ({marginPct}%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={() => addToKitMutation.mutate(product.id)} disabled={addToKitMutation.isPending} data-testid={`button-add-to-kit-${product.id}`}>
                  <Plus className="h-4 w-4 mr-2" /> Add to Kit
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

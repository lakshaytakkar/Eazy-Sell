import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PRODUCTS, Category } from "@/lib/mockData";
import { Filter, Search, ShoppingCart, TrendingUp, Plus, Minus, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function ProductCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [cart, setCart] = useState<Record<string, number>>({});

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesPrice = product.costPrice >= priceRange[0] && product.costPrice <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

  const stats = {
    total: filteredProducts.length,
    avgMargin: Math.round(filteredProducts.reduce((acc, curr) => acc + ((curr.mrp - curr.costPrice) / curr.mrp * 100), 0) / (filteredProducts.length || 1)),
    highMarginCount: filteredProducts.filter(p => ((p.mrp - p.costPrice) / p.mrp * 100) > 50).length
  };

  const addToKit = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    toast({
      title: "Added to Kit",
      description: "Product added to your launch kit.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Product Catalog</h1>
          <p className="text-muted-foreground">Browse and select inventory for your store.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="gap-2">
             <ShoppingCart className="h-4 w-4" /> View Kit ({Object.values(cart).reduce((a,b) => a+b, 0)})
           </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/10 shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
             <div>
                <p className="text-xs text-muted-foreground font-medium">Products Found</p>
                <p className="text-2xl font-bold">{stats.total}</p>
             </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900 shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
             <div>
                <p className="text-xs text-muted-foreground font-medium">Avg. Margin</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.avgMargin}%</p>
             </div>
             <TrendingUp className="h-5 w-5 text-green-600" />
          </CardContent>
        </Card>
         <Card className="bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900 shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
             <div>
                <p className="text-xs text-muted-foreground font-medium">High Margin Items</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">{stats.highMarginCount}</p>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
               <Select defaultValue="newest">
                <SelectTrigger>
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
          </div>
          
          <div className="pt-2 border-t">
             <div className="flex flex-col md:flex-row items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap flex items-center gap-2">
                    <Filter className="h-3 w-3" /> Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </span>
                <Slider 
                    value={priceRange} 
                    onValueChange={setPriceRange} 
                    min={0} 
                    max={2000} 
                    step={100}
                    className="w-full md:w-64" 
                />
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const margin = product.mrp - product.costPrice;
          const marginPercent = Math.round((margin / product.mrp) * 100);

          return (
            <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-primary/10">
              <div className="aspect-square bg-muted relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {product.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-white/90 text-foreground shadow-sm backdrop-blur-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs font-medium">Quick Stats</p>
                    <div className="flex justify-between items-end mt-1">
                        <div>
                             <p className="text-xs text-white/80">Suggested MRP</p>
                             <p className="font-bold">{formatCurrency(product.mrp)}</p>
                        </div>
                         <div className="text-right">
                             <p className="text-xs text-white/80">Margin</p>
                             <p className="font-bold text-green-300">{marginPercent}%</p>
                        </div>
                    </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">{product.category}</Badge>
                </div>
                <h3 className="font-semibold text-lg leading-tight mb-4 min-h-[3rem] line-clamp-2">{product.name}</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline p-2 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Your Cost</span>
                    <span className="text-xl font-bold text-primary">{formatCurrency(product.costPrice)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                     <div className="border rounded p-2 text-center">
                        <span className="text-muted-foreground block">MRP</span>
                        <span className="font-semibold">{formatCurrency(product.mrp)}</span>
                     </div>
                     <div className="border rounded p-2 text-center bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900">
                        <span className="text-muted-foreground block">Profit</span>
                        <span className="font-bold text-green-700 dark:text-green-400">{formatCurrency(margin)}</span>
                     </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={() => addToKit(product.id)}>
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

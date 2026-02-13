import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Store, TrendingUp, Package, Truck, Palette, CheckCircle2, MapPin, Star, Users, ShoppingBag, Zap, Lock, Flame, Crown, Sparkles, Leaf, Baby, Gift, Heart, Box, Shield, Layers, ChevronRight } from "lucide-react";

import storeInterior1 from "@/assets/images/store-interior-1.png";
import shelvesCloseup from "@/assets/images/shelves-closeup.png";
import storeExterior from "@/assets/images/store-exterior.png";
import warehouse from "@/assets/images/warehouse.png";
import layout3d from "@/assets/images/3d-layout.png";
import partner1 from "@/assets/images/partner-1.png";
import partner2 from "@/assets/images/partner-2.png";
import storeInterior2 from "@/assets/images/store-interior-2.png";
import launchKitPackage from "@/assets/images/launch-kit-package.png";
import designScreen from "@/assets/images/3d-design-screen.png";

import catKitchen from "@/assets/images/cat-kitchen.png";
import catStationery from "@/assets/images/cat-stationery.png";
import catToys from "@/assets/images/cat-toys.png";
import catDecor from "@/assets/images/cat-decor.png";
import catStorage from "@/assets/images/cat-storage.png";
import catBags from "@/assets/images/cat-bags.png";
import catBathroom from "@/assets/images/cat-bathroom.png";
import catCleaning from "@/assets/images/cat-cleaning.png";
import catGifts from "@/assets/images/cat-gifts.png";

import type { Product, Category } from "@shared/schema";

const categoryImages: Record<string, string> = {
  Kitchen: catKitchen,
  Stationery: catStationery,
  Toys: catToys,
  Decor: catDecor,
  Storage: catStorage,
  Bags: catBags,
  Bathroom: catBathroom,
  Cleaning: catCleaning,
  Gifts: catGifts,
};

const quickFilters = [
  { label: "Hot Selling", icon: Flame, color: "bg-red-500", textColor: "text-red-600" },
  { label: "High Margin", icon: TrendingUp, color: "bg-green-500", textColor: "text-green-600" },
  { label: "Bestseller", icon: Crown, color: "bg-amber-500", textColor: "text-amber-600" },
  { label: "New Arrivals", icon: Sparkles, color: "bg-blue-500", textColor: "text-blue-600" },
  { label: "Eco Friendly", icon: Leaf, color: "bg-emerald-500", textColor: "text-emerald-600" },
  { label: "Kids", icon: Baby, color: "bg-pink-500", textColor: "text-pink-600" },
  { label: "Gifting", icon: Gift, color: "bg-purple-500", textColor: "text-purple-600" },
  { label: "Luxury", icon: Heart, color: "bg-rose-500", textColor: "text-rose-600" },
  { label: "Essentials", icon: Box, color: "bg-cyan-500", textColor: "text-cyan-600" },
  { label: "Durable", icon: Shield, color: "bg-slate-500", textColor: "text-slate-600" },
];

function getMarginMultiplier(costPrice: number, mrp: number): string {
  const ratio = mrp / costPrice;
  if (ratio >= 4) return "20x";
  if (ratio >= 3) return "10x";
  if (ratio >= 2.5) return "5x";
  if (ratio >= 2) return "3x";
  return "2x";
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export default function LandingPage() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const categoryProductCounts = categories.map((cat) => ({
    ...cat,
    count: products.filter((p) => p.categoryId === cat.id).length,
    image: categoryImages[cat.name] || catKitchen,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-36 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 z-0">
          <img
            src={storeInterior1}
            alt="Modern Retail Store Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>

        <div className="container relative z-10 mx-auto px-4 max-w-6xl">
          <div className="max-w-2xl">
            <Badge className="bg-primary text-primary-foreground mb-6 text-sm px-4 py-1.5 font-medium" data-testid="badge-hero-cta">
              Now launching in 15+ cities across India
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white mb-6 leading-[1.1]" data-testid="text-hero-title">
              Build Your Own <span className="text-primary">Value Retail Empire</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-xl">
              We provide the products, the store design, and the platform. You bring the ambition. Launch a fully stocked, beautifully designed store in under 30 days.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/login">
                <Button size="lg" className="h-14 px-10 text-base font-semibold shadow-xl" data-testid="button-hero-start">
                  Start Your Journey <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/roi-calculator">
                <Button variant="outline" size="lg" className="h-14 px-10 text-base font-semibold bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white" data-testid="button-hero-roi">
                  Calculate Your ROI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-b bg-foreground text-background" data-testid="section-stats">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold font-display text-primary mb-1" data-testid="stat-stores">30+</div>
              <div className="text-sm text-background/60 font-medium">Active Stores</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold font-display text-primary mb-1" data-testid="stat-revenue">₹15L+</div>
              <div className="text-sm text-background/60 font-medium">Avg. Annual Revenue</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold font-display text-primary mb-1" data-testid="stat-margin">45%</div>
              <div className="text-sm text-background/60 font-medium">Avg. Profit Margin</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold font-display text-primary mb-1" data-testid="stat-products">35,000+</div>
              <div className="text-sm text-background/60 font-medium">SKUs Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Filter Carousel */}
      <section className="py-10 bg-background border-b" data-testid="section-quick-filters">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold font-display">Browse by Collection</h3>
              <p className="text-sm text-muted-foreground">Curated product tags for every retail niche</p>
            </div>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {quickFilters.map((filter) => (
              <div
                key={filter.label}
                className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group snap-start"
                data-testid={`filter-${filter.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <div className={`h-16 w-16 md:h-20 md:w-20 rounded-full ${filter.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:shadow-xl`}>
                  <filter.icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
                </div>
                <span className="text-xs md:text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">{filter.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase - Teaser with Locked Prices */}
      <section className="py-20 bg-muted/30" data-testid="section-product-showcase">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-6">
            <Badge variant="outline" className="mb-4 text-sm px-4 py-1">Product Preview</Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Unbeatable Margins on Every Product</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Source directly from manufacturers. Your customers pay MRP — you keep the massive margins. Here's a sneak peek.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Margins up to 5x – 10x – 20x</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Only 1 Box MOQ</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {(products.length > 0 ? products.slice(0, 8) : []).map((product) => {
              const marginMultiplier = getMarginMultiplier(product.costPrice, product.mrp);
              const marginPercent = Math.round(((product.mrp - product.costPrice) / product.mrp) * 100);
              return (
                <Card key={product.id} className="overflow-hidden border hover:shadow-xl transition-all duration-300 group" data-testid={`product-card-${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                      <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 font-bold shadow-md">
                        {marginMultiplier} Margin
                      </Badge>
                    </div>
                    {product.tags && product.tags.length > 0 && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-white/90 text-foreground shadow-sm">
                          {product.tags[0]}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3 md:p-4">
                    <p className="font-semibold text-sm leading-tight mb-2 line-clamp-2" data-testid={`text-product-name-${product.id}`}>{product.name}</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">MRP</span>
                        <span className="text-sm font-bold" data-testid={`text-product-mrp-${product.id}`}>{formatINR(product.mrp)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Partner Price</span>
                        <div className="flex items-center gap-1.5" data-testid={`text-product-locked-price-${product.id}`}>
                          <div className="relative">
                            <span className="text-sm font-bold text-green-600 blur-[5px] select-none">{formatINR(product.costPrice)}</span>
                          </div>
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="pt-1.5 border-t mt-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Your Profit</span>
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-[11px] font-bold px-2" data-testid={`text-product-margin-${product.id}`}>
                            {marginPercent}% margin
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-sm font-semibold shadow-lg" data-testid="button-unlock-catalog">
                <Lock className="h-4 w-4 mr-2" /> Sign Up to Unlock Full Catalog & Prices
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-3">35,000+ products across 9 categories. Partner pricing revealed after sign-up.</p>
          </div>
        </div>
      </section>

      {/* Categories Bento Grid */}
      <section className="py-20 bg-background" data-testid="section-categories">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4 text-sm px-4 py-1">Product Categories</Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">9 Categories, Endless Possibilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From kitchen essentials to luxury gifting — curate the perfect product mix for your store's target audience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[160px] md:auto-rows-[200px]">
            {categoryProductCounts.map((cat, idx) => {
              const isLarge = idx === 0 || idx === 4;
              return (
                <div
                  key={cat.id}
                  className={`relative rounded-2xl overflow-hidden group cursor-pointer ${isLarge ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}`}
                  data-testid={`category-tile-${cat.name.toLowerCase()}`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <h3 className={`text-white font-bold ${isLarge ? "text-xl md:text-2xl" : "text-sm md:text-base"}`} data-testid={`text-category-name-${cat.id}`}>{cat.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white/70 text-xs md:text-sm" data-testid={`text-category-count-${cat.id}`}>{cat.count > 0 ? `${cat.count}+ products` : "Coming soon"}</span>
                      <ChevronRight className="h-3 w-3 text-white/50 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  {isLarge && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 font-bold">Popular</Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Only 1 Box MOQ", desc: "No bulk orders needed", icon: Package },
              { label: "Quality Checked", desc: "Every product inspected", icon: Shield },
              { label: "35,000+ SKUs", desc: "Endless variety", icon: Layers },
              { label: "Curated Expertise", desc: "5x to 20x margins", icon: TrendingUp },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-muted/50 border" data-testid={`usp-${item.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conversion USP Strip */}
      <section className="py-14 bg-foreground text-background" data-testid="section-conversion-usps">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-3">Why Partners Choose <span className="text-primary">Eazy to Sell</span></h2>
            <p className="text-background/60 text-sm md:text-base max-w-xl mx-auto">Product curation expertise that delivers real profits. No guesswork, no risk.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {[
              { value: "1 Box", label: "Minimum Order", sub: "No bulk commitment", icon: Package },
              { value: "35K+", label: "SKUs Available", sub: "Build your own mix", icon: Layers },
              { value: "100%", label: "Quality Checked", sub: "Factory inspected", icon: Shield },
              { value: "9+", label: "Categories", sub: "Endless variety", icon: Store },
              { value: "5x-20x", label: "Profit Margins", sub: "Direct sourcing", icon: TrendingUp },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 rounded-xl bg-background/5 hover:bg-background/10 transition-colors" data-testid={`conv-usp-${item.label.toLowerCase().replace(/\s/g, "-")}`}>
                <item.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-display font-bold text-primary mb-1">{item.value}</div>
                <p className="text-sm font-semibold text-background/90">{item.label}</p>
                <p className="text-xs text-background/50 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Showcase Grid */}
      <section className="py-20 bg-background" data-testid="section-showcase">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4 text-sm px-4 py-1">What We Deliver</Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From store design to fully stocked shelves — we handle every detail so you can focus on growing your business.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[220px] md:auto-rows-[260px]">
            <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer" data-testid="bento-store-interior">
              <img src={storeInterior1} alt="Beautiful store interior" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="bg-primary text-primary-foreground mb-2">Turnkey Stores</Badge>
                <h3 className="text-white text-xl md:text-2xl font-bold">Beautifully Designed Retail Spaces</h3>
                <p className="text-white/70 text-sm mt-1">Move-in ready stores with optimized layouts</p>
              </div>
            </div>

            <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer" data-testid="bento-shelves">
              <img src={shelvesCloseup} alt="Organized shelves" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-semibold">Curated Product Displays</p>
              </div>
            </div>

            <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer" data-testid="bento-warehouse">
              <img src={warehouse} alt="Warehouse operations" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-semibold">Supply Chain Handled</p>
              </div>
            </div>

            <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer" data-testid="bento-lifestyle">
              <img src={storeInterior2} alt="Lifestyle store" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-semibold">Lifestyle Brands</p>
              </div>
            </div>

            <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer" data-testid="bento-launch-kit">
              <img src={launchKitPackage} alt="Launch kit package" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-semibold">Opening Inventory Kit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Design & Architecture Section */}
      <section className="py-20 bg-muted/30" data-testid="section-3d-design">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 text-sm px-4 py-1">Store Design</Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">We Design Your Store in 3D Before Building It</h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Our architectural team creates a complete 3D model of your retail space — optimizing shelf placement, customer flow, and visual merchandising before a single fixture is installed.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Palette className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Custom Layout Design</p>
                    <p className="text-sm text-muted-foreground">Tailored to your exact store dimensions and area</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Optimized Customer Flow</p>
                    <p className="text-sm text-muted-foreground">Maximize footfall-to-purchase conversion</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Visual Merchandising Strategy</p>
                    <p className="text-sm text-muted-foreground">Products placed for maximum appeal and sales</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-2xl border">
                <img src={designScreen} alt="3D store design on screen" className="w-full h-auto" />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg border">
                <img src={layout3d} alt="3D floor plan layout" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Process */}
      <section className="py-20 bg-background" data-testid="section-steps">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-sm px-4 py-1">Your Journey</Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">From Idea to Grand Opening</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A proven 6-step process that gets your store open and profitable in under 30 days.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Sign Up & Consultation",
                desc: "Tell us about your location, budget, and vision. We'll assess the opportunity together.",
                icon: Users,
                color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900",
                iconColor: "text-blue-600",
              },
              {
                step: "02",
                title: "Location Approval",
                desc: "Share your store location. Our team evaluates footfall, demographics, and commercial viability.",
                icon: MapPin,
                color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900",
                iconColor: "text-purple-600",
              },
              {
                step: "03",
                title: "3D Store Design",
                desc: "Our architects create a complete 3D layout optimized for your exact space and product mix.",
                icon: Palette,
                color: "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900",
                iconColor: "text-orange-600",
              },
              {
                step: "04",
                title: "Select Your Launch Kit",
                desc: "Browse 35,000+ products, customize your opening inventory, and finalize your investment plan.",
                icon: Package,
                color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900",
                iconColor: "text-green-600",
              },
              {
                step: "05",
                title: "Production & Shipping",
                desc: "We handle sourcing, quality checks, and deliver everything directly to your store location.",
                icon: Truck,
                color: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-100 dark:border-cyan-900",
                iconColor: "text-cyan-600",
              },
              {
                step: "06",
                title: "Grand Opening!",
                desc: "Your store is set up, stocked, and ready for customers. Start selling from day one.",
                icon: Zap,
                color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900",
                iconColor: "text-yellow-600",
              },
            ].map((item) => (
              <Card key={item.step} className={`${item.color} border hover:shadow-lg transition-all duration-300 group`} data-testid={`step-card-${item.step}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-display font-bold text-muted-foreground/20">{item.step}</span>
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${item.iconColor} bg-white dark:bg-black/20 shadow-sm`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Store Exterior + Features */}
      <section className="py-20 bg-muted/30" data-testid="section-features">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src={storeExterior} alt="Store exterior" className="w-full h-auto" />
            </div>
            <div>
              <Badge variant="outline" className="mb-4 text-sm px-4 py-1">Why Us</Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">Everything Is Taken Care Of</h2>
              <div className="space-y-5">
                {[
                  { title: "Branded Store Identity", desc: "Custom signage, branded interiors, and a professional storefront that builds trust." },
                  { title: "Direct-from-Factory Pricing", desc: "Source products at 40-60% below MRP. Keep the margins that matter." },
                  { title: "Real-Time Dashboard", desc: "Track sales, inventory, payments, and restocking — all from your phone." },
                  { title: "Dedicated Store Manager Support", desc: "Your personal account manager guides you through every step of the journey." },
                  { title: "Repeat Restock Orders", desc: "One-click reordering for fast-selling items. Never run out of bestsellers." },
                ].map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-background" data-testid="section-success-stories">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4 text-sm px-4 py-1">Partner Stories</Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Real Partners, Real Results</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Meet some of the entrepreneurs who turned their retail dreams into reality with Eazy to Sell.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden border hover:shadow-xl transition-shadow" data-testid="story-card-1">
              <div className="grid sm:grid-cols-5 h-full">
                <div className="sm:col-span-2 h-64 sm:h-auto">
                  <img src={partner1} alt="Rahul Sharma" className="w-full h-full object-cover" />
                </div>
                <div className="sm:col-span-3 p-6 flex flex-col justify-center">
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
                  </div>
                  <p className="text-muted-foreground mb-4 italic leading-relaxed">
                    "I invested ₹5L and my store was profitable within the first month. The team handled everything — from design to stocking the shelves. All I had to do was open the doors."
                  </p>
                  <div>
                    <p className="font-bold">Rahul Sharma</p>
                    <p className="text-sm text-muted-foreground">Store Owner, Jaipur</p>
                  </div>
                  <div className="mt-4 pt-4 border-t flex gap-6">
                    <div>
                      <p className="text-xl font-bold text-primary">₹18L</p>
                      <p className="text-xs text-muted-foreground">Annual Revenue</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-green-600">48%</p>
                      <p className="text-xs text-muted-foreground">Profit Margin</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border hover:shadow-xl transition-shadow" data-testid="story-card-2">
              <div className="grid sm:grid-cols-5 h-full">
                <div className="sm:col-span-2 h-64 sm:h-auto">
                  <img src={partner2} alt="Priya Patel" className="w-full h-full object-cover" />
                </div>
                <div className="sm:col-span-3 p-6 flex flex-col justify-center">
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
                  </div>
                  <p className="text-muted-foreground mb-4 italic leading-relaxed">
                    "The 3D design blew me away. I could see exactly how my store would look before anything was built. The product margins are incredible — my customers love the quality and pricing."
                  </p>
                  <div>
                    <p className="font-bold">Priya Patel</p>
                    <p className="text-sm text-muted-foreground">Store Owner, Ahmedabad</p>
                  </div>
                  <div className="mt-4 pt-4 border-t flex gap-6">
                    <div>
                      <p className="text-xl font-bold text-primary">₹22L</p>
                      <p className="text-xs text-muted-foreground">Annual Revenue</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-green-600">52%</p>
                      <p className="text-xs text-muted-foreground">Profit Margin</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden" data-testid="section-cta">
        <div className="absolute inset-0">
          <img src={storeInterior1} alt="Store background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-white">Ready to Build Your Retail Empire?</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
            Join 30+ successful retail partners across India. Investment starts at ₹5 Lakhs. Full support from day one to profitability.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-14 px-10 text-base font-semibold shadow-xl" data-testid="button-cta-start">
                Create Partner Account <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/roi-calculator">
              <Button variant="outline" size="lg" className="h-14 px-10 text-base font-semibold bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white" data-testid="button-cta-roi">
                Calculate Your Returns
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

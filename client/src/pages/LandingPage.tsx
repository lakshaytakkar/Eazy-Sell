import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, ArrowRight, BarChart3, Store, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/retail-hero.png" 
            alt="Retail Store Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Start your retail journey today
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Build Your Own <span className="text-primary">Value Retail Store</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            We provide the products, the plan, and the platform. You bring the ambition. Launch a fully stocked store in under 30 days.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-base">Start Your Journey</Button>
            </Link>
            <Link href="/roi-calculator">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm">
                Calculate ROI
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold font-display text-primary mb-2">30+</div>
              <div className="text-sm text-muted-foreground font-medium">Active Stores</div>
            </div>
            <div>
              <div className="text-4xl font-bold font-display text-primary mb-2">₹15L+</div>
              <div className="text-sm text-muted-foreground font-medium">Avg. Annual Revenue</div>
            </div>
            <div>
              <div className="text-4xl font-bold font-display text-primary mb-2">45%</div>
              <div className="text-sm text-muted-foreground font-medium">Avg. Profit Margin</div>
            </div>
            <div>
              <div className="text-4xl font-bold font-display text-primary mb-2">250+</div>
              <div className="text-sm text-muted-foreground font-medium">Unique Products</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Why Partner With Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We remove the complexity of sourcing, branding, and inventory management so you can focus on sales.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                <Store className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Complete Launch Kit</h3>
              <p className="text-muted-foreground">
                Get a curated opening inventory mix that is proven to sell. No guesswork needed.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Data-Driven Success</h3>
              <p className="text-muted-foreground">
                Our dashboard tracks your store's performance and suggests restocks based on real trends.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">High Margins</h3>
              <p className="text-muted-foreground">
                Source directly from manufacturers through us. Keep 40-50% margins on most items.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-6">Ready to open your store?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-10 text-lg">
            Join our network of successful retail partners. Investment starts at ₹5 Lakhs.
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="h-12 px-8 text-base">
              Create Partner Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

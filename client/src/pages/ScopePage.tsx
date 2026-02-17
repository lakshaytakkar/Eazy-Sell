import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Package, Palette, Monitor, Megaphone, HeadphonesIcon, GraduationCap, Store, XCircle, CheckCircle2 } from "lucide-react";

const packages = [
  {
    name: "Launch Lite",
    price: "₹8-10L",
    skus: "~2000 SKUs",
    area: "200-400 sqft",
    highlight: false,
  },
  {
    name: "Launch Pro",
    price: "₹10-15L",
    skus: "~3500 SKUs",
    area: "400-600 sqft",
    highlight: true,
  },
  {
    name: "Launch Elite",
    price: "₹15L+",
    skus: "~5000+ SKUs",
    area: "600+ sqft",
    highlight: false,
  },
];

const included = [
  {
    title: "Product Sourcing & Import",
    desc: "2000-5000+ SKUs sourced from China with full import handling",
    icon: Package,
  },
  {
    title: "Store Design",
    desc: "3D store design, fixtures planning, and visual merchandising",
    icon: Palette,
  },
  {
    title: "Inventory Management",
    desc: "Full inventory setup with POS system and billing software",
    icon: Monitor,
  },
  {
    title: "Marketing Launch Kit",
    desc: "Grand opening materials, social media kit, local marketing plan",
    icon: Megaphone,
  },
  {
    title: "Ongoing Support",
    desc: "Replenishment, seasonal updates, operational guidance",
    icon: HeadphonesIcon,
  },
  {
    title: "Business Training",
    desc: "Staff training, sales techniques, retail operations mastery",
    icon: GraduationCap,
  },
];

const notIncluded = [
  "Rent & security deposit",
  "Electricity & utility bills",
  "Staff salaries",
  "Business registration & licenses",
];

export default function ScopePage() {
  return (
    <div className="flex flex-col min-h-screen" data-testid="page-scope">
      <section className="py-20 md:py-28 bg-foreground text-background" data-testid="section-scope-hero">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <Badge className="bg-primary text-primary-foreground mb-6 text-sm px-4 py-1.5 font-medium" data-testid="badge-scope">
            Store Launch Program
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6" data-testid="text-scope-title">
            Store Launch Program Scope
          </h1>
          <p className="text-lg md:text-xl text-background/70 max-w-2xl mx-auto" data-testid="text-scope-subtitle">
            Everything included in your partnership with Eazy to Sell
          </p>
        </div>
      </section>

      <section className="py-20 bg-background" data-testid="section-packages">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" data-testid="text-packages-title">Choose Your Package</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Three tailored packages to match your investment capacity and store vision.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card
                key={pkg.name}
                className={`relative overflow-hidden border-2 ${pkg.highlight ? "border-primary shadow-xl scale-[1.02]" : "border-border"}`}
                data-testid={`card-package-${pkg.name.toLowerCase().replace(/\s/g, "-")}`}
              >
                {pkg.highlight && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center text-xs font-bold py-1.5">
                    MOST POPULAR
                  </div>
                )}
                <CardContent className={`p-8 text-center ${pkg.highlight ? "pt-12" : ""}`}>
                  <Store className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold font-display mb-2">{pkg.name}</h3>
                  <p className="text-3xl font-bold text-primary mb-4">{pkg.price}</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>{pkg.skus}</p>
                    <p>{pkg.area}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30" data-testid="section-whats-included">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4 text-sm px-4 py-1">Full Support</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" data-testid="text-included-title">What's Included</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              End-to-end support to get your store launched and running successfully.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {included.map((item) => (
              <Card key={item.title} className="border" data-testid={`card-included-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background" data-testid="section-not-included">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4" data-testid="text-not-included-title">What's NOT Included</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              These are partner responsibilities that are not part of the Store Launch Program.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {notIncluded.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border"
                data-testid={`item-not-included-${item.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
              >
                <XCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                <span className="font-medium text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-foreground text-background" data-testid="section-scope-cta">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6" data-testid="text-scope-cta-title">
            Ready to Start Your Journey?
          </h2>
          <p className="text-background/70 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
            Take the first step towards building your own retail business with Eazy to Sell's Store Launch Program.
          </p>
          <Link href="/qualify">
            <Button size="lg" className="h-14 px-10 text-base font-semibold shadow-xl" data-testid="button-scope-start">
              Start Your Journey <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

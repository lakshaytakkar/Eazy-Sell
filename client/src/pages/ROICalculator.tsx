import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, IndianRupee, Calculator, BarChart3, Clock } from "lucide-react";

const packages = [
  {
    id: "lite",
    name: "Launch Lite",
    investment: 900000,
    investmentLabel: "₹8-10L",
    skus: "~2,000 SKUs",
    description: "Perfect for 200-400 sqft stores",
  },
  {
    id: "pro",
    name: "Launch Pro",
    investment: 1250000,
    investmentLabel: "₹10-15L",
    skus: "~3,500 SKUs",
    description: "Ideal for 400-600 sqft stores",
  },
  {
    id: "elite",
    name: "Launch Elite",
    investment: 1800000,
    investmentLabel: "₹15L+",
    skus: "~5,000+ SKUs",
    description: "Premium 600+ sqft stores",
  },
] as const;

type PackageId = (typeof packages)[number]["id"];
type Scenario = "conservative" | "base" | "optimistic";

const scenarioConfig: Record<Scenario, { label: string; multiplier: number }> = {
  conservative: { label: "Conservative", multiplier: 0.7 },
  base: { label: "Base", multiplier: 1.0 },
  optimistic: { label: "Optimistic", multiplier: 1.3 },
};

function formatINR(val: number): string {
  const abs = Math.abs(val);
  const sign = val < 0 ? "-" : "";
  if (abs >= 10000000) {
    return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  }
  return `${sign}₹${abs.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export default function ROICalculator() {
  const [selectedPackage, setSelectedPackage] = useState<PackageId>("pro");
  const [scenario, setScenario] = useState<Scenario>("base");
  const [footfall, setFootfall] = useState(1500);
  const [ticketSize, setTicketSize] = useState(250);
  const [conversionRate, setConversionRate] = useState(30);
  const [operatingCosts, setOperatingCosts] = useState(40000);
  const [margin, setMargin] = useState(45);

  const selectedPkg = packages.find((p) => p.id === selectedPackage)!;
  const multiplier = scenarioConfig[scenario].multiplier;

  const results = useMemo(() => {
    const monthlyRevenue = footfall * (conversionRate / 100) * ticketSize * multiplier;
    const monthlyGrossProfit = monthlyRevenue * (margin / 100);
    const monthlyNetProfit = monthlyGrossProfit - operatingCosts;
    const annualNetProfit = monthlyNetProfit * 12;
    const paybackMonths = monthlyNetProfit > 0 ? selectedPkg.investment / monthlyNetProfit : Infinity;
    const roiPercent = selectedPkg.investment > 0 ? (annualNetProfit / selectedPkg.investment) * 100 : 0;

    return {
      monthlyRevenue,
      monthlyGrossProfit,
      monthlyNetProfit,
      annualNetProfit,
      paybackMonths,
      roiPercent,
    };
  }, [footfall, conversionRate, ticketSize, multiplier, margin, operatingCosts, selectedPkg.investment]);

  const paybackColor =
    results.paybackMonths <= 12
      ? "text-green-600"
      : results.paybackMonths <= 18
        ? "text-amber-600"
        : "text-red-600";

  const roiColor =
    results.roiPercent >= 80
      ? "text-green-600"
      : results.roiPercent >= 40
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-display font-bold" data-testid="text-page-title">
              ROI Calculator
            </h1>
          </div>
          <p className="text-muted-foreground text-lg" data-testid="text-page-subtitle">
            Estimate your store's earning potential
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              data-testid={`card-package-${pkg.id}`}
              className={`cursor-pointer transition-all ${
                selectedPackage === pkg.id
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "hover:border-primary/40"
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  {pkg.name}
                  {selectedPackage === pkg.id && (
                    <Badge variant="default" className="bg-primary">
                      Selected
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                  <IndianRupee className="h-5 w-5" />
                  {pkg.investmentLabel}
                </div>
                <p className="text-sm font-medium">{pkg.skus}</p>
                <p className="text-sm text-muted-foreground">{pkg.description}</p>
                <Button
                  data-testid={`button-select-${pkg.id}`}
                  variant={selectedPackage === pkg.id ? "default" : "outline"}
                  className="w-full mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPackage(pkg.id);
                  }}
                >
                  {selectedPackage === pkg.id ? "Selected" : "Select"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="mb-8" />

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Scenario
          </h2>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(scenarioConfig) as Scenario[]).map((key) => (
              <Button
                key={key}
                data-testid={`button-scenario-${key}`}
                variant={scenario === key ? "default" : "outline"}
                onClick={() => setScenario(key)}
                className="min-w-[120px]"
              >
                {scenarioConfig[key].label}
                <span className="ml-1 text-xs opacity-70">({scenarioConfig[key].multiplier}x)</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Input Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Monthly Footfall</label>
                  <span className="font-medium text-primary" data-testid="text-footfall-value">
                    {footfall.toLocaleString("en-IN")}
                  </span>
                </div>
                <Slider
                  data-testid="slider-footfall"
                  value={[footfall]}
                  onValueChange={(v) => setFootfall(v[0])}
                  min={500}
                  max={5000}
                  step={50}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>500</span>
                  <span>5,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Average Ticket Size</label>
                  <span className="font-medium text-primary" data-testid="text-ticket-value">
                    ₹{ticketSize.toLocaleString("en-IN")}
                  </span>
                </div>
                <Slider
                  data-testid="slider-ticket-size"
                  value={[ticketSize]}
                  onValueChange={(v) => setTicketSize(v[0])}
                  min={100}
                  max={1000}
                  step={10}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹100</span>
                  <span>₹1,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Conversion Rate</label>
                  <span className="font-medium text-primary" data-testid="text-conversion-value">
                    {conversionRate}%
                  </span>
                </div>
                <Slider
                  data-testid="slider-conversion"
                  value={[conversionRate]}
                  onValueChange={(v) => setConversionRate(v[0])}
                  min={10}
                  max={60}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10%</span>
                  <span>60%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Store Operating Costs/month</label>
                  <span className="font-medium text-primary" data-testid="text-opcost-value">
                    ₹{operatingCosts.toLocaleString("en-IN")}
                  </span>
                </div>
                <Slider
                  data-testid="slider-operating-costs"
                  value={[operatingCosts]}
                  onValueChange={(v) => setOperatingCosts(v[0])}
                  min={20000}
                  max={100000}
                  step={1000}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹20K</span>
                  <span>₹1L</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Average Margin</label>
                  <span className="font-medium text-primary" data-testid="text-margin-value">
                    {margin}%
                  </span>
                </div>
                <Slider
                  data-testid="slider-margin"
                  value={[margin]}
                  onValueChange={(v) => setMargin(v[0])}
                  min={30}
                  max={60}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>30%</span>
                  <span>60%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Projected Results
              <Badge variant="outline" className="ml-auto">
                {scenarioConfig[scenario].label} Scenario
              </Badge>
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground mb-1">Monthly Revenue</p>
                  <p className="text-xl font-bold" data-testid="text-monthly-revenue">
                    {formatINR(results.monthlyRevenue)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground mb-1">Gross Profit</p>
                  <p className="text-xl font-bold" data-testid="text-gross-profit">
                    {formatINR(results.monthlyGrossProfit)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground mb-1">Monthly Net Profit</p>
                  <p
                    className={`text-xl font-bold ${results.monthlyNetProfit < 0 ? "text-red-600" : ""}`}
                    data-testid="text-monthly-net"
                  >
                    {formatINR(results.monthlyNetProfit)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground mb-1">Annual Net Profit</p>
                  <p
                    className={`text-xl font-bold ${results.annualNetProfit < 0 ? "text-red-600" : ""}`}
                    data-testid="text-annual-net"
                  >
                    {formatINR(results.annualNetProfit)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Payback Period</p>
                  </div>
                  <p className={`text-2xl font-bold ${paybackColor}`} data-testid="text-payback">
                    {results.paybackMonths === Infinity
                      ? "N/A"
                      : `${results.paybackMonths.toFixed(1)} months`}
                  </p>
                  <Badge
                    variant="outline"
                    className={`mt-1 ${paybackColor} border-current`}
                    data-testid="badge-payback"
                  >
                    {results.paybackMonths <= 12
                      ? "Excellent"
                      : results.paybackMonths <= 18
                        ? "Good"
                        : "Slow"}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Annual ROI</p>
                  </div>
                  <p className={`text-2xl font-bold ${roiColor}`} data-testid="text-roi">
                    {results.roiPercent.toFixed(1)}%
                  </p>
                  <Badge
                    variant="outline"
                    className={`mt-1 ${roiColor} border-current`}
                    data-testid="badge-roi"
                  >
                    {results.roiPercent >= 80
                      ? "Strong"
                      : results.roiPercent >= 40
                        ? "Moderate"
                        : "Low"}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Investment: {selectedPkg.investmentLabel} ({selectedPkg.name})
                </p>
                <p className="text-sm text-muted-foreground">
                  Scenario: {scenarioConfig[scenario].label} ({scenarioConfig[scenario].multiplier}x)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="text-center py-8">
          <h2 className="text-2xl font-display font-bold mb-3">Ready to start?</h2>
          <p className="text-muted-foreground mb-6">
            Take the first step towards owning your retail store
          </p>
          <Link href="/">
            <Button size="lg" className="px-8" data-testid="button-apply-now">
              Apply Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

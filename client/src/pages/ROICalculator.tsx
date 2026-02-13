import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function ROICalculator() {
  const [investment, setInvestment] = useState(500000);
  const [area, setArea] = useState(300);
  const [rent, setRent] = useState(25000);
  const [footfall, setFootfall] = useState(50);
  const [conversionRate, setConversionRate] = useState(30);
  const [avgTicketSize, setAvgTicketSize] = useState(400);

  // Calculations
  const dailyCustomers = Math.floor(footfall * (conversionRate / 100));
  const dailyRevenue = dailyCustomers * avgTicketSize;
  const monthlyRevenue = dailyRevenue * 30;
  
  const cogs = monthlyRevenue * 0.55; // 45% margin
  const staffCost = 30000; // 2 staff assumed
  const utilities = 5000;
  const totalExpenses = rent + staffCost + utilities + cogs;
  
  const monthlyProfit = monthlyRevenue - totalExpenses;
  const annualProfit = monthlyProfit * 12;
  const roi = (annualProfit / investment) * 100;
  const breakevenMonths = investment / (monthlyProfit > 0 ? monthlyProfit : 1);

  const chartData = [
    { name: 'Revenue', amount: monthlyRevenue, color: 'hsl(221, 83%, 53%)' },
    { name: 'Expenses', amount: totalExpenses, color: 'hsl(0, 84%, 60%)' },
    { name: 'Profit', amount: monthlyProfit, color: 'hsl(173, 58%, 39%)' },
  ];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold mb-3">ROI Estimator</h1>
          <p className="text-muted-foreground">Adjust the sliders to estimate your potential monthly earnings.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Input Parameters</CardTitle>
              <CardDescription>Configure your store details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Initial Investment</Label>
                  <span className="font-medium text-primary">{formatCurrency(investment)}</span>
                </div>
                <Slider 
                  value={[investment]} 
                  onValueChange={(vals) => setInvestment(vals[0])} 
                  min={300000} 
                  max={2000000} 
                  step={50000} 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Shop Area (sq ft)</Label>
                  <span className="font-medium">{area} sq ft</span>
                </div>
                <Slider 
                  value={[area]} 
                  onValueChange={(vals) => setArea(vals[0])} 
                  min={100} 
                  max={1000} 
                  step={50} 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Monthly Rent</Label>
                  <span className="font-medium">{formatCurrency(rent)}</span>
                </div>
                <Slider 
                  value={[rent]} 
                  onValueChange={(vals) => setRent(vals[0])} 
                  min={5000} 
                  max={100000} 
                  step={1000} 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Daily Footfall (Walk-ins)</Label>
                  <span className="font-medium">{footfall} people</span>
                </div>
                <Slider 
                  value={[footfall]} 
                  onValueChange={(vals) => setFootfall(vals[0])} 
                  min={10} 
                  max={500} 
                  step={5} 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Conversion Rate</Label>
                  <span className="font-medium">{conversionRate}%</span>
                </div>
                <Slider 
                  value={[conversionRate]} 
                  onValueChange={(vals) => setConversionRate(vals[0])} 
                  min={5} 
                  max={80} 
                  step={5} 
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-primary">Projected Monthly Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display font-bold text-foreground">
                  {formatCurrency(monthlyProfit)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  ~{roi.toFixed(1)}% Annual ROI
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
               <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Breakeven</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.max(1, breakevenMonths).toFixed(1)} Months</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Financial Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      cursor={{fill: 'transparent'}}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

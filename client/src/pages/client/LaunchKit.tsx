import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, AlertCircle, ArrowRight, PieChart } from "lucide-react";
import { useState } from "react";
import { Cell, Pie, PieChart as RePieChart, ResponsiveContainer, Tooltip as ReTooltip } from "recharts";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import type { Product, LaunchKitItem, Category } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import { getProductImage } from "@/lib/productImages";
import { PageLoader } from "@/components/ui/loader";

export default function LaunchKit() {
  const { user } = useAuth();
  const [budget] = useState(500000);

  const { data: kitItems = [], isLoading: kitLoading } = useQuery<LaunchKitItem[]>({
    queryKey: [`/api/kit-items/${user?.clientId}`],
    enabled: !!user?.clientId,
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categoriesData = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const categoryMap = Object.fromEntries(categoriesData.map(c => [c.id, c.name]));
  const productMap = Object.fromEntries(products.map(p => [p.id, p]));

  const cart = kitItems.map(item => ({
    kitItem: item,
    product: productMap[item.productId],
    quantity: item.quantity,
  })).filter(item => item.product);

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      if (quantity <= 0) return;
      await apiRequest("POST", "/api/kit-items", { clientId: user!.clientId, productId, quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/kit-items/${user?.clientId}`] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (kitItemId: number) => {
      await apiRequest("DELETE", `/api/kit-items/${kitItemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/kit-items/${user?.clientId}`] });
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/submissions", {
        clientId: user!.clientId,
        status: "pending",
        totalInvestment: totalInvestment,
        totalUnits: cart.reduce((acc, item) => acc + item.quantity, 0),
        budget: budget,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
      toast({ title: "Kit Submitted", description: "Your launch kit has been submitted for review." });
    },
  });

  const getPrice = (p: any) => p.storeLandingPrice ?? p.costPrice ?? 0;
  const getMrp = (p: any) => p.suggestedMrp ?? p.mrp ?? 0;

  const totalInvestment = cart.reduce((acc, item) => acc + (getPrice(item.product) * item.quantity), 0);
  const totalMRP = cart.reduce((acc, item) => acc + (getMrp(item.product) * item.quantity), 0);
  const potentialProfit = totalMRP - totalInvestment;
  const avgMargin = totalMRP > 0 ? (potentialProfit / totalMRP) * 100 : 0;
  
  const budgetUtilization = budget > 0 ? (totalInvestment / budget) * 100 : 0;

  const categoryData = cart.reduce((acc, item) => {
     const catName = categoryMap[item.product.categoryId] || "Other";
     const found = acc.find(x => x.name === catName);
     if (found) {
         found.value += getPrice(item.product) * item.quantity;
     } else {
         acc.push({ name: catName, value: getPrice(item.product) * item.quantity });
     }
     return acc;
  }, [] as {name: string, value: number}[]);

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  if (kitLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground" data-testid="text-kit-title">My Launch Kit</h1>
          <p className="text-muted-foreground">Review and submit your opening inventory order.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" data-testid="button-save-draft">Save Draft</Button>
            <Button onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending || cart.length === 0} data-testid="button-submit-review">Submit for Review</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Selected Products ({cart.length})</CardTitle>
                    <CardDescription>Adjust quantities to meet your budget.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {cart.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground" data-testid="text-empty-cart">No items in your launch kit. Browse the catalog to add products.</div>
                    ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Product</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="w-[120px]">Quantity</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cart.map((item) => (
                                <TableRow key={item.kitItem.id} data-testid={`row-kit-item-${item.kitItem.id}`}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded bg-muted overflow-hidden">
                                                {(() => {
                                                    const imgSrc = item.product.image || getProductImage(item.product.id, categoryMap[item.product.categoryId] || "");
                                                    return imgSrc ? (
                                                        <img src={imgSrc} alt={item.product.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-muted-foreground bg-muted">{item.product.name.slice(0,2).toUpperCase()}</div>
                                                    );
                                                })()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm line-clamp-1">{item.product.name}</div>
                                                <div className="text-xs text-muted-foreground">{categoryMap[item.product.categoryId] || "Other"}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                         <div className="text-sm font-medium">{formatCurrency(getPrice(item.product))}</div>
                                         <div className="text-xs text-muted-foreground">MRP: {formatCurrency(getMrp(item.product))}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number" 
                                            min="1"
                                            value={item.quantity} 
                                            onChange={(e) => {
                                              const val = parseInt(e.target.value) || 1;
                                              updateQuantityMutation.mutate({ productId: item.product.id, quantity: val });
                                            }}
                                            className="h-8 w-20"
                                            data-testid={`input-quantity-${item.kitItem.id}`}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {formatCurrency(getPrice(item.product) * item.quantity)}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItemMutation.mutate(item.kitItem.id)} data-testid={`button-remove-${item.kitItem.id}`}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>

             {cart.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle>Category Mix</CardTitle>
                    <CardDescription>Ensure you have a balanced variety.</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ReTooltip formatter={(value: number) => formatCurrency(value)} />
                        </RePieChart>
                     </ResponsiveContainer>
                </CardContent>
             </Card>
             )}
        </div>

        <div className="lg:col-span-1 space-y-6">
             <Card className="bg-primary/5 border-primary/20 sticky top-24">
                <CardHeader>
                    <CardTitle>Investment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                         <div className="flex justify-between text-sm">
                             <span>Budget Utilization</span>
                             <span data-testid="text-budget-util">{Math.round(budgetUtilization)}%</span>
                         </div>
                         <Progress value={budgetUtilization} className={budgetUtilization > 100 ? "text-destructive" : ""} />
                         <p className="text-xs text-muted-foreground">Budget: {formatCurrency(budget)}</p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Total Investment</span>
                            <span className="text-xl font-bold" data-testid="text-total-investment">{formatCurrency(totalInvestment)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                             <span className="text-muted-foreground">Total Retail Value (MRP)</span>
                             <span className="font-medium">{formatCurrency(totalMRP)}</span>
                        </div>
                         <div className="flex justify-between items-center text-green-700 dark:text-green-400">
                             <span className="font-medium">Potential Profit</span>
                             <span className="font-bold">{formatCurrency(potentialProfit)}</span>
                        </div>
                        <div className="pt-2">
                            <Badge variant="outline" className="w-full justify-center py-1 text-green-700 bg-green-50 dark:bg-green-900/10 dark:text-green-400 border-green-200">
                                {avgMargin.toFixed(1)}% Average Margin
                            </Badge>
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md flex gap-3 text-sm border border-amber-100 dark:border-amber-900">
                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                        <p className="text-amber-800 dark:text-amber-200">
                           You are ₹{Math.abs(budget - totalInvestment).toLocaleString()} {totalInvestment > budget ? 'over' : 'under'} your target budget.
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" size="lg" onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending || cart.length === 0} data-testid="button-submit-kit">Submit Kit for Review <ArrowRight className="h-4 w-4 ml-2" /></Button>
                </CardFooter>
             </Card>
        </div>
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, FileText, User } from "lucide-react";

export default function KitReviews() {
  // Mock pending reviews
  const pendingReviews = [
    {
       id: 1,
       client: "Rahul Sharma",
       store: "Jaipur Store",
       date: "Feb 12, 2024",
       totalItems: 450,
       totalValue: 525000,
       budgetUtilization: 105,
       items: [
         { name: "Premium Glass Water Bottle Set", qty: 50 },
         { name: "Stackable Storage Bins", qty: 20 },
         { name: "Others...", qty: 380 }
       ]
    },
    {
       id: 2,
       client: "Priya Patel",
       store: "Ahmedabad Store",
       date: "Feb 10, 2024",
       totalItems: 380,
       totalValue: 480000,
       budgetUtilization: 96,
       items: [
         { name: "Bamboo Bathroom Set", qty: 30 },
         { name: "Canvas Tote Bag", qty: 100 },
         { name: "Others...", qty: 250 }
       ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Launch Kit Reviews</h1>
        <p className="text-muted-foreground">Approve or reject inventory plans submitted by partners.</p>
      </div>

      <div className="grid gap-6">
        {pendingReviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
               <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                     <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <FileText className="h-6 w-6" />
                     </div>
                     <div>
                        <CardTitle>{review.client}</CardTitle>
                        <CardDescription>{review.store} • Submitted on {review.date}</CardDescription>
                     </div>
                  </div>
                  <Badge variant={review.budgetUtilization > 100 ? "destructive" : "secondary"}>
                     {review.budgetUtilization}% of Budget
                  </Badge>
               </div>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                   <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">Total Investment</p>
                      <p className="text-2xl font-bold">₹{review.totalValue.toLocaleString()}</p>
                   </div>
                   <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">Total Units</p>
                      <p className="text-2xl font-bold">{review.totalItems}</p>
                   </div>
                   <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                      <p className="text-sm text-muted-foreground mb-2">Key Items</p>
                      <ul className="text-sm space-y-1">
                         {review.items.map((item, idx) => (
                             <li key={idx} className="flex justify-between">
                                <span>{item.name}</span>
                                <span className="font-medium text-muted-foreground">x{item.qty}</span>
                             </li>
                         ))}
                      </ul>
                   </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 bg-muted/10 p-4">
                <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                    <X className="h-4 w-4 mr-2" /> Reject & Request Changes
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-2" /> Approve Order
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

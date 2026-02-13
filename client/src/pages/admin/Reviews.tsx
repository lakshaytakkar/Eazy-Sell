import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, FileText, User } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import type { LaunchKitSubmission, Client } from "@shared/schema";

export default function KitReviews() {
  const { data: submissions = [], isLoading } = useQuery<LaunchKitSubmission[]>({
    queryKey: ["/api/submissions"],
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const clientMap = Object.fromEntries(clients.map(c => [c.id, c]));

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/submissions/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
      toast({ title: "Updated", description: "Submission status updated." });
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64" data-testid="loading-state">Loading...</div>;
  }

  const pendingSubmissions = submissions.filter(s => s.status === "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold" data-testid="text-reviews-title">Launch Kit Reviews</h1>
        <p className="text-muted-foreground">Approve or reject inventory plans submitted by partners.</p>
      </div>

      {pendingSubmissions.length === 0 && (
        <div className="text-center py-12 text-muted-foreground" data-testid="text-empty-reviews">No pending reviews.</div>
      )}

      <div className="grid gap-6">
        {pendingSubmissions.map((submission) => {
          const client = clientMap[submission.clientId];
          const clientName = client?.name || `Client #${submission.clientId}`;
          const clientCity = client?.city || "";
          const budget = submission.budget ?? 500000;
          const totalInvestment = submission.totalInvestment ?? 0;
          const budgetUtilization = budget > 0 ? Math.round((totalInvestment / budget) * 100) : 0;

          return (
          <Card key={submission.id} data-testid={`card-review-${submission.id}`}>
            <CardHeader>
               <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                     <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <FileText className="h-6 w-6" />
                     </div>
                     <div>
                        <CardTitle data-testid={`text-review-client-${submission.id}`}>{clientName}</CardTitle>
                        <CardDescription>{clientCity ? `${clientCity} Store • ` : ""}Submitted {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : "N/A"}</CardDescription>
                     </div>
                  </div>
                  <Badge variant={budgetUtilization > 100 ? "destructive" : "secondary"} data-testid={`badge-budget-${submission.id}`}>
                     {budgetUtilization}% of Budget
                  </Badge>
               </div>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                   <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">Total Investment</p>
                      <p className="text-2xl font-bold" data-testid={`text-investment-${submission.id}`}>₹{totalInvestment.toLocaleString()}</p>
                   </div>
                   <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">Total Units</p>
                      <p className="text-2xl font-bold" data-testid={`text-units-${submission.id}`}>{submission.totalUnits ?? 0}</p>
                   </div>
                   <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="text-2xl font-bold">₹{budget.toLocaleString()}</p>
                   </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 bg-muted/10 p-4">
                <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10" onClick={() => updateMutation.mutate({ id: submission.id, status: "rejected" })} disabled={updateMutation.isPending} data-testid={`button-reject-${submission.id}`}>
                    <X className="h-4 w-4 mr-2" /> Reject & Request Changes
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => updateMutation.mutate({ id: submission.id, status: "approved" })} disabled={updateMutation.isPending} data-testid={`button-approve-${submission.id}`}>
                    <Check className="h-4 w-4 mr-2" /> Approve Order
                </Button>
            </CardFooter>
          </Card>
          );
        })}
      </div>
    </div>
  );
}
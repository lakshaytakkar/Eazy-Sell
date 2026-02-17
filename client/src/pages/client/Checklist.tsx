import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ClipboardCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ReadinessChecklistItem, ReadinessChecklistStatus } from "@shared/schema";

export default function ClientChecklist() {
  const { data: items = [], isLoading: itemsLoading } = useQuery<ReadinessChecklistItem[]>({
    queryKey: ["/api/checklist/items"],
  });

  const { data: statuses = [], isLoading: statusLoading } = useQuery<ReadinessChecklistStatus[]>({
    queryKey: ["/api/checklist/1"],
  });

  const isLoading = itemsLoading || statusLoading;

  if (isLoading) {
    return <div className="flex items-center justify-center h-64" data-testid="loading-state">Loading...</div>;
  }

  const completedIds = new Set(statuses.filter(s => s.completed).map(s => s.itemId));
  const totalItems = items.length;
  const completedCount = completedIds.size;
  const progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const categories = Array.from(new Set(items.map(i => i.category)));

  const getCategoryProgress = (category: string) => {
    const catItems = items.filter(i => i.category === category);
    const catCompleted = catItems.filter(i => completedIds.has(i.id)).length;
    return { total: catItems.length, completed: catCompleted, percent: catItems.length > 0 ? Math.round((catCompleted / catItems.length) * 100) : 0 };
  };

  const getCategoryIcon = (category: string) => {
    const prog = getCategoryProgress(category);
    if (prog.percent === 100) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (prog.percent > 0) return <Circle className="h-5 w-5 text-amber-500" />;
    return <Circle className="h-5 w-5 text-muted-foreground/40" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold" data-testid="text-checklist-title">Store Readiness Checklist</h1>
        <p className="text-muted-foreground">Track everything you need before your grand opening.</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold text-lg">Overall Readiness</p>
                <p className="text-sm text-muted-foreground">{completedCount} of {totalItems} items completed</p>
              </div>
            </div>
            <Badge
              className={`text-lg px-4 py-1 ${progress === 100 ? 'bg-green-100 text-green-700' : progress >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}
              variant="outline"
              data-testid="badge-progress"
            >
              {progress}%
            </Badge>
          </div>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const catProg = getCategoryProgress(category);
          const catItems = items.filter(i => i.category === category).sort((a, b) => a.sortOrder - b.sortOrder);

          return (
            <Card key={category}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <CardTitle className="text-base">{category}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs" data-testid={`badge-category-${category}`}>
                    {catProg.completed}/{catProg.total}
                  </Badge>
                </div>
                <Progress value={catProg.percent} className="h-1.5 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {catItems.map((item) => {
                    const isCompleted = completedIds.has(item.id);
                    return (
                      <div key={item.id} className="flex items-center gap-3" data-testid={`checklist-item-${item.id}`}>
                        <Checkbox
                          checked={isCompleted}
                          disabled
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                        <span className={`text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {totalItems === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ClipboardCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground" data-testid="text-empty-checklist">Your readiness checklist will appear here once your store launch process begins.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

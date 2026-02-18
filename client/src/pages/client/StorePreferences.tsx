import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import type { Client } from "@shared/schema";
import { PageLoader } from "@/components/ui/loader";
import CategoryMixSlider from "@/components/CategoryMixSlider";

export default function StorePreferences() {
  const { user } = useAuth();
  const { data: client, isLoading } = useQuery<Client>({
    queryKey: ['/api/clients', user?.clientId],
    enabled: !!user?.clientId,
  });

  if (isLoading || !client) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold" data-testid="text-preferences-title">Category Mix Preferences</h1>
        <p className="text-muted-foreground mt-1" data-testid="text-preferences-description">
          Customize how your inventory budget is distributed across categories
        </p>
      </div>

      <CategoryMixSlider
        clientId={client.id}
        budget={client.inventoryBudget}
        storeType={client.storeType}
      />
    </div>
  );
}

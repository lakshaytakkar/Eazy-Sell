import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PageLoader } from "@/components/ui/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { STORE_TYPES, MARKET_TYPES, STORE_FLOORS, insertClientSchema } from "@shared/schema";
import type { Client } from "@shared/schema";
import CategoryMixSlider from "@/components/CategoryMixSlider";
import { Check, ChevronLeft, ChevronRight, User, Store, Ruler, Package, ClipboardCheck, Pencil } from "lucide-react";

const STEPS = [
  { label: "Your Details", icon: User },
  { label: "Store Identity", icon: Store },
  { label: "Store Dimensions", icon: Ruler },
  { label: "Inventory Preferences", icon: Package },
  { label: "Review & Confirm", icon: ClipboardCheck },
];

const step1Schema = insertClientSchema.pick({
  name: true,
  phone: true,
  email: true,
  city: true,
  state: true,
});

const step2Schema = insertClientSchema.pick({
  storeName: true,
  storeType: true,
  marketType: true,
  storeFloor: true,
});

const step3Schema = insertClientSchema.pick({
  storeAddress: true,
  storeArea: true,
  storeFrontage: true,
  monthlyRent: true,
  expectedFootfall: true,
  operatingHours: true,
  nearbyLandmark: true,
});

const step4Schema = insertClientSchema.pick({
  inventoryBudget: true,
});

function formatINR(amount: number | null | undefined): string {
  if (!amount) return "";
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function ClientOnboarding() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);

  const { data: client, isLoading } = useQuery<Client>({
    queryKey: ['/api/clients', user?.clientId],
    enabled: !!user?.clientId,
  });

  useEffect(() => {
    if (client && client.onboardingStep > 0 && client.onboardingStep < 5) {
      setCurrentStep(client.onboardingStep);
    }
  }, [client]);

  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      await apiRequest("PATCH", `/api/clients/${user?.clientId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients', user?.clientId] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save. Please try again.", variant: "destructive" });
    },
  });

  const handleNext = async (stepData: Record<string, unknown>) => {
    const nextStep = currentStep + 1;
    await saveMutation.mutateAsync({ ...stepData, onboardingStep: nextStep });
    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleComplete = async () => {
    await saveMutation.mutateAsync({ profileCompleted: true, onboardingStep: 5 });
    toast({ title: "Setup Complete", description: "Your store profile has been set up successfully." });
    setLocation("/client/dashboard");
  };

  if (isLoading || !client) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-onboarding-title">
          Store Onboarding
        </h1>
        <p className="text-muted-foreground mt-1">Complete your profile to get started</p>
      </div>

      <div className="flex items-center justify-between gap-1" data-testid="step-indicator">
        {STEPS.map((step, index) => {
          const StepIcon = step.icon;
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <div key={step.label} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
              <div className="flex items-center w-full">
                {index > 0 && (
                  <div className={`flex-1 h-0.5 ${isComplete ? 'bg-primary' : 'bg-muted'}`} />
                )}
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full border-2 shrink-0 transition-colors ${
                    isComplete
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isCurrent
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-muted text-muted-foreground'
                  }`}
                  data-testid={`step-dot-${index}`}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 ${isComplete ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
              <span className={`text-[10px] font-medium text-center leading-tight ${
                isCurrent ? 'text-primary' : isComplete ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {currentStep === 0 && (
        <Step1Form client={client} onNext={handleNext} isPending={saveMutation.isPending} />
      )}
      {currentStep === 1 && (
        <Step2Form client={client} onNext={handleNext} onBack={handleBack} isPending={saveMutation.isPending} />
      )}
      {currentStep === 2 && (
        <Step3Form client={client} onNext={handleNext} onBack={handleBack} isPending={saveMutation.isPending} />
      )}
      {currentStep === 3 && (
        <Step4Form client={client} onNext={handleNext} onBack={handleBack} isPending={saveMutation.isPending} />
      )}
      {currentStep === 4 && (
        <Step5Review
          client={client}
          onBack={handleBack}
          onComplete={handleComplete}
          onEditStep={setCurrentStep}
          isPending={saveMutation.isPending}
        />
      )}
    </div>
  );
}

function Step1Form({ client, onNext, isPending }: { client: Client; onNext: (data: Record<string, unknown>) => void; isPending: boolean }) {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: client.name || user?.name || "",
      phone: client.phone || user?.phone || "",
      email: client.email || user?.email || "",
      city: client.city || user?.city || "",
      state: client.state || "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => onNext(data))} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Your full name" data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="+91 98765 43210" data-testid="input-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} type="email" placeholder="name@example.com" data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Mumbai" data-testid="input-city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="Maharashtra" data-testid="input-state" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending} data-testid="button-next">
                {isPending ? 'Saving...' : 'Next'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function Step2Form({ client, onNext, onBack, isPending }: { client: Client; onNext: (data: Record<string, unknown>) => void; onBack: () => void; isPending: boolean }) {
  const form = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      storeName: client.storeName || "",
      storeType: client.storeType || "",
      marketType: client.marketType || "",
      storeFloor: client.storeFloor || "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Identity</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => onNext(data))} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="My Awesome Store" data-testid="input-storeName" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Type</FormLabel>
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger data-testid="select-storeType">
                          <SelectValue placeholder="Select store type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STORE_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Type</FormLabel>
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger data-testid="select-marketType">
                          <SelectValue placeholder="Select market type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MARKET_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storeFloor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Floor</FormLabel>
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger data-testid="select-storeFloor">
                          <SelectValue placeholder="Select floor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STORE_FLOORS.map((f) => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onBack} data-testid="button-back">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button type="submit" disabled={isPending} data-testid="button-next">
                {isPending ? 'Saving...' : 'Next'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function Step3Form({ client, onNext, onBack, isPending }: { client: Client; onNext: (data: Record<string, unknown>) => void; onBack: () => void; isPending: boolean }) {
  const form = useForm<z.infer<typeof step3Schema>>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      storeAddress: client.storeAddress || "",
      storeArea: client.storeArea || undefined,
      storeFrontage: client.storeFrontage || undefined,
      monthlyRent: client.monthlyRent || undefined,
      expectedFootfall: client.expectedFootfall || undefined,
      operatingHours: client.operatingHours || "",
      nearbyLandmark: client.nearbyLandmark || "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Dimensions</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => onNext(data))} className="space-y-5">
            <FormField
              control={form.control}
              name="storeAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Address</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Full store address" data-testid="input-storeAddress" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="storeArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Area (sq ft)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="500"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        data-testid="input-storeArea"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storeFrontage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Frontage (ft)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="20"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        data-testid="input-storeFrontage"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyRent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Rent (INR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50000"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        data-testid="input-monthlyRent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expectedFootfall"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Daily Footfall</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        data-testid="input-expectedFootfall"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="operatingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operating Hours</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="10 AM - 9 PM" data-testid="input-operatingHours" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nearbyLandmark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nearby Landmark</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="Near City Mall" data-testid="input-nearbyLandmark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onBack} data-testid="button-back">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button type="submit" disabled={isPending} data-testid="button-next">
                {isPending ? 'Saving...' : 'Next'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function Step4Form({ client, onNext, onBack, isPending }: { client: Client; onNext: (data: Record<string, unknown>) => void; onBack: () => void; isPending: boolean }) {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof step4Schema>>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      inventoryBudget: client.inventoryBudget || undefined,
    },
  });

  const budgetValue = form.watch("inventoryBudget");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inventory Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => onNext(data))} className="space-y-5">
              <FormField
                control={form.control}
                name="inventoryBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventory Budget (INR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="500000"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        data-testid="input-inventoryBudget"
                      />
                    </FormControl>
                    {budgetValue && (
                      <p className="text-xs text-muted-foreground" data-testid="text-budget-formatted">
                        Budget: {formatINR(budgetValue)}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onBack} data-testid="button-back">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button type="submit" disabled={isPending} data-testid="button-next">
                  {isPending ? 'Saving...' : 'Next'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {user?.clientId && (
        <Card>
          <CardHeader>
            <CardTitle>Category Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryMixSlider
              clientId={user.clientId}
              budget={budgetValue || client.inventoryBudget || null}
              storeType={client.storeType || null}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Step5Review({
  client,
  onBack,
  onComplete,
  onEditStep,
  isPending,
}: {
  client: Client;
  onBack: () => void;
  onComplete: () => void;
  onEditStep: (step: number) => void;
  isPending: boolean;
}) {
  const sections = [
    {
      title: "Your Details",
      step: 0,
      fields: [
        { label: "Name", value: client.name },
        { label: "Phone", value: client.phone },
        { label: "Email", value: client.email },
        { label: "City", value: client.city },
        { label: "State", value: client.state },
      ],
    },
    {
      title: "Store Identity",
      step: 1,
      fields: [
        { label: "Store Name", value: client.storeName },
        { label: "Store Type", value: client.storeType },
        { label: "Market Type", value: client.marketType },
        { label: "Store Floor", value: client.storeFloor },
      ],
    },
    {
      title: "Store Dimensions",
      step: 2,
      fields: [
        { label: "Address", value: client.storeAddress },
        { label: "Area", value: client.storeArea ? `${client.storeArea} sq ft` : null },
        { label: "Frontage", value: client.storeFrontage ? `${client.storeFrontage} ft` : null },
        { label: "Monthly Rent", value: client.monthlyRent ? formatINR(client.monthlyRent) : null },
        { label: "Expected Footfall", value: client.expectedFootfall ? `${client.expectedFootfall}/day` : null },
        { label: "Operating Hours", value: client.operatingHours },
        { label: "Nearby Landmark", value: client.nearbyLandmark },
      ],
    },
    {
      title: "Inventory Preferences",
      step: 3,
      fields: [
        { label: "Budget", value: client.inventoryBudget ? formatINR(client.inventoryBudget) : null },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{section.title}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditStep(section.step)}
                  data-testid={`button-edit-step-${section.step}`}
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-lg border bg-muted/30">
                {section.fields.map((f) => (
                  <div key={f.label}>
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    <p className="text-sm font-medium" data-testid={`review-${f.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {f.value || <span className="text-muted-foreground/50 italic">Not provided</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} data-testid="button-back">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button onClick={onComplete} disabled={isPending} data-testid="button-complete-setup">
          {isPending ? 'Completing...' : 'Complete Setup'}
          <Check className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Building, CreditCard, Save, Pencil, X, Phone, Mail, ShieldCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { getScoreLabel, PACKAGES } from "@shared/schema";
import type { Client } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/loader";

function formatINR(amount: number | null | undefined): string {
  if (!amount) return "₹0";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export default function ClientProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: client, isLoading } = useQuery<Client>({
    queryKey: [`/api/clients/${user?.clientId}`],
    enabled: !!user?.clientId,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const res = await fetch(`/api/clients/${user?.clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${user?.clientId}`] });
      toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
      setEditing(false);
      setErrors({});
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save your profile. Please try again.", variant: "destructive" });
    },
  });

  if (isLoading || !client) {
    return <PageLoader />;
  }

  const startEditing = () => {
    setFormData({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      city: client.city || "",
      state: client.state || "",
      storeAddress: client.storeAddress || "",
      storeArea: client.storeArea?.toString() || "",
      storeFrontage: client.storeFrontage?.toString() || "",
      managerName: client.managerName || "",
      managerPhone: client.managerPhone || "",
      gstNumber: client.gstNumber || "",
      panNumber: client.panNumber || "",
      bankName: client.bankName || "",
      bankAccountNumber: client.bankAccountNumber || "",
      bankIfsc: client.bankIfsc || "",
    });
    setErrors({});
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setFormData({});
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.city?.trim()) newErrors.city = "City is required";

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.phone && !/^[\d\s\+\-()]{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    if (formData.managerPhone && !/^[\d\s\+\-()]{7,15}$/.test(formData.managerPhone)) {
      newErrors.managerPhone = "Invalid phone number";
    }
    if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
      newErrors.gstNumber = "Invalid GST format (e.g., 22AAAAA0000A1Z5)";
    }
    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)";
    }
    if (formData.bankIfsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bankIfsc)) {
      newErrors.bankIfsc = "Invalid IFSC format (e.g., SBIN0001234)";
    }
    if (formData.storeArea && isNaN(Number(formData.storeArea))) {
      newErrors.storeArea = "Must be a number";
    }
    if (formData.storeFrontage && isNaN(Number(formData.storeFrontage))) {
      newErrors.storeFrontage = "Must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const payload: Record<string, any> = {
      name: formData.name.trim(),
      email: formData.email?.trim() || null,
      phone: formData.phone?.trim() || null,
      city: formData.city.trim(),
      state: formData.state?.trim() || null,
      storeAddress: formData.storeAddress?.trim() || null,
      storeArea: formData.storeArea ? Number(formData.storeArea) : null,
      storeFrontage: formData.storeFrontage ? Number(formData.storeFrontage) : null,
      managerName: formData.managerName?.trim() || null,
      managerPhone: formData.managerPhone?.trim() || null,
      gstNumber: formData.gstNumber?.trim() || null,
      panNumber: formData.panNumber?.trim() || null,
      bankName: formData.bankName?.trim() || null,
      bankAccountNumber: formData.bankAccountNumber?.trim() || null,
      bankIfsc: formData.bankIfsc?.trim() || null,
    };

    updateMutation.mutate(payload);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const scoreInfo = getScoreLabel(client.totalScore);
  const selectedPkg = PACKAGES.find(p => p.id === client.selectedPackage);

  const renderField = (label: string, field: string, value: string | null | undefined, opts?: { placeholder?: string; type?: string; readonly?: boolean; suffix?: string }) => {
    if (editing && !opts?.readonly) {
      return (
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">{label}</Label>
          <div className="relative">
            <Input
              value={formData[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={opts?.placeholder || label}
              type={opts?.type || "text"}
              className={errors[field] ? "border-destructive" : ""}
              data-testid={`input-${field}`}
            />
            {opts?.suffix && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{opts.suffix}</span>
            )}
          </div>
          {errors[field] && <p className="text-xs text-destructive">{errors[field]}</p>}
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm font-medium" data-testid={`text-${field}`}>
          {value || <span className="text-muted-foreground/50 italic">Not provided</span>}
          {value && opts?.suffix ? ` ${opts.suffix}` : ""}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal and store details</p>
        </div>
        {!editing ? (
          <Button onClick={startEditing} data-testid="button-edit-profile">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={cancelEditing} data-testid="button-cancel-edit">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending} data-testid="button-save-profile">
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Personal Information</CardTitle>
              </div>
              <CardDescription>Your contact details and identity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {renderField("Full Name", "name", client.name, { placeholder: "Your full name" })}
                {renderField("Email Address", "email", client.email, { placeholder: "name@example.com", type: "email" })}
                {renderField("Phone Number", "phone", client.phone, { placeholder: "+91 98765 43210" })}
                {renderField("City", "city", client.city, { placeholder: "Mumbai" })}
                {renderField("State", "state", client.state, { placeholder: "Maharashtra" })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle>Store Details</CardTitle>
              </div>
              <CardDescription>Your store location and dimensions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {renderField("Store Address", "storeAddress", client.storeAddress, { placeholder: "Full store address" })}
                {renderField("Store Area", "storeArea", client.storeArea?.toString(), { placeholder: "500", suffix: "sq ft" })}
                {renderField("Store Frontage", "storeFrontage", client.storeFrontage?.toString(), { placeholder: "20", suffix: "ft" })}
                {renderField("Store Manager Name", "managerName", client.managerName, { placeholder: "Manager name" })}
                {renderField("Manager Phone", "managerPhone", client.managerPhone, { placeholder: "+91 98765 43210" })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle>Business Information</CardTitle>
              </div>
              <CardDescription>Tax and banking details for invoicing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {renderField("GST Number", "gstNumber", client.gstNumber, { placeholder: "22AAAAA0000A1Z5" })}
                {renderField("PAN Number", "panNumber", client.panNumber, { placeholder: "ABCDE1234F" })}
              </div>
              <Separator className="my-5" />
              <h4 className="text-sm font-semibold text-muted-foreground mb-4">Bank Account Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {renderField("Bank Name", "bankName", client.bankName, { placeholder: "State Bank of India" })}
                {renderField("Account Number", "bankAccountNumber", client.bankAccountNumber, { placeholder: "1234567890" })}
                {renderField("IFSC Code", "bankIfsc", client.bankIfsc, { placeholder: "SBIN0001234" })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                <CardTitle>Program Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Stage</p>
                <Badge variant="outline" className="text-sm" data-testid="badge-stage">{client.stage}</Badge>
              </div>

              {selectedPkg && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Package</p>
                  <Badge className="bg-primary/10 text-primary border-primary/20" data-testid="badge-package">
                    {selectedPkg.name} ({selectedPkg.range})
                  </Badge>
                </div>
              )}

              {client.totalScore != null && client.totalScore > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Lead Score</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold" data-testid="text-score">{client.totalScore}/18</span>
                    <Badge className={scoreInfo.color}>{scoreInfo.emoji} {scoreInfo.label}</Badge>
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Investment</p>
                <p className="text-lg font-bold" data-testid="text-investment">{formatINR(client.totalInvestment)}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Paid</p>
                  <p className="text-sm font-semibold text-green-600" data-testid="text-paid">{formatINR(client.totalPaid)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Due</p>
                  <p className="text-sm font-semibold text-red-600" data-testid="text-due">{formatINR(client.totalDue)}</p>
                </div>
              </div>

              {client.estimatedLaunchDate && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estimated Launch</p>
                    <p className="text-sm font-medium" data-testid="text-launch-date">{client.estimatedLaunchDate}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Milestones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Qualification Form", done: client.qualificationFormCompleted },
                { label: "Scope Document Shared", done: client.scopeDocShared },
                { label: "Agreement Signed", done: client.agreementSigned },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${m.done ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                  <span className={`text-sm ${m.done ? "text-foreground" : "text-muted-foreground"}`}>{m.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

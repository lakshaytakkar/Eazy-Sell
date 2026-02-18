import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Settings, Pencil, Check, X, Save, RefreshCw } from "lucide-react";
import type { PriceSetting, Category } from "@shared/schema";
import { Loader } from "@/components/ui/loader";

const INR = (v: number | null | undefined) =>
  v != null ? `₹${v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—";

interface SettingFieldDef {
  key: string;
  label: string;
  defaultValue: string;
  prefix?: string;
  suffix?: string;
}

const SECTIONS: { title: string; note?: string; fields: SettingFieldDef[] }[] = [
  {
    title: "Exchange Rate & Sourcing",
    fields: [
      { key: "exchange_rate", label: "Yuan to INR Exchange Rate", defaultValue: "12.0", prefix: "₹" },
      { key: "sourcing_commission", label: "Sourcing Commission %", defaultValue: "5", suffix: "%" },
    ],
  },
  {
    title: "Logistics",
    fields: [
      { key: "freight_per_cbm", label: "Freight Rate per CBM in INR", defaultValue: "8000", prefix: "₹" },
      { key: "insurance_percent", label: "Insurance % of FOB", defaultValue: "0.5", suffix: "%" },
    ],
  },
  {
    title: "Duties & Taxes",
    note: "Category-level Customs Duty and IGST rates are managed below",
    fields: [
      { key: "sw_surcharge_percent", label: "Social Welfare Surcharge %", defaultValue: "10", suffix: "%" },
    ],
  },
  {
    title: "Our Margin",
    fields: [
      { key: "our_markup_percent", label: "Our Markup %", defaultValue: "25", suffix: "%" },
      { key: "target_store_margin", label: "Target Store Margin % for MRP suggestion", defaultValue: "50", suffix: "%" },
    ],
  },
];

function InlineEditField({
  setting,
  fieldDef,
  onSaved,
}: {
  setting: PriceSetting | undefined;
  fieldDef: SettingFieldDef;
  onSaved: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const currentValue = setting?.value ?? fieldDef.defaultValue;

  const saveMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: fieldDef.key,
        value,
        label: fieldDef.label,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      setEditing(false);
      onSaved();
    },
    onError: (err: Error) => {
      toast({ title: "Error saving setting", description: err.message, variant: "destructive" });
    },
  });

  const startEdit = () => {
    setEditValue(currentValue);
    setEditing(true);
  };

  const saveEdit = () => {
    if (editValue.trim() && editValue !== currentValue) {
      saveMutation.mutate(editValue.trim());
    } else {
      setEditing(false);
    }
  };

  const cancelEdit = () => setEditing(false);

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0" data-testid={`setting-field-${fieldDef.key}`}>
      <div className="flex-1">
        <Label className="text-sm text-muted-foreground">{fieldDef.label}</Label>
        {editing ? (
          <div className="flex items-center gap-2 mt-1">
            {fieldDef.prefix && <span className="text-sm font-medium">{fieldDef.prefix}</span>}
            <Input
              data-testid={`input-setting-${fieldDef.key}`}
              type="number"
              step="any"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              onBlur={saveEdit}
              className="w-32 h-8"
              autoFocus
            />
            {fieldDef.suffix && <span className="text-sm font-medium">{fieldDef.suffix}</span>}
            <Button
              data-testid={`button-save-setting-${fieldDef.key}`}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-green-600"
              onMouseDown={(e) => e.preventDefault()}
              onClick={saveEdit}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              data-testid={`button-cancel-setting-${fieldDef.key}`}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-red-600"
              onMouseDown={(e) => e.preventDefault()}
              onClick={cancelEdit}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 mt-1 cursor-pointer group"
            onClick={startEdit}
            data-testid={`value-setting-${fieldDef.key}`}
          >
            <span className="text-2xl font-bold text-foreground">
              {fieldDef.prefix}{currentValue}{fieldDef.suffix}
            </span>
            <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryDutyTable() {
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ customsDutyPercent: "", igstPercent: "", hsCode: "" });

  const patchMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { customsDutyPercent: number; igstPercent: number; hsCode: string } }) => {
      const res = await apiRequest("PATCH", `/api/categories/${id}`, data);
      return res.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingId(null);
      const count = result.recalculatedProducts ?? 0;
      toast({
        title: "Category updated",
        description: `${count} product${count !== 1 ? "s" : ""} recalculated with new duty/GST rates.`,
      });
    },
    onError: (err: Error) => {
      toast({ title: "Error updating category", description: err.message, variant: "destructive" });
    },
  });

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditData({
      customsDutyPercent: String(cat.customsDutyPercent),
      igstPercent: String(cat.igstPercent),
      hsCode: cat.hsCode || "",
    });
  };

  const saveEdit = (id: number) => {
    patchMutation.mutate({
      id,
      data: {
        customsDutyPercent: parseFloat(editData.customsDutyPercent) || 0,
        igstPercent: parseFloat(editData.igstPercent) || 0,
        hsCode: editData.hsCode,
      },
    });
  };

  if (isLoading) {
    return <Loader className="py-8" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Category Duty & GST Rates</CardTitle>
      </CardHeader>
      <CardContent>
        <Table data-testid="table-category-duty">
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Customs Duty %</TableHead>
              <TableHead>IGST %</TableHead>
              <TableHead>HS Code</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id} data-testid={`row-category-${cat.id}`}>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell>
                  {editingId === cat.id ? (
                    <Input
                      data-testid={`input-duty-${cat.id}`}
                      type="number"
                      step="any"
                      value={editData.customsDutyPercent}
                      onChange={(e) => setEditData((d) => ({ ...d, customsDutyPercent: e.target.value }))}
                      className="w-20 h-8"
                    />
                  ) : (
                    <Badge variant="outline" data-testid={`text-duty-${cat.id}`}>{cat.customsDutyPercent}%</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === cat.id ? (
                    <Input
                      data-testid={`input-igst-${cat.id}`}
                      type="number"
                      step="any"
                      value={editData.igstPercent}
                      onChange={(e) => setEditData((d) => ({ ...d, igstPercent: e.target.value }))}
                      className="w-20 h-8"
                    />
                  ) : (
                    <Badge variant="outline" data-testid={`text-igst-${cat.id}`}>{cat.igstPercent}%</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === cat.id ? (
                    <Input
                      data-testid={`input-hscode-${cat.id}`}
                      type="text"
                      value={editData.hsCode}
                      onChange={(e) => setEditData((d) => ({ ...d, hsCode: e.target.value }))}
                      className="w-28 h-8"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground" data-testid={`text-hscode-${cat.id}`}>
                      {cat.hsCode || "—"}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === cat.id ? (
                    <div className="flex gap-1">
                      <Button
                        data-testid={`button-save-category-${cat.id}`}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-green-600"
                        onClick={() => saveEdit(cat.id)}
                        disabled={patchMutation.isPending}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        data-testid={`button-cancel-category-${cat.id}`}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-600"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      data-testid={`button-edit-category-${cat.id}`}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => startEdit(cat)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function AdminSettings() {
  const { data: settings = [], isLoading } = useQuery<PriceSetting[]>({
    queryKey: ["/api/settings"],
  });

  const [showRecalcDialog, setShowRecalcDialog] = useState(false);
  const [recalculating, setRecalculating] = useState(false);

  const settingsMap = settings.reduce<Record<string, PriceSetting>>((acc, s) => {
    acc[s.key] = s;
    return acc;
  }, {});

  const handleSettingSaved = () => {
    setShowRecalcDialog(true);
  };

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      const res = await apiRequest("POST", "/api/recalculate-all");
      const result = await res.json();
      toast({
        title: "Recalculation complete",
        description: result.message || `${result.count} products recalculated.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    } catch (err: any) {
      toast({ title: "Recalculation failed", description: err.message, variant: "destructive" });
    } finally {
      setRecalculating(false);
      setShowRecalcDialog(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="page-admin-settings">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-red-600" />
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Price Settings</h1>
          <p className="text-muted-foreground">Manage global pricing parameters and category duty rates</p>
        </div>
      </div>

      {isLoading ? (
        <Loader className="py-12" />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {SECTIONS.map((section) => (
            <Card key={section.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{section.title}</CardTitle>
                {section.note && (
                  <p className="text-sm text-muted-foreground">{section.note}</p>
                )}
              </CardHeader>
              <CardContent>
                {section.fields.map((field) => (
                  <InlineEditField
                    key={field.key}
                    setting={settingsMap[field.key]}
                    fieldDef={field}
                    onSaved={handleSettingSaved}
                  />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CategoryDutyTable />

      <Dialog open={showRecalcDialog} onOpenChange={setShowRecalcDialog}>
        <DialogContent data-testid="dialog-recalculate">
          <DialogHeader>
            <DialogTitle>Recalculate all product prices?</DialogTitle>
            <DialogDescription>
              You've updated a pricing setting. Would you like to recalculate all product prices now using the updated parameters?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              data-testid="button-cancel-recalculate"
              variant="outline"
              onClick={() => setShowRecalcDialog(false)}
              disabled={recalculating}
            >
              Skip
            </Button>
            <Button
              data-testid="button-confirm-recalculate"
              onClick={handleRecalculate}
              disabled={recalculating}
              className="bg-red-600 hover:bg-red-700"
            >
              {recalculating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Recalculating...
                </>
              ) : (
                "Recalculate All"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Edit, Plus, Search, Trash2, Upload, X, Check, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Package, TrendingUp, Layers, BarChart3, Filter } from "lucide-react";
import { useState, useMemo, useCallback, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { calculatePrices, getMrpOptions, type PriceInputs } from "@/lib/priceEngine";
import type { Product, Category, InsertProduct } from "@shared/schema";
import { PRODUCT_TAGS } from "@shared/schema";
import { getProductImage } from "@/lib/productImages";
import { PageLoader } from "@/components/ui/loader";

const STATUS_OPTIONS = ["Active", "Draft", "Discontinued"] as const;

const INR = (v: number | null | undefined) =>
  v != null ? `₹${v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—";

const YUAN = (v: number) => `¥${v.toFixed(2)}`;

interface FormState {
  name: string;
  categoryId: string;
  image: string;
  tags: string[];
  status: string;
  supplierName: string;
  moq: string;
  exwPriceYuan: string;
  unitsPerCarton: string;
  cartonLengthCm: string;
  cartonWidthCm: string;
  cartonHeightCm: string;
  cartonWeightKg: string;
  hsCode: string;
}

const emptyForm: FormState = {
  name: "",
  categoryId: "",
  image: "",
  tags: [],
  status: "Active",
  supplierName: "",
  moq: "",
  exwPriceYuan: "",
  unitsPerCarton: "1",
  cartonLengthCm: "",
  cartonWidthCm: "",
  cartonHeightCm: "",
  cartonWeightKg: "",
  hsCode: "",
};

function productToForm(p: Product): FormState {
  return {
    name: p.name,
    categoryId: String(p.categoryId),
    image: p.image || "",
    tags: p.tags || [],
    status: p.status,
    supplierName: p.supplierName || "",
    moq: p.moq != null ? String(p.moq) : "",
    exwPriceYuan: String(p.exwPriceYuan),
    unitsPerCarton: String(p.unitsPerCarton),
    cartonLengthCm: String(p.cartonLengthCm),
    cartonWidthCm: String(p.cartonWidthCm),
    cartonHeightCm: String(p.cartonHeightCm),
    cartonWeightKg: p.cartonWeightKg != null ? String(p.cartonWeightKg) : "",
    hsCode: p.hsCode || "",
  };
}

function formToPayload(f: FormState): InsertProduct {
  return {
    name: f.name,
    categoryId: Number(f.categoryId),
    image: f.image || null,
    tags: f.tags.length > 0 ? f.tags : [],
    status: f.status,
    supplierName: f.supplierName || null,
    moq: f.moq ? Number(f.moq) : null,
    exwPriceYuan: Number(f.exwPriceYuan) || 0,
    unitsPerCarton: Number(f.unitsPerCarton) || 1,
    cartonLengthCm: Number(f.cartonLengthCm) || 0,
    cartonWidthCm: Number(f.cartonWidthCm) || 0,
    cartonHeightCm: Number(f.cartonHeightCm) || 0,
    cartonWeightKg: f.cartonWeightKg ? Number(f.cartonWeightKg) : null,
    hsCode: f.hsCode || null,
  };
}

type SortField = "name" | "storeLandingPrice" | "suggestedMrp" | "storeMarginPercent" | "exwPriceYuan";
type SortDir = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [selectedMrp, setSelectedMrp] = useState<number | null>(null);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [csvData, setCsvData] = useState<InsertProduct[]>([]);
  const [csvFileName, setCsvFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMargin, setFilterMargin] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: settingsMap = {} } = useQuery<Record<string, number>>({
    queryKey: ["/api/settings/map"],
  });

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  );

  const updateField = useCallback(
    (field: keyof FormState, value: string | string[]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setSelectedMrp(null);
    },
    []
  );

  const priceResult = useMemo(() => {
    const cat = categoryMap[Number(form.categoryId)];
    if (
      !form.exwPriceYuan ||
      !form.categoryId ||
      !settingsMap.exchange_rate
    )
      return null;

    const inputs: PriceInputs = {
      exwPriceYuan: Number(form.exwPriceYuan) || 0,
      unitsPerCarton: Number(form.unitsPerCarton) || 1,
      cartonLengthCm: Number(form.cartonLengthCm) || 0,
      cartonWidthCm: Number(form.cartonWidthCm) || 0,
      cartonHeightCm: Number(form.cartonHeightCm) || 0,
      categoryDutyPercent: cat?.customsDutyPercent ?? 0,
      categoryIgstPercent: cat?.igstPercent ?? 18,
      exchangeRate: settingsMap.exchange_rate ?? 12,
      sourcingCommission: settingsMap.sourcing_commission ?? 7,
      freightPerCbm: settingsMap.freight_per_cbm ?? 6000,
      insurancePercent: settingsMap.insurance_percent ?? 1.125,
      swSurchargePercent: settingsMap.sw_surcharge_percent ?? 10,
      ourMarkupPercent: settingsMap.our_markup_percent ?? 20,
      targetStoreMargin: settingsMap.target_store_margin ?? 45,
    };
    return calculatePrices(inputs);
  }, [form, categoryMap, settingsMap]);

  const mrpOptions = useMemo(() => {
    if (!priceResult) return [];
    return getMrpOptions(priceResult.storeLandingPrice);
  }, [priceResult]);

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setSelectedMrp(null);
    setSheetOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm(productToForm(product));
    setSelectedMrp(product.suggestedMrp);
    setSheetOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      await apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product Created", description: "New product has been added." });
      setSheetOpen(false);
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertProduct }) => {
      await apiRequest("PATCH", `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product Updated", description: "Product has been saved." });
      setSheetOpen(false);
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product Deleted", description: "Product has been removed." });
    },
  });

  const bulkMutation = useMutation({
    mutationFn: async (products: InsertProduct[]) => {
      await apiRequest("POST", "/api/products/bulk", { products });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Bulk Import Complete", description: `${csvData.length} products imported.` });
      setCsvDialogOpen(false);
      setCsvData([]);
    },
    onError: (err: Error) => {
      toast({ title: "Import Error", description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    if (!form.name || !form.categoryId) {
      toast({ title: "Validation Error", description: "Name and Category are required.", variant: "destructive" });
      return;
    }
    const payload = formToPayload(form);
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim());
      if (lines.length < 2) {
        toast({ title: "Invalid CSV", description: "CSV must have a header row and at least one data row.", variant: "destructive" });
        return;
      }
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const parsed: InsertProduct[] = [];
      for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(",").map((v) => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => (row[h] = vals[idx] || ""));
        parsed.push({
          name: row["name"] || `Product ${i}`,
          categoryId: Number(row["categoryid"] || row["category_id"]) || 1,
          image: row["image"] || null,
          exwPriceYuan: Number(row["exwpriceyuan"] || row["exw_price_yuan"] || row["exw"]) || 0,
          unitsPerCarton: Number(row["unitspercarton"] || row["units_per_carton"]) || 1,
          cartonLengthCm: Number(row["cartonlengthcm"] || row["carton_length_cm"] || row["length"]) || 0,
          cartonWidthCm: Number(row["cartonwidthcm"] || row["carton_width_cm"] || row["width"]) || 0,
          cartonHeightCm: Number(row["cartonheightcm"] || row["carton_height_cm"] || row["height"]) || 0,
          cartonWeightKg: Number(row["cartonweightkg"] || row["carton_weight_kg"] || row["weight"]) || null,
          moq: Number(row["moq"]) || null,
          supplierName: row["suppliername"] || row["supplier_name"] || row["supplier"] || null,
          hsCode: row["hscode"] || row["hs_code"] || null,
          tags: row["tags"] ? row["tags"].split(";").map((t) => t.trim()) : [],
          status: row["status"] || "Active",
        });
      }
      setCsvData(parsed);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getCsvPricePreview = (item: InsertProduct) => {
    const cat = categories.find((c) => c.id === item.categoryId);
    if (!settingsMap.exchange_rate) return null;
    const inputs: PriceInputs = {
      exwPriceYuan: item.exwPriceYuan,
      unitsPerCarton: item.unitsPerCarton,
      cartonLengthCm: item.cartonLengthCm,
      cartonWidthCm: item.cartonWidthCm,
      cartonHeightCm: item.cartonHeightCm,
      categoryDutyPercent: cat?.customsDutyPercent ?? 0,
      categoryIgstPercent: cat?.igstPercent ?? 18,
      exchangeRate: settingsMap.exchange_rate,
      sourcingCommission: settingsMap.sourcing_commission ?? 7,
      freightPerCbm: settingsMap.freight_per_cbm ?? 6000,
      insurancePercent: settingsMap.insurance_percent ?? 1.125,
      swSurchargePercent: settingsMap.sw_surcharge_percent ?? 10,
      ourMarkupPercent: settingsMap.our_markup_percent ?? 20,
      targetStoreMargin: settingsMap.target_store_margin ?? 45,
    };
    return calculatePrices(inputs);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3 ml-1 text-primary" /> : <ArrowDown className="h-3 w-3 ml-1 text-primary" />;
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const catName = categoryMap[p.categoryId]?.name || "";
      const matchSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        catName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = filterCategory === "all" || String(p.categoryId) === filterCategory;
      const matchStatus = filterStatus === "all" || p.status === filterStatus;

      let matchMargin = true;
      if (filterMargin === "high") matchMargin = (p.storeMarginPercent ?? 0) >= 50;
      else if (filterMargin === "mid") matchMargin = (p.storeMarginPercent ?? 0) >= 35 && (p.storeMarginPercent ?? 0) < 50;
      else if (filterMargin === "low") matchMargin = (p.storeMarginPercent ?? 0) < 35;

      return matchSearch && matchCategory && matchStatus && matchMargin;
    });

    result.sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;
      switch (sortField) {
        case "name": aVal = a.name.toLowerCase(); bVal = b.name.toLowerCase(); break;
        case "storeLandingPrice": aVal = a.storeLandingPrice ?? 0; bVal = b.storeLandingPrice ?? 0; break;
        case "suggestedMrp": aVal = a.suggestedMrp ?? 0; bVal = b.suggestedMrp ?? 0; break;
        case "storeMarginPercent": aVal = a.storeMarginPercent ?? 0; bVal = b.storeMarginPercent ?? 0; break;
        case "exwPriceYuan": aVal = a.exwPriceYuan ?? 0; bVal = b.exwPriceYuan ?? 0; break;
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, searchTerm, filterCategory, filterStatus, filterMargin, sortField, sortDir, categoryMap]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const clampedPage = Math.max(1, Math.min(currentPage, totalPages));
  const paginatedProducts = filteredProducts.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  const metrics = useMemo(() => {
    const active = products.filter((p) => p.status === "Active").length;
    const margins = products.filter((p) => p.storeMarginPercent != null).map((p) => p.storeMarginPercent!);
    const avgMargin = margins.length > 0 ? margins.reduce((s, m) => s + m, 0) / margins.length : 0;
    const uniqueCats = new Set(products.map((p) => p.categoryId)).size;
    const avgLandingPrice = products.length > 0 ? products.reduce((s, p) => s + (p.storeLandingPrice ?? 0), 0) / products.length : 0;
    return { total: products.length, active, avgMargin, uniqueCats, avgLandingPrice };
  }, [products]);

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Active: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
      Draft: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
      Discontinued: "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700",
    };
    return styles[status] || styles.Active;
  };

  const activeFilters = [filterCategory !== "all", filterStatus !== "all", filterMargin !== "all"].filter(Boolean).length;

  const clearFilters = () => {
    setFilterCategory("all");
    setFilterStatus("all");
    setFilterMargin("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-display font-bold" data-testid="text-products-title">
            Product Management
          </h1>
          <p className="text-muted-foreground">Manage your inventory of {products.length.toLocaleString()} products.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCsvDialogOpen(true)}
            data-testid="button-csv-import"
          >
            <Upload className="h-4 w-4 mr-2" /> CSV Import
          </Button>
          <Button onClick={openAdd} data-testid="button-add-product">
            <Plus className="h-4 w-4 mr-2" /> Add New Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="card-metric-total">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{metrics.total.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-metric-active">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 dark:bg-green-500/20">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Products</p>
                <p className="text-2xl font-bold">{metrics.active.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-metric-margin">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Margin</p>
                <p className="text-2xl font-bold">{metrics.avgMargin.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-metric-categories">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{metrics.uniqueCats}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="flex items-center gap-2">
                Inventory List
                <Badge variant="secondary" className="font-mono text-xs">{filteredProducts.length}</Badge>
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  data-testid="input-search-products"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterCategory} onValueChange={(v) => { setFilterCategory(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[160px]" data-testid="filter-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[140px]" data-testid="filter-status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterMargin} onValueChange={(v) => { setFilterMargin(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[150px]" data-testid="filter-margin">
                  <SelectValue placeholder="All Margins" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Margins</SelectItem>
                  <SelectItem value="high">High (50%+)</SelectItem>
                  <SelectItem value="mid">Mid (35-50%)</SelectItem>
                  <SelectItem value="low">Low (&lt;35%)</SelectItem>
                </SelectContent>
              </Select>
              {activeFilters > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                  <X className="h-3 w-3 mr-1" /> Clear {activeFilters} filter{activeFilters > 1 ? "s" : ""}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground" data-testid="text-empty-products">
              <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <button onClick={() => toggleSort("name")} className="flex items-center font-medium" data-testid="sort-name">
                          Product Name <SortIcon field="name" />
                        </button>
                      </TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>
                        <button onClick={() => toggleSort("exwPriceYuan")} className="flex items-center font-medium" data-testid="sort-exw">
                          EXW <SortIcon field="exwPriceYuan" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button onClick={() => toggleSort("storeLandingPrice")} className="flex items-center font-medium" data-testid="sort-landing">
                          Landing <SortIcon field="storeLandingPrice" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button onClick={() => toggleSort("suggestedMrp")} className="flex items-center font-medium" data-testid="sort-mrp">
                          MRP <SortIcon field="suggestedMrp" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button onClick={() => toggleSort("storeMarginPercent")} className="flex items-center font-medium" data-testid="sort-margin">
                          Margin <SortIcon field="storeMarginPercent" />
                        </button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProducts.map((product) => (
                      <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {(() => {
                              const imgSrc = product.image || getProductImage(product.id, categoryMap[product.categoryId]?.name || "");
                              return imgSrc ? (
                                <img src={imgSrc} className="h-8 w-8 rounded object-cover bg-muted" alt="" loading="lazy" decoding="async" />
                              ) : (
                                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">{product.name.slice(0,2).toUpperCase()}</div>
                              );
                            })()}
                            <span className="max-w-[200px] truncate" data-testid={`text-product-name-${product.id}`}>{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell data-testid={`text-product-category-${product.id}`}>
                          <span className="text-sm">{categoryMap[product.categoryId]?.name || "—"}</span>
                        </TableCell>
                        <TableCell className="font-mono text-sm" data-testid={`text-exw-${product.id}`}>
                          {product.exwPriceYuan != null ? `¥${product.exwPriceYuan.toFixed(2)}` : "—"}
                        </TableCell>
                        <TableCell data-testid={`text-landing-price-${product.id}`}>
                          {INR(product.storeLandingPrice)}
                        </TableCell>
                        <TableCell data-testid={`text-mrp-${product.id}`}>
                          {product.suggestedMrp != null ? `₹${product.suggestedMrp}` : "—"}
                        </TableCell>
                        <TableCell data-testid={`text-margin-${product.id}`}>
                          <span
                            className={
                              (product.storeMarginPercent ?? 0) >= 50
                                ? "text-green-600 font-medium"
                                : (product.storeMarginPercent ?? 0) >= 35
                                ? "text-blue-600 font-medium"
                                : "text-red-600 font-medium"
                            }
                          >
                            {product.storeMarginPercent != null
                              ? `${product.storeMarginPercent}%`
                              : "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusBadge(product.status)}
                            data-testid={`badge-status-${product.id}`}
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(product)}
                            data-testid={`button-edit-${product.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => deleteMutation.mutate(product.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${product.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Showing {((clampedPage - 1) * pageSize) + 1}–{Math.min(clampedPage * pageSize, filteredProducts.length)} of {filteredProducts.length}</span>
                  <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
                    <SelectTrigger className="w-[80px]" data-testid="select-page-size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((s) => (
                        <SelectItem key={s} value={String(s)}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>per page</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled={clampedPage <= 1} onClick={() => setCurrentPage(1)} data-testid="button-page-first">
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={clampedPage <= 1} onClick={() => setCurrentPage((p) => p - 1)} data-testid="button-page-prev">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-3 text-sm font-medium" data-testid="text-page-info">
                    {clampedPage} / {totalPages}
                  </span>
                  <Button variant="outline" size="sm" disabled={clampedPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)} data-testid="button-page-next">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={clampedPage >= totalPages} onClick={() => setCurrentPage(totalPages)} data-testid="button-page-last">
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto" data-testid="sheet-product-form">
          <SheetHeader>
            <SheetTitle data-testid="text-sheet-title">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </SheetTitle>
            <SheetDescription>
              {editingProduct ? "Update product details below." : "Fill in the details for the new product."}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Section 1: Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Basic Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Enter product name"
                  data-testid="input-product-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={form.categoryId} onValueChange={(v) => updateField("categoryId", v)}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)} data-testid={`option-category-${cat.id}`}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s} data-testid={`option-status-${s}`}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={form.image}
                  onChange={(e) => updateField("image", e.target.value)}
                  placeholder="https://..."
                  data-testid="input-image-url"
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2" data-testid="tags-container">
                  {PRODUCT_TAGS.map((tag) => {
                    const selected = form.tags.includes(tag);
                    return (
                      <Badge
                        key={tag}
                        variant={selected ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-primary/10"
                        }`}
                        onClick={() => {
                          const next = selected
                            ? form.tags.filter((t) => t !== tag)
                            : [...form.tags, tag];
                          updateField("tags", next);
                        }}
                        data-testid={`tag-${tag.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {tag}
                        {selected && <X className="h-3 w-3 ml-1" />}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplierName">Supplier Name</Label>
                  <Input
                    id="supplierName"
                    value={form.supplierName}
                    onChange={(e) => updateField("supplierName", e.target.value)}
                    placeholder="Supplier"
                    data-testid="input-supplier-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moq">MOQ</Label>
                  <Input
                    id="moq"
                    type="number"
                    value={form.moq}
                    onChange={(e) => updateField("moq", e.target.value)}
                    placeholder="Min order qty"
                    data-testid="input-moq"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Sourcing Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Sourcing Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exwPriceYuan">EXW Price (¥) *</Label>
                  <Input
                    id="exwPriceYuan"
                    type="number"
                    step="0.01"
                    value={form.exwPriceYuan}
                    onChange={(e) => updateField("exwPriceYuan", e.target.value)}
                    placeholder="0.00"
                    data-testid="input-exw-price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitsPerCarton">Units / Carton *</Label>
                  <Input
                    id="unitsPerCarton"
                    type="number"
                    value={form.unitsPerCarton}
                    onChange={(e) => updateField("unitsPerCarton", e.target.value)}
                    placeholder="1"
                    data-testid="input-units-per-carton"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cartonLengthCm">Length (cm)</Label>
                  <Input
                    id="cartonLengthCm"
                    type="number"
                    value={form.cartonLengthCm}
                    onChange={(e) => updateField("cartonLengthCm", e.target.value)}
                    placeholder="0"
                    data-testid="input-carton-length"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cartonWidthCm">Width (cm)</Label>
                  <Input
                    id="cartonWidthCm"
                    type="number"
                    value={form.cartonWidthCm}
                    onChange={(e) => updateField("cartonWidthCm", e.target.value)}
                    placeholder="0"
                    data-testid="input-carton-width"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cartonHeightCm">Height (cm)</Label>
                  <Input
                    id="cartonHeightCm"
                    type="number"
                    value={form.cartonHeightCm}
                    onChange={(e) => updateField("cartonHeightCm", e.target.value)}
                    placeholder="0"
                    data-testid="input-carton-height"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cartonWeightKg">Carton Weight (kg)</Label>
                  <Input
                    id="cartonWeightKg"
                    type="number"
                    step="0.1"
                    value={form.cartonWeightKg}
                    onChange={(e) => updateField("cartonWeightKg", e.target.value)}
                    placeholder="0.0"
                    data-testid="input-carton-weight"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hsCode">HS Code</Label>
                  <Input
                    id="hsCode"
                    value={form.hsCode}
                    onChange={(e) => updateField("hsCode", e.target.value)}
                    placeholder="0000.00.00"
                    data-testid="input-hs-code"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Live Price Breakdown */}
            {priceResult && (
              <div className="space-y-4" data-testid="section-price-breakdown">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  Live Price Breakdown
                </h3>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>EXW:</span>
                    <span data-testid="price-exw">{YUAN(Number(form.exwPriceYuan))}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>+ Sourcing: ({settingsMap.sourcing_commission ?? 7}%)</span>
                    <span data-testid="price-sourcing">{YUAN(priceResult.sourcingYuan)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>FOB:</span>
                    <span data-testid="price-fob">
                      {YUAN(priceResult.fobPriceYuan)} → {INR(priceResult.fobPriceInr)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>+ Freight per unit:</span>
                    <span data-testid="price-freight">{INR(priceResult.freightPerUnit)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>+ Insurance:</span>
                    <span data-testid="price-insurance">{INR(priceResult.insuranceInr)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>CIF:</span>
                    <span data-testid="price-cif">{INR(priceResult.cifPriceInr)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>+ Duty: ({categoryMap[Number(form.categoryId)]?.customsDutyPercent ?? 0}%)</span>
                    <span data-testid="price-duty">{INR(priceResult.customsDuty)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>+ SWS:</span>
                    <span data-testid="price-sws">{INR(priceResult.swSurcharge)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assessable:</span>
                    <span data-testid="price-assessable">{INR(priceResult.assessableValue)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>+ IGST: ({categoryMap[Number(form.categoryId)]?.igstPercent ?? 18}%)</span>
                    <span data-testid="price-igst">{INR(priceResult.igst)}</span>
                  </div>

                  <div className="border-t border-dashed border-muted-foreground/30 my-2" />

                  <div className="flex justify-between font-bold text-base">
                    <span>LANDED COST:</span>
                    <span data-testid="price-landed-cost">{INR(priceResult.totalLandedCost)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>+ Our Markup: ({settingsMap.our_markup_percent ?? 20}%)</span>
                    <span data-testid="price-markup">{INR(priceResult.markupInr)}</span>
                  </div>

                  <div className="border-t-2 border-foreground/20 my-2" />

                  <div className="flex justify-between font-bold text-base text-primary">
                    <span>STORE PRICE:</span>
                    <span data-testid="price-store-landing">{INR(priceResult.storeLandingPrice)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>SUGGESTED MRP:</span>
                    <span data-testid="price-suggested-mrp">
                      ₹{selectedMrp ?? priceResult.suggestedMrp}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>STORE MARGIN:</span>
                    <span
                      className={
                        priceResult.storeMarginPercent >= 35
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                      data-testid="price-store-margin"
                    >
                      {INR(priceResult.storeMarginRs)} ({priceResult.storeMarginPercent}%)
                    </span>
                  </div>
                </div>

                {/* MRP Band Options */}
                {mrpOptions.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                      MRP Band Options
                    </Label>
                    <div className="grid grid-cols-3 gap-2" data-testid="mrp-bands-container">
                      {mrpOptions.map((opt) => {
                        const isSelected = (selectedMrp ?? priceResult.suggestedMrp) === opt.mrp;
                        return (
                          <button
                            key={opt.mrp}
                            type="button"
                            onClick={() => setSelectedMrp(opt.mrp)}
                            className={`relative rounded-lg border p-3 text-center transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                : "border-border hover:border-primary/40"
                            }`}
                            data-testid={`mrp-band-${opt.mrp}`}
                          >
                            {isSelected && (
                              <Check className="absolute top-1 right-1 h-3 w-3 text-primary" />
                            )}
                            <div className="font-bold text-lg">₹{opt.mrp}</div>
                            <div
                              className={`text-xs font-medium ${
                                opt.status === "good"
                                  ? "text-green-600"
                                  : opt.status === "ok"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {opt.marginPercent}% margin
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {INR(opt.marginRs)}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex-1"
                data-testid="button-save-product"
              >
                {isSaving ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSheetOpen(false)}
                data-testid="button-cancel-product"
              >
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* CSV Bulk Import Dialog */}
      <Dialog open={csvDialogOpen} onOpenChange={setCsvDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" data-testid="dialog-csv-import">
          <DialogHeader>
            <DialogTitle>CSV Bulk Import</DialogTitle>
            <DialogDescription>
              Upload a CSV file with product data. Required columns: name, categoryId, exwPriceYuan, unitsPerCarton.
              Optional: cartonLengthCm, cartonWidthCm, cartonHeightCm, cartonWeightKg, image, moq, supplierName, hsCode, tags, status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="hidden"
                data-testid="input-csv-file"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                data-testid="button-choose-csv"
              >
                <Upload className="h-4 w-4 mr-2" /> Choose CSV File
              </Button>
              {csvFileName && (
                <span className="text-sm text-muted-foreground" data-testid="text-csv-filename">
                  {csvFileName}
                </span>
              )}
            </div>

            {csvData.length > 0 && (
              <>
                <div className="text-sm font-medium" data-testid="text-csv-count">
                  {csvData.length} product{csvData.length !== 1 ? "s" : ""} ready to import
                </div>
                <div className="border rounded-lg overflow-auto max-h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>EXW (¥)</TableHead>
                        <TableHead>Units/Ctn</TableHead>
                        <TableHead>Landing</TableHead>
                        <TableHead>MRP</TableHead>
                        <TableHead>Margin</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.map((item, idx) => {
                        const pr = getCsvPricePreview(item);
                        return (
                          <TableRow key={idx} data-testid={`row-csv-preview-${idx}`}>
                            <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>¥{item.exwPriceYuan}</TableCell>
                            <TableCell>{item.unitsPerCarton}</TableCell>
                            <TableCell>{pr ? INR(pr.storeLandingPrice) : "—"}</TableCell>
                            <TableCell>{pr ? `₹${pr.suggestedMrp}` : "—"}</TableCell>
                            <TableCell>
                              {pr ? (
                                <span className={pr.storeMarginPercent >= 35 ? "text-green-600" : "text-red-600"}>
                                  {pr.storeMarginPercent}%
                                </span>
                              ) : (
                                "—"
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setCsvDialogOpen(false); setCsvData([]); }} data-testid="button-cancel-csv">
              Cancel
            </Button>
            <Button
              onClick={() => bulkMutation.mutate(csvData)}
              disabled={csvData.length === 0 || bulkMutation.isPending}
              data-testid="button-confirm-csv-import"
            >
              {bulkMutation.isPending ? "Importing..." : `Import ${csvData.length} Products`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

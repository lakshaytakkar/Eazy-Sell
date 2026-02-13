import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import type { Product, Category } from "@shared/schema";

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categoriesData = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const categoryMap = Object.fromEntries(categoriesData.map(c => [c.id, c.name]));

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product Deleted", description: "Product has been removed." });
    },
  });

  const filteredProducts = products.filter(p => {
    const catName = categoryMap[p.categoryId] || "";
    return p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      catName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64" data-testid="loading-state">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold" data-testid="text-products-title">Product Management</h1>
          <p className="text-muted-foreground">Add, edit, or remove inventory items.</p>
        </div>
        <Button data-testid="button-add-product"><Plus className="h-4 w-4 mr-2" /> Add New Product</Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
           <div className="flex items-center justify-between">
              <CardTitle>Inventory List</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search products..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    data-testid="input-search-products"
                />
              </div>
           </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="text-empty-products">No products found.</div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Cost Price</TableHead>
                <TableHead>MRP</TableHead>
                <TableHead>Margin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <img src={product.image || ""} className="h-8 w-8 rounded object-cover bg-muted" />
                        <span data-testid={`text-product-name-${product.id}`}>{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell data-testid={`text-product-category-${product.id}`}>{categoryMap[product.categoryId] || "Uncategorized"}</TableCell>
                  <TableCell>₹{product.costPrice}</TableCell>
                  <TableCell>₹{product.mrp}</TableCell>
                  <TableCell className="text-green-600 font-medium">
                    {Math.round(((product.mrp - product.costPrice) / product.mrp) * 100)}%
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200" data-testid={`badge-status-${product.id}`}>
                        {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" data-testid={`button-edit-${product.id}`}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate(product.id)} disabled={deleteMutation.isPending} data-testid={`button-delete-${product.id}`}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}